export default function Layout({ currentView }: { currentView: string }) {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-surface text-text m-0 p-0 transition-colors duration-200">
      <div className="flex flex-col flex-1 h-full overflow-hidden p-6">
        <div className="px-8 py-4 bg-surface shrink-0">
          <h2 className="text-base font-semibold capitalize">
            {currentView} Dashboard
          </h2>
        </div>
        <main className="p-6 rounded-xl bg-gray-100 dark:bg-slate-800 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Dashboard Content</h2>
          <p>
            This container automatically inherits theme styles without
            conditional checks.
          </p>
        </main>
      </div>
    </div>
  );
}
