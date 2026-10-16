import { useState } from "react";
import Button from "../DesignComponents/Button";
import Input from "../DesignComponents/Input";

type TEditItemFormProps = {
  value: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
};

export default function EditItemForm({
  value,
  onSubmit,
  onCancel,
}: TEditItemFormProps) {
  const [name, setName] = useState(value);
  return (
    <form
      className="mt-1 flex gap-1 pl-7"
      onSubmit={(event) => {
        event.preventDefault();
        if (name.trim()) onSubmit(name);
      }}
    >
      <Input
        autoFocus
        placeholder="Name"
        value={name}
        changeHandler={(event) => setName(event.target.value)}
      />
      <Button
        type="submit"
        variant="primary"
        className="rounded-md px-2 text-xs"
      >
        Save
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
