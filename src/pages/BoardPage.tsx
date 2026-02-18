import { useAuthStore } from "../features/auth/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBoardStore } from "../features/board/boardStore";
import Column from "../features/board/Column";
import EditTaskModal from "../features/board/EditTaskModal";
import CreateTaskModal from "../features/board/CreateTaskModal";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { ColumnType } from "../types/task";
import TaskCard from "../features/board/TaskCard";
import { HiPlus, HiArrowRightOnRectangle } from "react-icons/hi2";

const BoardPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const resetBoard = useBoardStore((state) => state.resetBoard);
  const tasks = useBoardStore((state) => state.tasks);
  const loadTasks = useBoardStore((state) => state.loadTasks);
  const moveTask = useBoardStore((state) => state.moveTask);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // over.id could be a column id ("todo","doing","done") or a task id
    // If it's a task id, find which column that task belongs to
    const validColumns: ColumnType[] = ["todo", "doing", "done"];
    let targetColumn: ColumnType;
    if (validColumns.includes(over.id as ColumnType)) {
      targetColumn = over.id as ColumnType;
    } else {
      // over is a task — use that task's column
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;
      targetColumn = overTask.column;
    }

    if (task.column !== targetColumn) {
      moveTask(taskId, targetColumn);
    }
  };

  const activeTask = tasks.find(t => t.id === activeId);


  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <p className="text-sm text-gray-500 mt-1">Organize and manage your tasks efficiently</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingTask(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <HiPlus className="h-5 w-5" />
              Add Task
            </button>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset the board? This will delete all tasks.")) {
                  resetBoard();
                }
              }}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors duration-200"
            >
              Reset
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 font-medium rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <HiArrowRightOnRectangle className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-3 gap-6 h-full">
            <Column
              title="To Do"
              column="todo"
              tasks={tasks.filter(t => t.column === 'todo')}
              onEditTask={(id) => setEditingTaskId(id)}
            />
            <Column
              title="In Progress"
              column="doing"
              tasks={tasks.filter(t => t.column === 'doing')}
              onEditTask={(id) => setEditingTaskId(id)}
            />
            <Column
              title="Done"
              column="done"
              tasks={tasks.filter(t => t.column === 'done')}
              onEditTask={(id) => setEditingTaskId(id)}
            />
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} onEdit={() => { }} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      {isCreatingTask && (
        <CreateTaskModal onClose={() => setIsCreatingTask(false)} />
      )}

      {editingTaskId && (
        <EditTaskModal
          taskId={editingTaskId}
          onClose={() => setEditingTaskId(null)}
        />
      )}
    </div>
  );
};

export default BoardPage;
