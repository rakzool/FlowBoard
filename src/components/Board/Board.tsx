import Paper from "../DesignComponents/Paper";
import type { TStatus, TTask } from "../../store/types/common.types";
import BoardColumn from "./BoardColumn";
import Button from "../DesignComponents/Button";

type TBoardProps = { name: string; statuses: TStatus[]; tasks: TTask[] };

export default function Board({ name, statuses, tasks }: TBoardProps) {
  return (
    <Paper className="flex min-h-full min-w-max flex-1 flex-col rounded-xl border border-brand-primary/10 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <Button type="button" variant="ghost" className="border border-brand-primary/15 px-3 py-2 text-xs hover:border-brand-primary hover:text-brand-primary">Board settings</Button>
      </div>
      {statuses.length ? (
        <div className="flex min-h-0 flex-1 gap-4">
          {statuses.map((status) => (
            <BoardColumn key={status.id} status={status} tasks={tasks.filter((task) => task.statusId === status.id).sort((a, b) => a.position - b.position)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-brand-primary/15 p-8 text-center">
          <div><p className="text-sm font-medium">Your board is ready</p><p className="mt-1 text-xs text-text/50">Statuses and tasks for {name} will appear here.</p></div>
        </div>
      )}
    </Paper>
  );
}
