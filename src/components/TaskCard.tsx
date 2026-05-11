'use client';

import { useDraggable } from '@dnd-kit/core';
import { Task, useBoardStore } from '../store/useBoardStore';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 999 : 1, 
    boxShadow: isDragging ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : undefined,
  } : undefined;

  // Sürüklemeyi engellemeden butona tıklanmasını sağlayan fonksiyon
  const handleDelete = (e: React.PointerEvent) => {
    e.stopPropagation(); // Tıklamanın Dnd-kit'e gitmesini engeller
    deleteTask(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative bg-white p-4 rounded-xl border cursor-grab active:cursor-grabbing transition-colors mb-3 group 
        ${isDragging ? 'border-blue-500 opacity-90' : 'border-gray-200 hover:border-blue-300'}`}
    >
      {/* Şık Silme Butonu (Sadece üzerine gelince görünür) */}
      <button 
        onPointerDown={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 p-1"
        title="Görevi Sil"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>

      <div className="flex justify-between items-start mb-2 pr-6">
        <h3 className="text-sm font-bold text-gray-800 leading-snug">{task.title}</h3>
        {task.description && (
          <span title="AI Destekli" className="text-blue-500 text-[10px] font-extrabold bg-blue-50 px-2 py-1 rounded border border-blue-100 shrink-0">
            ✨ AI
          </span>
        )}
      </div>
      
      {task.description && (
        <div className="mt-3 text-xs text-gray-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100 whitespace-pre-wrap leading-relaxed">
          {task.description}
        </div>
      )}
    </div>
  );
}


