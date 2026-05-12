'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';

import { Column } from '../src/components/Column';
import { useBoardStore } from '../src/store/useBoardStore';
import { supabase } from '../src/lib/supabase';

export default function Home() {
  const router = useRouter();
  
  const { columns, tasks, initializeBoard, moveTask, isLoading } = useBoardStore();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // MOBİL SEKMELER İÇİN YENİ STATE
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sütunlar yüklendiğinde ilk sekmeyi otomatik seç
  useEffect(() => {
    if (columns.length > 0 && !activeTab) {
      setActiveTab(columns[0].id);
    }
  }, [columns, activeTab]);

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
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-blue-600">TaskFlow Pro</h1>
          <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">KoçSistem NewChapter Teknik Projesi</p>
        </header>

        {/* SADECE MOBİLDE GÖRÜNEN SEKME MENÜSÜ */}
        <div className="md:hidden flex justify-between overflow-x-auto mb-6 bg-white rounded-lg shadow-sm p-1">
          {columns.map((col) => {
            const columnTasksCount = tasks.filter((t) => t.columnId === col.id).length;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold text-center rounded-md transition-all whitespace-nowrap ${
                  activeTab === col.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {col.title} <span className="ml-1 opacity-80">({columnTasksCount})</span>
              </button>
            );
          })}
        </div>

        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          {/* PANO */}
          <div className="flex flex-col md:flex-row md:gap-6 justify-center pb-4">
            {columns.map((column) => (
              <div
                key={column.id}
                // Mobilde sadece seçili sekmeyi gösterir, masaüstünde (md:block) hepsini yan yana dizer
                className={`${activeTab === column.id ? 'block' : 'hidden'} md:block w-full md:w-[350px] shrink-0`}
              >
                <Column
                  columnId={column.id}
                  title={column.title}
                  tasks={tasks.filter((t) => t.columnId === column.id)}
                />
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </main>
  );
}






