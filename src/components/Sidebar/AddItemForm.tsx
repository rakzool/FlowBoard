import { useState } from "react";
import Button from "../DesignComponents/Button";
import Input from "../DesignComponents/Input";

type TAddItemFormProps = {
  label: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
};

export default function AddItemForm({
  label,
  onSubmit,
  onCancel,
}: TAddItemFormProps) {
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (name.trim()) onSubmit(name.trim());
      }}
      className="mt-1 flex gap-1 pl-7"
    >
      <Input
        autoFocus
        placeholder={label}
        value={name}
        changeHandler={(event) => setName(event.target.value)}
      />
      <Button
        type="submit"
        variant="primary"
        className="rounded-md px-2 text-xs"
      >
        Add
      </Button>
      <Button
        type="button"
        variant="subtle"
        onClick={onCancel}
        className="rounded-md px-1.5 text-xs"
      >
        ×
      </Button>
    </form>
  );
}
