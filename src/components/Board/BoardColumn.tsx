import type { TStatus, TTask } from "../../store/types/common.types";
import TaskCard from "./TaskCard";
import Button from "../DesignComponents/Button";

type TBoardColumnProps = { status: TStatus; tasks: TTask[] };

export default function BoardColumn({ status, tasks }: TBoardColumnProps) {
  const dotClass = status.category === "done" ? "bg-emerald-500" : status.category === "active" ? "bg-brand-primary" : "bg-brand-secondary";

  return (
    <section className="flex min-w-72 flex-1 flex-col rounded-xl bg-brand-primary/5 p-3">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          <h2 className="text-sm font-semibold">{status.name}</h2>
          <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] text-text/55">{tasks.length}</span>
        </div>
        <Button type="button" variant="subtle" aria-label={`Add task to ${status.name}`} className="rounded-md px-2 py-0.5 text-lg leading-none">+</Button>
      </header>
      <div className="flex flex-1 flex-col gap-2">
        {tasks.length ? tasks.map((task) => <TaskCard key={task.id} task={task} />) : <p className="rounded-lg border border-dashed border-brand-primary/15 p-4 text-center text-xs text-text/40">No tasks here yet</p>}
      </div>
    </section>
  );
}
