'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardStore } from '../store/useBoardStore';

export function TaskCard(props: any) {
  const id = props.task?.id || props.id;
  const title = props.task?.title || props.title;
  const columnId = props.task?.columnId || props.columnId;

  const { addTask } = useBoardStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Column içindeki SortableContext ile uyumlu olması için useDraggable yerine useSortable kullanıyoruz
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: id,
    data: { task: { id, title, columnId } },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAIGenerate = async (e: React.MouseEvent) => {
    // Tıklamanın dış div'e (sürükleme alanına) ulaşmasını engeller
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ taskTitle: title }),
      });
      
      const data = await res.json();
      
      if (data.suggestions) {
        data.suggestions.forEach((subtask: string, index: number) => {
          addTask({
            id: `ai-${Date.now()}-${index}`,
            title: subtask,
            columnId: columnId 
          });
        });
      }
    } catch (error) {
      console.error("Alt görevler alınamadı:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white mb-3 rounded-lg shadow-sm border border-gray-200 group relative transition-shadow ${isDragging ? 'shadow-lg ring-2 ring-indigo-500' : 'hover:shadow-md'}`}
    >
      {/* Sürükleme işlevini ve dinleyicileri SADECE bu iç div'e (metin alanına) veriyoruz */}
      <div 
        {...attributes}
        {...listeners}
        className="p-4 cursor-grab active:cursor-grabbing w-full min-h-[60px]"
      >
        <p className="text-gray-700 font-medium pr-8 pointer-events-none">{title || "İsimsiz Görev"}</p>
      </div>
      
      {/* Buton sürükleme alanının dışında, kendi bağımsız tıklama olayıyla çalışır */}
      <button
        onClick={handleAIGenerate}
        onPointerDown={(e) => e.stopPropagation()} 
        disabled={isGenerating}
        className="absolute top-3 right-3 p-1.5 bg-indigo-50 text-indigo-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-100 disabled:opacity-50 z-10 cursor-pointer"
        title="Yapay Zeka ile Alt Görevlere Böl"
      >
        {isGenerating ? '⏳' : '✨'}
      </button>
    </div>
  );
}

