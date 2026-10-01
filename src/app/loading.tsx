import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 min-h-[60vh] items-center justify-center p-6" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/90 px-8 py-6 shadow-2xl shadow-blue-500/10 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          <div className="absolute w-5 h-5 rounded-full bg-blue-500/20 blur-sm animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="loading-dot h-2 w-2 rounded-full bg-blue-400" />
          <div className="loading-dot h-2 w-2 rounded-full bg-indigo-400" />
          <div className="loading-dot h-2 w-2 rounded-full bg-purple-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide">Loading CrewDeck...</span>
        </div>
      </div>
    </div>
  );
}
