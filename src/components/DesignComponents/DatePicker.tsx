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
    <label className="flex w-full flex-col gap-1 text-sm text-text/65">
      <span>{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-brand-primary/15 bg-surface px-3 text-sm text-text outline-none focus:border-brand-primary"
      />
    </label>
  );
}
