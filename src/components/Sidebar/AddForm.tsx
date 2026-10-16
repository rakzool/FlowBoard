import ContainerDetailsModal from "./ContainerDetailsModal";
import type { TMultiInputOption } from "../DesignComponents/MultiInput";
import type { TContainerAccessDetails } from "../../store/types/common.types";
import type { TAddTarget } from "../../hooks/useSideBar";

type TAddFormProps = { target: TAddTarget | null; create: (name: string, accessDetails?: TContainerAccessDetails) => void; cancel: () => void; userOptions?: TMultiInputOption[]; canManageAccess?: boolean };

export default function AddForm({ target, create, cancel, userOptions = [], canManageAccess = false }: TAddFormProps) {
  if (!target) return null;
  return <ContainerDetailsModal
    key={`new-${target.type}-${target.parentId ?? "workspace"}`}
    title={`Create ${target.type}`}
    name=""
    visibility={target.type === "space" ? "private" : "public"}
    userOptions={userOptions}
    canManageAccess={canManageAccess}
    onSubmit={create}
    onClose={cancel}
  />;
}
