import Button from "../DesignComponents/Button";

type TContainerActionsProps = {
  name: string;
  onEdit: () => void;
  onDelete?: () => void;
};

export default function ContainerActions({
  name,
  onEdit,
  onDelete,
}: TContainerActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        type="button"
        variant="subtle"
        aria-label={`Edit ${name}`}
        title={`Edit ${name}`}
        onClick={onEdit}
        className="px-1.5 py-0.5 text-xs"
      >
        ✎
      </Button>
      {onDelete && (
        <Button
          type="button"
          variant="subtle"
          aria-label={`Delete ${name}`}
          title={`Delete ${name}`}
          onClick={onDelete}
          className="px-1.5 py-0.5 text-xs hover:text-red-500"
        >
          ×
        </Button>
      )}
    </div>
  );
}
