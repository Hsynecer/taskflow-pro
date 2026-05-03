'use client';

import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
// Yolları nokta atışı güncelledik:
import { Column } from '../src/components/Column';
import { useBoardStore } from '../src/store/useBoardStore';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function Home() {
  const { tasks, setTasks, moveTask } = useBoardStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (tasks.length === 0) {
      setTasks([
        { id: '1', title: 'Supabase bağlantısını kontrol et', columnId: 'todo' },
        { id: '2', title: 'Zustand store entegrasyonu', columnId: 'in-progress' },
        { id: '3', title: 'KoçSistem Projesini Başarıyla Teslim Et', columnId: 'todo' },
      ]);
    }
  }, [tasks.length, setTasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const overId = over.id as string;
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      if (active.data.current?.task.columnId !== overTask.columnId) {
        moveTask(taskId, overTask.columnId);
      }
      return;
    }
    const overColumn = COLUMNS.find((c) => c.id === overId);
    if (overColumn) {
      moveTask(taskId, overColumn.id);
    }
  };

  if (!isClient) return null; 

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-blue-600">TaskFlow Pro</h1>
          <p className="text-gray-500 mt-2">KoçSistem NewChapter Teknik Projesi</p>
        </header>

        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 justify-center overflow-x-auto pb-4">
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

