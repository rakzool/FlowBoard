import AddItemForm from "./AddItemForm";
import type { TAddTarget } from "../../hooks/useSideBar";

type TAddFormProps = { target: TAddTarget | null; create: (name: string) => void; cancel: () => void };

export default function AddForm({ target, create, cancel }: TAddFormProps) {
  if (!target) return null;
  const label = `${target.type[0].toUpperCase()}${target.type.slice(1)} name`;
  return <AddItemForm label={label} onSubmit={create} onCancel={cancel} />;
}
