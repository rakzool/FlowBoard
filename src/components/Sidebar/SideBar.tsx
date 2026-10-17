import Accordion from "../DesignComponents/Accordion";
import AccordionItem from "../DesignComponents/AccordionItem";
import Button from "../DesignComponents/Button";
import useSideBar from "../../hooks/useSideBar";
import withSuspense from "../../utils/withSuspense";
import AddForm from "./AddForm";
import { WORKSPACE_ICON } from "../../constants/sidebar.constants";
import ContainerDetailsModal from "./ContainerDetailsModal";
import ContainerActions from "./ContainerActions";
import useAccessControl from "../../hooks/useAccessControl";

const FolderTree = withSuspense(() => import("./FolderTree"));

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
  } = useSideBar();

  const { canManageContainers, canCreateSpace } = useAccessControl();
  const beginSpace = () => startAdding({ type: "space" });

  return (
    <aside className="flex h-dvh w-sidebar shrink-0 flex-col border-r border-border bg-surface">
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-caption font-semibold uppercase tracking-wider text-muted">
            Workspace
          </p>
          {canCreateSpace && (
            <Button
              type="button"
              variant="subtle"
              aria-label="Create space"
              title="Create space"
              onClick={beginSpace}
              className="px-1.5 py-0.5 text-base leading-none"
            >
              +
            </Button>
          )}
        </div>
        <Accordion>
          <AccordionItem
            title="FlowBoard workspace"
            defaultOpen
            icon={<span className="text-xs">{WORKSPACE_ICON}</span>}
            actions={
              <div className="flex items-center">
                {canManageContainers && (
                  <ContainerActions
                    name="workspace"
                    onEdit={() => startEditing("workspace-flowboard")}
                  />
                )}
                {canCreateSpace && (
                  <Button
                    type="button"
                    variant="subtle"
                    aria-label="Create space"
                    title="Create space"
                    onClick={beginSpace}
                    className="px-1.5 py-0.5 text-base leading-none"
                  >
                    +
                  </Button>
                )}
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
          <AddForm target={adding} create={create} cancel={cancelAdding} />
        )}
      </nav>
      <div className="border-t border-border px-3 py-2.5 text-xs text-muted">
        {selectedBoard
          ? `Viewing ${selectedBoard.name}`
          : "Select a board to get started"}
      </div>
    </aside>
  );
}
