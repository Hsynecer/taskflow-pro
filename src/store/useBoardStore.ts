import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Column = {
  id: string;
  title: string;
  order: number;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
};

interface BoardState {
  columns: Column[];
  tasks: Task[];
  isLoading: boolean;
  
  initializeBoard: () => Promise<void>;
  addTask: (title: string, columnId: string) => Promise<void>;
  moveTask: (taskId: string, newColumnId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>; // YENİ EKLENDİ
}

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: [],
  tasks: [],
  isLoading: true,

  initializeBoard: async () => {
    set({ isLoading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let { data: boards } = await supabase.from('boards').select('*').eq('user_id', user.id);
    let activeBoardId = null;

    if (!boards || boards.length === 0) {
      const { data: newBoard } = await supabase.from('boards').insert([{ user_id: user.id, title: 'Ana Pano' }]).select().single();
      if (newBoard) {
        activeBoardId = newBoard.id;
        await supabase.from('columns').insert([
          { board_id: activeBoardId, title: 'To Do', order: 1 },
          { board_id: activeBoardId, title: 'In Progress', order: 2 },
          { board_id: activeBoardId, title: 'Done', order: 3 }
        ]);
      }
    } else {
      activeBoardId = boards[0].id;
    }

    if (activeBoardId) {
      const [columnsResponse, tasksResponse] = await Promise.all([
        supabase.from('columns').select('*').eq('board_id', activeBoardId).order('order'),
        supabase.from('tasks').select('*, columns!inner(board_id)').eq('columns.board_id', activeBoardId).order('order')
      ]);

      if (columnsResponse.data) set({ columns: columnsResponse.data.map(c => ({ id: c.id, title: c.title, order: c.order })) });
      
      if (tasksResponse.data) {
        set({ tasks: tasksResponse.data.map(t => ({
          id: t.id, title: t.title, description: t.description, columnId: t.column_id, order: t.order
        })) });
      }
    }
    set({ isLoading: false });
  },

  addTask: async (title, columnId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let description = "AI tarafından analiz ediliyor...";
    
    try {
      const aiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${title} görevini 3-4 maddelik teknik bir alt görev listesine böl.` }),
      });
      const aiData = await aiResponse.json();
      let rawText = aiData.output || aiData.text || aiData.result || aiData.message || JSON.stringify(aiData);

      try {
        const parsed = typeof rawText === 'string' ? JSON.parse(rawText) : rawText;
        if (parsed && parsed.suggestions && Array.isArray(parsed.suggestions)) {
          description = parsed.suggestions.map((madde: string) => `• ${madde}`).join('\n');
        } else {
          description = rawText;
        }
      } catch (parseError) {
        description = rawText;
      }
    } catch (e) {
      description = "AI analizi şu an yapılamadı.";
    }

    const newTask = { title, description, column_id: columnId, user_id: user.id, order: get().tasks.length };
    const { data, error } = await supabase.from('tasks').insert([newTask]).select().single();

    if (!error && data) {
      set({ tasks: [...get().tasks, { id: data.id, title: data.title, description: data.description, columnId: data.column_id, order: data.order }] });
    }
  },

  moveTask: async (taskId, newColumnId) => {
    const updatedTasks = get().tasks.map(t => t.id === taskId ? { ...t, columnId: newColumnId } : t);
    set({ tasks: updatedTasks });
    await supabase.from('tasks').update({ column_id: newColumnId }).eq('id', taskId);
  },

  // YENİ SİLME FONKSİYONU
  deleteTask: async (taskId) => {
    // Arayüzden anında sil (Optimistic UI)
    const previousTasks = get().tasks;
    set({ tasks: previousTasks.filter(t => t.id !== taskId) });

    // Veritabanından sil
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    
    // Eğer veritabanında hata olursa kartı geri getir
    if (error) {
      console.error("Silme işlemi başarısız:", error);
      set({ tasks: previousTasks });
    }
  }
}));


