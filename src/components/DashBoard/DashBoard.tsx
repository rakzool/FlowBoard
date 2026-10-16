import Paper from "../DesignComponents/Paper";

export default function Layout() {
  return (
    <Paper className="flex flex-col w-screen h-screen overflow-hidden m-0 p-0">
      <div className="flex flex-col flex-1 h-full overflow-hidden p-6">
        <Paper className="px-8 py-4 shrink-0">
          <h2 className="text-base font-semibold capitalize">
           Dashboard
          </h2>
        </Paper>
        <Paper className="p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Dashboard Content</h2>
          <p>
            This container automatically inherits theme styles without
            conditional checks.
          </p>
        </Paper>
      </div>
    </Paper>
  );
}
