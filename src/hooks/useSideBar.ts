import { useState } from "react";

export type Board = { id: string; name: string };
export type Folder = { id: string; name: string; boards: Board[] };
export type Space = { id: string; name: string; folders: Folder[] };
export type AddTarget = { type: "space" | "folder" | "board"; parentId?: string };

const initialSpaces: Space[] = [
  { id: "engineering", name: "Engineering", folders: [
    { id: "platform", name: "Platform", boards: [{ id: "sprint-board", name: "Sprint board" }, { id: "bugs", name: "Bugs & fixes" }] },
    { id: "mobile", name: "Mobile app", boards: [{ id: "mobile-roadmap", name: "Mobile roadmap" }] },
  ] },
  { id: "product", name: "Product", folders: [{ id: "discovery", name: "Discovery", boards: [{ id: "product-roadmap", name: "Product roadmap" }] }] },
];

export default function useSideBar() {
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces);
  const [adding, setAdding] = useState<AddTarget | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const createSpace = (name: string) => {
    setSpaces((items) => [...items, { id: `${name}-${Date.now()}`, name, folders: [] }]);
    setAdding(null);
  };

  const createFolder = (spaceId: string, name: string) => {
    setSpaces((items) => items.map((space) => space.id === spaceId ? { ...space, folders: [...space.folders, { id: `${name}-${Date.now()}`, name, boards: [] }] } : space));
    setAdding(null);
  };

  const createBoard = (folderId: string, name: string) => {
    setSpaces((items) => items.map((space) => ({ ...space, folders: space.folders.map((folder) => folder.id === folderId ? { ...folder, boards: [...folder.boards, { id: `${name}-${Date.now()}`, name }] } : folder) })));
    setAdding(null);
  };

  const create = (name: string) => {
    if (!adding) return;
    if (adding.type === "space") createSpace(name);
    if (adding.type === "folder" && adding.parentId) createFolder(adding.parentId, name);
    if (adding.type === "board" && adding.parentId) createBoard(adding.parentId, name);
  };

  return { spaces, adding, selectedBoard, create, startAdding: setAdding, cancelAdding: () => setAdding(null), selectBoard: setSelectedBoard };
}
