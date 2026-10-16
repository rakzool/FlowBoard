import AccordionItem from "../DesignComponents/AccordionItem";
import type {
  TAddTarget,
  TBoard,
  TFolder,
  TSpace,
} from "../../hooks/useSideBar";
import Button from "../DesignComponents/Button";
import withSuspense from "../../utils/withSuspense";
const AddForm = withSuspense(() => import("./AddForm"));
const Boards = withSuspense(() => import("./Boards"));
const EditItemForm = withSuspense(() => import("./EditItemForm"));
import ContainerActions from "./ContainerActions";

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
  edit: (id: string, name: string) => void;
  remove: (id: string) => void;
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
          <ContainerActions
            name={space.name}
            onEdit={() => startEditing(space.id)}
            onDelete={() => {
              if (window.confirm(`Delete ${space.name} and its contents?`))
                remove(space.id);
            }}
          />
          <Button
            type="button"
            variant="subtle"
            aria-label={`Create folder in ${space.name}`}
            title={`Create folder in ${space.name}`}
            onClick={() => startAdding({ type: "folder", parentId: space.id })}
            className="px-1.5 py-0.5 text-base leading-none"
          >
            +
          </Button>
        </div>
      }
    >
      {editingId === space.id && (
        <EditItemForm
          key={editingId}
          value={space.name}
          onSubmit={(name) => edit(space.id, name)}
          onCancel={cancelEditing}
        />
      )}
      {spaceFolders.map((folder) => (
        <AccordionItem
          key={folder.id}
          title={folder.name}
          level={2}
          icon={<span className="text-xs text-text/60">{icons.folder}</span>}
          actions={
            <div className="flex items-center">
              <ContainerActions
                name={folder.name}
                onEdit={() => startEditing(folder.id)}
                onDelete={() => {
                  if (window.confirm(`Delete ${folder.name} and its boards?`))
                    remove(folder.id);
                }}
              />
              <Button
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
              </Button>
            </div>
          }
        >
          {editingId === folder.id && (
            <EditItemForm
              key={editingId}
              value={folder.name}
              onSubmit={(name) => edit(folder.id, name)}
              onCancel={cancelEditing}
            />
          )}
          <Boards
            boards={boards.filter((board) => board.parentId === folder.id)}
            onSelect={selectBoard}
            editingId={editingId}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            edit={edit}
            remove={remove}
          />
          {target?.type === "board" && target.parentId === folder.id && (
            <AddForm target={target} create={create} cancel={cancel} />
          )}
        </AccordionItem>
      ))}
      {!spaceFolders.length && (
        <p className="py-1 pl-12 text-xs text-text/40">No folders yet</p>
      )}
      {target?.type === "folder" && target.parentId === space.id && (
        <AddForm target={target} create={create} cancel={cancel} />
      )}
    </AccordionItem>
  );
}
