import AccordionItem from "../DesignComponents/AccordionItem";
import type {
  TAddTarget,
  TBoard,
  TFolder,
  TSpace,
} from "../../hooks/useSideBar";
import Button from "../DesignComponents/Button";
import AddForm from "./AddForm";
import Boards from "./Boards";

type TFolderTreeProps = {
  space: TSpace;
  folders: TFolder[];
  boards: TBoard[];
  target: TAddTarget | null;
  startAdding: (target: TAddTarget) => void;
  create: (name: string) => void;
  cancel: () => void;
  selectBoard: (board: TBoard) => void;
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
}: TFolderTreeProps) {
  const spaceFolders = folders.filter((folder) => folder.parentId === space.id);
  return (
    <AccordionItem
      title={space.name}
      level={1}
      defaultOpen={space.id === "engineering"}
      icon={<span className="text-xs text-brand-secondary">{icons.space}</span>}
      actions={
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
      }
    >
      {spaceFolders.map((folder) => (
        <AccordionItem
          key={folder.id}
          title={folder.name}
          level={2}
          icon={<span className="text-xs text-text/60">{icons.folder}</span>}
          actions={
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
          }
        >
          <Boards
            boards={boards.filter((board) => board.parentId === folder.id)}
            onSelect={selectBoard}
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
