import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/task";
import { HiCalendar, HiPencil, HiFlag, HiBars2 } from "react-icons/hi2";
import { ASSIGNEES } from "../../data/assignees";

interface Props {
  task: Task;
  onEdit: () => void;
}

const TaskCard = ({ task, onEdit }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 relative overflow-hidden ${isDragging ? "opacity-50" : ""
        }`}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-indigo-500 transition-colors"></div>

      <div className="flex justify-between items-start mb-2">
        {/* Drag handle — only this area initiates drag */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 mr-1 text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 self-center"
          title="Drag to move"
        >
          <HiBars2 className="h-4 w-4" />
        </div>

        <span
          className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 flex-1 ${task.priority === "high"
              ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
              : task.priority === "urgent"
                ? "bg-red-50 text-red-600 border border-red-100"
                : task.priority === "normal"
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "bg-slate-50 text-slate-600 border border-slate-100"
            }`}
        >
          <HiFlag className="h-3 w-3 flex-shrink-0" />
          {task.priority}
        </span>

        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded ml-2">
            <HiCalendar className="h-3 w-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>

      {/* Clicking the title/card body opens the edit modal */}
      <h3
        onClick={onEdit}
        className="font-semibold text-gray-800 leading-snug mb-3 group-hover:text-indigo-600 transition-colors cursor-pointer"
      >
        {task.title}
      </h3>

      <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-1">
        <div className="flex items-center gap-1">
          {task.attachees && task.attachees.length > 0 ? (
            task.attachees.slice(0, 3).map((assigneeId) => {
              const assignee = ASSIGNEES.find((a) => a.id === assigneeId);
              return assignee ? (
                <div
                  key={assigneeId}
                  className="w-6 h-6 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white"
                  title={assignee.name}
                >
                  {assignee.avatar}
                </div>
              ) : null;
            })
          ) : (
            <span className="text-xs text-gray-400">No assignee</span>
          )}
          {task.attachees && task.attachees.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-[8px] font-bold text-gray-700">
              +{task.attachees.length - 3}
            </div>
          )}
        </div>

        {/* Edit button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600 focus:opacity-100"
          title="Edit Task"
        >
          <HiPencil className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
