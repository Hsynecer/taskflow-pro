import { create } from 'zustand';

// Veri tiplerimizi (TypeScript) belirliyoruz
export interface Task {
  id: string;
  title: string;
  columnId: string;
}

interface BoardState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
}

// Global Store'umuzu oluşturuyoruz
export const useBoardStore = create<BoardState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  moveTask: (taskId, newColumnId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId: newColumnId } : t
      ),
    })),
}));

