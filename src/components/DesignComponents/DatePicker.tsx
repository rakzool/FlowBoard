type TDatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function DatePicker({
  label,
  value,
  onChange,
}: TDatePickerProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-muted">
      <span>{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-text outline-none focus:border-brand-primary"
      />
    </label>
  );
}
