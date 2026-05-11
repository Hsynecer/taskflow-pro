'use client';

import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Task, useBoardStore } from '../store/useBoardStore';
import { useState } from 'react';

interface ColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
}

export function Column({ columnId, title, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: columnId });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const addTask = useBoardStore((state) => state.addTask);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    setIsAdding(true);
    await addTask(newTaskTitle, columnId);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col w-80 bg-gray-50 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
      {/* Sütun Başlığı */}
      <div className="p-4 flex justify-between items-center bg-white rounded-t-xl border-b border-gray-100">
        <h2 className="font-bold text-gray-700 uppercase text-sm tracking-wider">{title}</h2>
        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Sürükle-Bırak Alanı */}
      <div ref={setNodeRef} className="flex-1 p-3 space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Yeni Görev Ekleme Alanı */}
      <div className="p-3 border-t border-gray-100">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Yeni görev yaz..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button
          onClick={handleAddTask}
          disabled={isAdding}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors disabled:bg-blue-300"
        >
          {isAdding ? 'Ekleniyor...' : '+ Görev Ekle'}
        </button>
      </div>
    </div>
  );
}

