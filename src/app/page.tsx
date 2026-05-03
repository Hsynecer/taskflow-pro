'use client';

import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { Column } from '../components/Column';
import { useBoardStore } from '../store/useBoardStore';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function Home() {
  const { tasks, setTasks, moveTask } = useBoardStore();
  const [isClient, setIsClient] = useState(false);

  // Sayfa yüklendiğinde test için sahte veriler ekleyelim
  useEffect(() => {
    setIsClient(true);
    if (tasks.length === 0) {
      setTasks([
        { id: '1', title: 'Supabase veritabanını bağla', columnId: 'todo' },
        { id: '2', title: 'Zustand ile state management kur', columnId: 'in-progress' },
        { id: '3', title: 'KoçSistem GenAI TaskFlow Projeyi Teslim Et', columnId: 'todo' },
      ]);
    }
  }, [tasks.length, setTasks]);

  // Kart bırakıldığında çalışacak fonksiyon
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Eğer bir kartın (TaskCard) üzerine bırakıldıysa
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      if (active.data.current?.task.columnId !== overTask.columnId) {
        moveTask(taskId, overTask.columnId);
      }
      return;
    }

    // Eğer doğrudan bir sütunun (Column) üzerine bırakıldıysa
    const overColumn = COLUMNS.find((c) => c.id === overId);
    if (overColumn) {
      moveTask(taskId, overColumn.id);
    }
  };

  if (!isClient) return null; // Hydration hatalarını önlemek için

  return (
    <main className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">TaskFlow Pro</h1>
          <p className="text-gray-500 mt-2 text-lg">KoçSistem GenAI Teknik Testi</p>
        </header>

        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                columnId={column.id}
                title={column.title}
                tasks={tasks.filter((t) => t.columnId === column.id)}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </main>
  );
}

