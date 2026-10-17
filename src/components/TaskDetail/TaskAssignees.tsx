import type { TUser } from "../../store/types/common.types";
import { getUserInitials } from "../../utils/taskFormatting";

type TTaskAssigneesProps = { assigneeIds: string[]; users: TUser[] };

export default function TaskAssignees({
  assigneeIds,
  users,
}: TTaskAssigneesProps) {
  const assignees = assigneeIds
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is TUser => Boolean(user));
  if (!assignees.length)
    return <span className="text-text/45">Unassigned</span>;
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Assigned to ${assignees.map((user) => user.name).join(", ")}`}
    >
      <div className="flex -space-x-1.5">
        {assignees.map((user) => (
          <span
            key={user.id}
            title={user.name}
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-brand-primary/15 text-[10px] font-semibold text-brand-primary"
          >
            {getUserInitials(user.name)}
          </span>
        ))}
      </div>
      <span className="hidden text-text/55 sm:inline">
        {assignees.map((user) => user.name).join(", ")}
      </span>
    </div>
  );
}
