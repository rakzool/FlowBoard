import Accordion from "../DesignComponents/Accordion";
import AccordionItem from "../DesignComponents/AccordionItem";
import Button from "../DesignComponents/Button";
import useSideBar from "../../hooks/useSideBar";
import withSuspense from "../../utils/withSuspense";
import AddForm from "./AddForm";
const FolderTree = withSuspense(() => import("./FolderTree"));
import ContainerDetailsModal from "./ContainerDetailsModal";
import ContainerActions from "./ContainerActions";

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
    editingId,
    startEditing,
    cancelEditing,
    edit,
    remove,
    selectBoard,
    users,
    canManage,
    canCreateSpace,
    canCreateInSpace,
    getAccessUserIds,
    lastError,
  } = useSideBar();
  const beginSpace = () => startAdding({ type: "space" });

  return (
    <aside className="flex h-dvh w-72 shrink-0 flex-col border-r border-brand-primary/10 bg-surface">
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text/45">
            Workspace
          </p>
          {canCreateSpace && <Button
            type="button"
            variant="subtle"
            aria-label="Create space"
            title="Create space"
            onClick={beginSpace}
            className="px-1.5 py-0.5 text-base leading-none"
          >
            +
          </Button>}
        </div>
        <Accordion>
          <AccordionItem
            title="FlowBoard workspace"
            defaultOpen
            icon={<span className="text-xs">{workspaceIcon}</span>}
            actions={
              <div className="flex items-center">
                {canManage && <ContainerActions
                  name="workspace"
                  onEdit={() => startEditing("workspace-flowboard")}
                />}
                {canCreateSpace && <Button
                  type="button"
                  variant="subtle"
                  aria-label="Create space"
                  title="Create space"
                  onClick={beginSpace}
                  className="px-1.5 py-0.5 text-base leading-none"
                >
                  +
                </Button>}
              </div>
            }
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
                editingId={editingId}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                edit={edit}
                remove={remove}
                canManage={canManage}
                userOptions={users.map((user) => ({ value: user.id, label: user.name }))}
                getAccessUserIds={getAccessUserIds}
                canCreateItems={canCreateInSpace(space)}
              />
            ))}
            {!spaces.length && (
              <p className="py-2 pl-7 text-xs text-text/40">No spaces yet</p>
            )}
          </AccordionItem>
          </Accordion>
          {editingId === "workspace-flowboard" && (
            <ContainerDetailsModal
              key={editingId}
              title="Edit workspace"
              name="FlowBoard workspace"
              onSubmit={(name) => edit("workspace-flowboard", name)}
              onClose={cancelEditing}
            />
          )}
          {adding?.type === "space" && (
            <AddForm target={adding} create={create} cancel={cancelAdding} userOptions={users.map((user) => ({ value: user.id, label: user.name }))} canManageAccess={canManage} />
          )}
      </nav>
      <div className="border-t border-brand-primary/10 px-4 py-3 text-xs text-text/50">
        {lastError && <p role="alert" className="mb-2 rounded-lg bg-red-500/10 px-2 py-1 text-red-600">{lastError.message}</p>}
        {selectedBoard
          ? `Viewing ${selectedBoard.name}`
          : "Select a board to get started"}
      </div>
    </aside>
  );
}
