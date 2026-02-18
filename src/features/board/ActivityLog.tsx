import { useBoardStore } from "./boardStore";

const ActivityLog = () => {
  const logs = useBoardStore((state) => state.logs);

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200 w-80 max-h-80 flex flex-col transition-all hover:shadow-2xl">
            <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                Activity Log
            </h2>
            <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {logs.map((log) => (
                <div key={log.id} className="text-sm border-l-2 border-indigo-100 pl-3 py-1 relative group">
                    <div className="absolute -left-[7px] top-2 w-3 h-3 bg-white border-2 border-indigo-100 rounded-full group-hover:border-indigo-400 transition-colors"></div>
                    <p className="leading-snug">
                    <span className="font-semibold text-gray-800">{log.taskTitle}</span>{" "}
                    <span className="text-gray-500 text-xs">was {log.action}</span>
                    </p>
                    {log.details && (
                    <p className="text-xs text-gray-400 mt-0.5 italic">{log.details}</p>
                    )}
                    <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-wider font-medium">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ActivityLog;
