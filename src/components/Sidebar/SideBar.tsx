type TSidebarProps  = {
  currentView: "home" | "analytics";
  onViewChange: (view: "home" | "analytics") => void;
}

export default function Sidebar({ currentView, onViewChange }: TSidebarProps) {
  return (
    <aside className="w-64 h-dvh border-r border-brand-primary/10 flex flex-col bg-surface   border border-brand-primary/10">
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onViewChange("home")}
          className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
            currentView === "home"
              ? "bg-brand-primary text-white"
              : "hover:bg-brand-primary/10 opacity-80 hover:opacity-100"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onViewChange("analytics")}
          className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
            currentView === "analytics"
              ? "bg-brand-primary text-white"
              : "hover:bg-brand-primary/10 opacity-80 hover:opacity-100"
          }`}
        >
          Analytics
        </button>
      </nav>
    </aside>
  );
}