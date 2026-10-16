import Accordion from "../DesignComponents/Accordion";
import AccordionItem from "../DesignComponents/AccordionItem";
import Button from "../DesignComponents/Button";
import useSideBar from "../../hooks/useSideBar";
import AddForm from "./AddForm";
import FolderTree from "./FolderTree";

const workspaceIcon = "◆";

export default function Sidebar() {
  const {
    spaces,
    folders,
    boards,
    adding,
    selectedBoard,
    create,
    startAdding,
    cancelAdding,
    selectBoard,
  } = useSideBar();
  const beginSpace = () => startAdding({ type: "space" });

  return (
    <aside className="flex h-dvh w-72 shrink-0 flex-col border-r border-brand-primary/10 bg-surface">
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text/45">
            Workspace
          </p>
          <Button type="button" variant="subtle" aria-label="Create space" title="Create space" onClick={beginSpace} className="px-1.5 py-0.5 text-base leading-none">+</Button>
        </div>
        <Accordion>
          <AccordionItem
            title="FlowBoard workspace"
            defaultOpen
            icon={<span className="text-xs">{workspaceIcon}</span>}
            actions={<Button type="button" variant="subtle" aria-label="Create space" title="Create space" onClick={beginSpace} className="px-1.5 py-0.5 text-base leading-none">+</Button>}
          >
            {spaces.map((space) => (
              <FolderTree
                key={space.id}
                space={space}
                folders={folders}
                boards={boards}
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
