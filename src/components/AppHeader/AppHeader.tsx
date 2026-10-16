import { useTheme } from "../../hooks/useTheme";

const AppHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center px-6 h-16 w-full border-b border-brand-primary/10 bg-surface shrink-0">
      <div className="text-lg font-bold tracking-wide">FlowBoard</div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium hover:opacity-95 cursor-pointer"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-brand-primary/10">
          <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center font-semibold text-xs text-brand-primary">
            RK
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
