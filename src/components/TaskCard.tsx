import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../store/useBoardStore';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Kart sürüklenirken arkada bıraktığı gölge/boşluk tasarımı
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-200 border-2 border-dashed border-gray-400 p-4 rounded-xl min-h-[80px] opacity-50"
      />
    );
  }

  // Kartın normal görünümü
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab hover:ring-2 hover:ring-blue-400 active:cursor-grabbing flex flex-col gap-2"
    >
      <p className="font-medium text-gray-700">{task.title}</p>
    </div>
  );
}
