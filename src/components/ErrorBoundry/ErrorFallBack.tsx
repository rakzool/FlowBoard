import Paper from "../DesignComponents/Paper";

export default function ErrorFallback() {
  return (
    <Paper className="flex flex-col items-center justify-center min-h-screen p-6">
      <Paper className="p-6 rounded-xl shadow-lg border border-brand-primary/20 max-w-md w-full text-center">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-sm opacity-80 mb-4">
          An unexpected error occurred in the application view.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-brand-primary text-white font-medium hover:opacity-95 cursor-pointer"
        >
          Reload Application
        </button>
      </Paper>
    </Paper>
  );
}
