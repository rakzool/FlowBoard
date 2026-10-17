type TSelectOption = { value: string; label: string };
type TSelectProps = {
  label: string;
  value: string;
  options: TSelectOption[];
  onChange: (value: string) => void;
};

export default function Select({
  label,
  value,
  options,
  onChange,
}: TSelectProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-text/65">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-brand-primary/15 bg-surface px-3 text-sm text-text outline-none focus:border-brand-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
