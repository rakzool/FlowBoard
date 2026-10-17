import AccordionItem from "../DesignComponents/AccordionItem";
import type {
  TAddTarget,
  TBoard,
  TFolder,
  TSpace,
} from "../../hooks/useSideBar";
import Button from "../DesignComponents/Button";
import withSuspense from "../../utils/withSuspense";
import AddForm from "./AddForm";
const Boards = withSuspense(() => import("./Boards"));
import ContainerActions from "./ContainerActions";
import type { TMultiInputOption } from "../DesignComponents/MultiInput";
import ContainerDetailsModal from "./ContainerDetailsModal";
import type { TContainerAccessDetails } from "../../store/types/common.types";

type TFolderTreeProps = {
  space: TSpace;
  folders: TFolder[];
  boards: TBoard[];
  target: TAddTarget | null;
  startAdding: (target: TAddTarget) => void;
  create: (name: string) => void;
  cancel: () => void;
  selectBoard: (board: TBoard) => void;
  editingId: string | null;
  startEditing: (id: string) => void;
  cancelEditing: () => void;
  edit: (id: string, name: string, accessDetails?: TContainerAccessDetails) => void;
  remove: (id: string) => void;
  canManage: boolean;
  userOptions: TMultiInputOption[];
  getAccessUserIds: (resourceId: string, mode: "allow" | "deny") => string[];
  canCreateItems: boolean;
};
const icons = { space: "●", folder: "▰" };

export default function FolderTree({
  space,
  folders,
  boards,
  target,
  startAdding,
  create,
  cancel,
  selectBoard,
  editingId,
  startEditing,
  cancelEditing,
  edit,
  remove,
  canManage,
  userOptions,
  getAccessUserIds,
  canCreateItems,
}: TFolderTreeProps) {
  const spaceFolders = folders.filter((folder) => folder.parentId === space.id);
  return (
    <AccordionItem
      title={space.name}
      level={1}
      defaultOpen={space.id === "engineering"}
      icon={<span className="text-xs text-brand-secondary">{icons.space}</span>}
      actions={
        <div className="flex items-center">
          {canManage && <ContainerActions
            name={space.name}
            onEdit={() => startEditing(space.id)}
          />}
          {canCreateItems && <Button
            type="button"
            variant="subtle"
            aria-label={`Create folder in ${space.name}`}
            title={`Create folder in ${space.name}`}
            onClick={() => startAdding({ type: "folder", parentId: space.id })}
            className="px-1.5 py-0.5 text-base leading-none"
          >
            +
          </Button>}
        </div>
      }
      overlays={
        <>
          {editingId === space.id && (
            <ContainerDetailsModal
              key={editingId}
              title={`Edit ${space.name}`}
              name={space.name}
              visibility={space.visibility}
              allowedUserIds={getAccessUserIds(space.id, "allow")}
              deniedUserIds={getAccessUserIds(space.id, "deny")}
              userOptions={userOptions}
              canManageAccess={canManage}
              onSubmit={(name, accessDetails) => edit(space.id, name, accessDetails)}
              onClose={cancelEditing}
            />
          )}
          {spaceFolders.map((folder) => (
            <div key={`folder-dialogs-${folder.id}`}>
              {editingId === folder.id && (
                <ContainerDetailsModal
                  key={editingId}
                  title={`Edit ${folder.name}`}
                  name={folder.name}
                  visibility={folder.visibility}
                  allowedUserIds={getAccessUserIds(folder.id, "allow")}
                  deniedUserIds={getAccessUserIds(folder.id, "deny")}
                  userOptions={userOptions}
                  canManageAccess={canManage}
                  onSubmit={(name, accessDetails) => edit(folder.id, name, accessDetails)}
                  onClose={cancelEditing}
                />
              )}
              {boards.filter((board) => board.parentId === folder.id).map((board) => editingId === board.id && (
                <ContainerDetailsModal
                  key={editingId}
                  title={`Edit ${board.name}`}
                  name={board.name}
                  visibility={board.visibility}
                  allowedUserIds={getAccessUserIds(board.id, "allow")}
                  deniedUserIds={getAccessUserIds(board.id, "deny")}
                  userOptions={userOptions}
                  canManageAccess={canManage}
                  onSubmit={(name, accessDetails) => edit(board.id, name, accessDetails)}
                  onClose={cancelEditing}
                />
              ))}
              {target?.type === "board" && target.parentId === folder.id && (
                <AddForm target={target} create={create} cancel={cancel} userOptions={userOptions} canManageAccess={canManage} />
              )}
            </div>
          ))}
          {target?.type === "folder" && target.parentId === space.id && (
            <AddForm target={target} create={create} cancel={cancel} userOptions={userOptions} canManageAccess={canManage} />
          )}
        </>
      }
    >
      {spaceFolders.map((folder) => (
        <AccordionItem
          key={folder.id}
          title={folder.name}
          level={2}
          icon={<span className="text-xs text-text/60">{icons.folder}</span>}
          actions={
            <div className="flex items-center">
              {canManage && <ContainerActions
                name={folder.name}
                onEdit={() => startEditing(folder.id)}
                onDelete={() => {
                  if (window.confirm(`Delete ${folder.name} and its boards?`))
                    remove(folder.id);
                }}
              />}
              {canCreateItems && <Button
                type="button"
                variant="subtle"
                aria-label={`Create board in ${folder.name}`}
                title={`Create board in ${folder.name}`}
                onClick={() =>
                  startAdding({ type: "board", parentId: folder.id })
                }
                className="px-1.5 py-0.5 text-base leading-none"
              >
                +
              </Button>}
            </div>
          }
        >
          <Boards
            boards={boards.filter((board) => board.parentId === folder.id)}
            onSelect={selectBoard}
            startEditing={startEditing}
            remove={remove}
            canManage={canManage}
          />
        </AccordionItem>
      ))}
      {!spaceFolders.length && (
        <p className="py-1 pl-12 text-xs text-text/40">No folders yet</p>
      )}
    </AccordionItem>
  );
}
