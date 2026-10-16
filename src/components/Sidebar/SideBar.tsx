import { useState, type FormEvent } from "react";
import Accordion, { AccordionItem } from "../DesignComponents/Accordion";
import useSideBar, {
  type AddTarget,
  type Board,
  type Folder,
  type Space,
} from "../../hooks/useSideBar";

type TSidebarProps = {
  currentView?: "home" | "analytics";
  onViewChange?: (view: "home" | "analytics") => void;
};

const icon = { workspace: "◆", space: "●", folder: "▰", board: "▦" };

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-md px-1.5 py-0.5 text-base leading-none text-text/50 hover:bg-brand-primary/15 hover:text-brand-primary"
    >
      +
    </button>
  );
}

function AddItemForm({
  label,
  onSubmit,
  onCancel,
}: {
  label: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };
  return (
    <form onSubmit={submit} className="mt-1 flex gap-1 pl-7">
      <input
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={label}
        aria-label={label}
        className="min-w-0 flex-1 rounded-md border border-brand-primary/20 bg-transparent px-2 py-1 text-xs outline-none focus:border-brand-primary"
      />
      <button
        type="submit"
        className="rounded-md bg-brand-primary px-2 text-xs text-white"
      >
        Add
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md px-1.5 text-xs text-text/60 hover:bg-brand-primary/10"
      >
        ×
      </button>
    </form>
  );
}

function Boards({
  boards,
  onSelect,
}: {
  boards: Board[];
  onSelect: (board: Board) => void;
}) {
  return (
    <div className="ml-10 space-y-0.5 border-l border-brand-primary/10 pl-2">
      {boards.map((board) => (
        <button
          key={board.id}
          type="button"
          onClick={() => onSelect(board)}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-text/70 hover:bg-brand-primary/10 hover:text-text"
        >
          <span aria-hidden="true" className="text-text/50">
            {icon.board}
          </span>
          <span className="truncate">{board.name}</span>
        </button>
      ))}
    </div>
  );
}

function AddForm({
  target,
  create,
  cancel,
}: {
  target: AddTarget | null;
  create: (name: string) => void;
  cancel: () => void;
}) {
  if (!target) return null;
  return (
    <AddItemForm
      label={`${target.type[0].toUpperCase()}${target.type.slice(1)} name`}
      onSubmit={create}
      onCancel={cancel}
    />
  );
}

function FolderTree({
  space,
  target,
  startAdding,
  create,
  cancel,
  selectBoard,
}: {
  space: Space;
  target: AddTarget | null;
  startAdding: (target: AddTarget) => void;
  create: (name: string) => void;
  cancel: () => void;
  selectBoard: (board: Board) => void;
}) {
  return (
    <AccordionItem
      title={space.name}
      level={1}
      defaultOpen={space.id === "engineering"}
      icon={<span className="text-xs text-brand-secondary">{icon.space}</span>}
      actions={
        <AddButton
          label={`Create folder in ${space.name}`}
          onClick={() => startAdding({ type: "folder", parentId: space.id })}
        />
      }
    >
      {space.folders.map((folder: Folder) => (
        <AccordionItem
          key={folder.id}
          title={folder.name}
          level={2}
          icon={<span className="text-xs text-text/60">{icon.folder}</span>}
          actions={
            <AddButton
              label={`Create board in ${folder.name}`}
              onClick={() =>
                startAdding({ type: "board", parentId: folder.id })
              }
            />
          }
        >
          <Boards boards={folder.boards} onSelect={selectBoard} />
          {target?.type === "board" && target.parentId === folder.id && (
            <AddForm target={target} create={create} cancel={cancel} />
          )}
        </AccordionItem>
      ))}
      {!space.folders.length && (
        <p className="py-1 pl-12 text-xs text-text/40">No folders yet</p>
      )}
      {target?.type === "folder" && target.parentId === space.id && (
        <AddForm target={target} create={create} cancel={cancel} />
      )}
    </AccordionItem>
  );
}

export default function Sidebar({
  currentView = "home",
  onViewChange = () => undefined,
}: TSidebarProps) {
  const {
    spaces,
    adding,
    selectedBoard,
    create,
    startAdding,
    cancelAdding,
    selectBoard,
  } = useSideBar();
  return (
    <aside className="flex h-dvh w-72 shrink-0 flex-col border-r border-brand-primary/10 bg-surface">
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-5 space-y-1">
          {(["home", "analytics"] as const).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium capitalize transition-colors ${currentView === view ? "bg-brand-primary text-white" : "text-text/75 hover:bg-brand-primary/10 hover:text-text"}`}
            >
              {view}
            </button>
          ))}
        </div>
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text/45">
            Workspace
          </p>
          <AddButton
            label="Create space"
            onClick={() => startAdding({ type: "space" })}
          />
        </div>
        <Accordion>
          <AccordionItem
            title="FlowBoard workspace"
            defaultOpen
            icon={<span className="text-xs">{icon.workspace}</span>}
            actions={
              <AddButton
                label="Create space"
                onClick={() => startAdding({ type: "space" })}
              />
            }
          >
            {spaces.map((space) => (
              <FolderTree
                key={space.id}
                space={space}
                target={adding}
                startAdding={startAdding}
                create={create}
                cancel={cancelAdding}
                selectBoard={selectBoard}
              />
            ))}
            {!spaces.length && (
              <p className="py-2 pl-7 text-xs text-text/40">No spaces yet</p>
            )}
            {adding?.type === "space" && (
              <AddForm target={adding} create={create} cancel={cancelAdding} />
            )}
          </AccordionItem>
        </Accordion>
      </nav>
      <div className="border-t border-brand-primary/10 px-4 py-3 text-xs text-text/50">
        {selectedBoard
          ? `Viewing ${selectedBoard.name}`
          : "Select a board to get started"}
      </div>
    </aside>
  );
}
