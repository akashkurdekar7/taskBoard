import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ColumnType, Task } from "../../types/task";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  column: ColumnType;
  tasks: Task[];
  onEditTask: (id: string) => void;
}

const Column = ({ title, column, tasks, onEditTask }: Props) => {
  const { setNodeRef } = useDroppable({
    id: column,
  });

  const isTodo = column === 'todo';
  const isDoing = column === 'doing';
  // const isDone = column === 'done'; // unused for now

  const borderColor = isTodo ? 'border-indigo-200' : isDoing ? 'border-purple-200' : 'border-green-200';
  const bgHeader = isTodo ? 'bg-indigo-50 text-indigo-700' : isDoing ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700';

  return (
    <div className="flex flex-col w-80 h-full max-h-[calc(100vh-200px)]">
      {/* Column Header */}
      <div className={`p-4 rounded-t-2xl border-x border-t ${borderColor} bg-white flex justify-between items-center shadow-sm z-10`}>
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isTodo ? 'bg-indigo-500' : isDoing ? 'bg-purple-500' : 'bg-green-500'}`}></div>
            <h2 className="font-bold text-gray-700">{title}</h2>
        </div>
        <span className={`${bgHeader} text-xs font-bold px-2.5 py-1 rounded-full`}>
          {tasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-3 bg-gray-50/50 border-x border-b ${borderColor} rounded-b-2xl overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-200`}
      >
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task.id)} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
            <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
                Drop here
            </div>
        )}
      </div>
    </div>
  );
};

export default Column;
