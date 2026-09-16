export default function Loading() {
  return (
    <div className="flex flex-1 min-h-[55vh] items-center justify-center" role="status" aria-label="Loading page">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-5 py-4 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
        <div className="loading-dot h-2 w-2 rounded-full bg-blue-400" />
        <div className="loading-dot h-2 w-2 rounded-full bg-indigo-400" />
        <div className="loading-dot h-2 w-2 rounded-full bg-purple-400" />
        <span className="ml-1 text-xs font-medium text-slate-300">Loading CrewDeck</span>
      </div>
    </div>
  );
}
