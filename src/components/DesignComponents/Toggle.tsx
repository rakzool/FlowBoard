import { useId } from "react";

type TToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Toggle({ label, checked, onChange }: TToggleProps) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 text-sm text-text">
      <span>{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full ${checked ? "bg-brand-primary" : "bg-text/20"}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white ${checked ? "left-6" : "left-1"}`} />
      </button>
    </label>
  );
}
