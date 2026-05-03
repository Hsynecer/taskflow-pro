import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Task } from '../store/useBoardStore';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
}

export function Column({ columnId, title, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: { type: 'Column', columnId },
  });

  return (
    <div className="bg-gray-50/80 p-4 rounded-2xl w-80 flex flex-col gap-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-bold text-gray-700">{title}</h2>
        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      {/* Sürükle-bırak alanının (DropZone) kendisi */}
      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[200px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}



