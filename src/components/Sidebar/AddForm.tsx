import ContainerDetailsModal from "./ContainerDetailsModal";
import type { TContainerAccessDetails } from "../../store/types/common.types";
import type { TAddTarget } from "../../hooks/useSideBar";

type TAddFormProps = {
  target: TAddTarget | null;
  create: (name: string, accessDetails?: TContainerAccessDetails) => void;
  cancel: () => void;
};

export default function AddForm({ target, create, cancel }: TAddFormProps) {
  if (!target) return null;
  return (
    <ContainerDetailsModal
      key={`new-${target.type}-${target.parentId ?? "workspace"}`}
      title={`Create ${target.type}`}
      name=""
      visibility={target.type === "space" ? "private" : "public"}
      onSubmit={create}
      onClose={cancel}
    />
  );
}
