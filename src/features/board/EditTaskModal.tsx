import { useState, useEffect, useMemo } from "react";
import { useBoardStore } from "./boardStore";
import { ASSIGNEES } from "../../data/assignees";
import type { Priority, ColumnType } from "../../types/task";
import DescriptionEditor from "./DescriptionEditor";

interface Props {
  taskId: string;
  onClose: () => void;
}

const EditTaskModal = ({ taskId, onClose }: Props) => {
  // ✅ Subscribe only to required slices
  const tasks = useBoardStore((state) => state.tasks);
  const updateTask = useBoardStore((state) => state.updateTask);
  const allLogs = useBoardStore((state) => state.logs);

  // ✅ Compute task outside selector (prevents loop)
  const task = useMemo(
    () => tasks.find((t) => t.id === taskId),
    [tasks, taskId]
  );

  // ✅ Memoize filtered logs to prevent infinite render loop
  const logs = useMemo(
    () => allLogs.filter((l) => l.taskId === taskId),
    [allLogs, taskId]
  );

  // Local editable state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [column, setColumn] = useState<ColumnType>("todo");
  const [dueDate, setDueDate] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  // Get today's date as minimum
  const today = new Date().toISOString().split('T')[0];

  // ✅ Initialize form when task changes
  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setColumn(task.column);
    setDueDate(task.dueDate || "");
    setSelectedAssignees(task.attachees || []);
  }, [task, taskId]);

  if (!task) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Task not found</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateTask({
      ...task,
      title,
      description,
      priority,
      column,
      dueDate,
      attachees: selectedAssignees,
    });

    onClose();
  };



  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex overflow-hidden relative z-[101]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col bg-white">

          {/* HEADER */}
          <div className="px-8 py-8 border-b border-gray-100 flex justify-between items-start flex-shrink-0">
            <div className="flex-1 mr-4">
              <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">
                {column.toUpperCase()} / {task.id.slice(0, 8)}
              </div>

              <input
                type="text"
                className="text-3xl font-bold text-gray-800 w-full border-none focus:ring-0 p-0 bg-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
              />
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-8 py-8">

            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
                Description
              </h3>

              <DescriptionEditor
                initialContent={description}
                onChange={setDescription}
                placeholder="Add description..."
              />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
                Activity
              </h3>

              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="text-sm">
                    <p>
                      <span className="font-semibold">User</span> {log.action}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}

                {logs.length === 0 && (
                  <p className="text-gray-400 italic text-sm">
                    No activity yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-80 bg-gray-50 border-l border-gray-100 p-6 flex flex-col gap-6">

          {/* STATUS */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">
              Status
            </label>

            <select
              value={column}
              onChange={(e) => setColumn(e.target.value as ColumnType)}
              className="w-full bg-white border border-gray-200 py-2 px-3 rounded-lg mt-1"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* PRIORITY */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-white border border-gray-200 py-2 px-3 rounded-lg mt-1"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* DUE DATE */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">
              Due Date
            </label>

            <input
              type="date"
              min={today}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white border border-gray-200 py-2 px-3 rounded-lg mt-1"
            />
          </div>

          {/* ASSIGNEES */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">
              Assign To
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ASSIGNEES.map((assignee) => (
                <label key={assignee.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedAssignees.includes(assignee.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAssignees([...selectedAssignees, assignee.id]);
                      } else {
                        setSelectedAssignees(selectedAssignees.filter(id => id !== assignee.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">{assignee.name}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-auto pt-6 border-t border-gray-200 flex flex-col gap-3">
            <button
              onClick={handleSave}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditTaskModal;
