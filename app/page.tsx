'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';

import { Column } from '../src/components/Column';
import { useBoardStore } from '../src/store/useBoardStore';
import { supabase } from '../src/lib/supabase'; 

export default function Home() {
  const router = useRouter();
  
  // DİKKAT: setTasks sildik, yerine initializeBoard ve columns ekledik
  const { columns, tasks, initializeBoard, moveTask, isLoading } = useBoardStore();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        initializeBoard(); 
      }
    };
    checkAuth();
  }, [router, initializeBoard]);

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

    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn) {
      moveTask(taskId, overColumn.id);
    }
  };

  if (!isClient) return null;

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Çalışma alanı hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-blue-600">TaskFlow Pro</h1>
          <p className="text-gray-500 mt-2">KoçSistem NewChapter Teknik Projesi</p>
        </header>

        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 justify-center overflow-x-auto pb-4">
            {columns.map((column) => (
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


