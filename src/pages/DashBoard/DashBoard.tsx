import { useTheme } from "../../hooks/useTheme";
export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark min-h-screen transition-colors duration-200">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Application Header</h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-brand-primary text-white font-medium transition-opacity hover:opacity-95 cursor-pointer"
        >
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </button>
      </header>
      <main className="p-6 rounded-xl bg-gray-100 dark:bg-slate-800 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Dashboard Content</h2>
        <p>This container automatically inherits theme styles without conditional checks.</p>
      </main>
    </div>
  );
}