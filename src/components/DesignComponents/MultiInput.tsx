import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

export type TMultiInputOption = { value: string; label: string };
type TMultiInputProps = {
  label: string;
  placeholder: string;
  value: string[];
  options: TMultiInputOption[];
  onChange: (value: string[]) => void;
};

export default function MultiInput({ label, placeholder, value, options, onChange }: TMultiInputProps) {
  const [query, setQuery] = useState("");
  const matches = options.filter((option) => !value.includes(option.value) && option.label.toLowerCase().includes(query.toLowerCase()));
  const add = (item: string) => { if (!value.includes(item)) onChange([...value, item]); setQuery(""); };
  const remove = (item: string) => onChange(value.filter((current) => current !== item));
  return (
    <div className="flex w-full flex-col gap-1 text-sm text-muted">
      <span>{label}</span>
      <div className="relative rounded-control border border-border bg-surface p-1.5 focus-within:border-brand-primary">
        <div className="flex flex-wrap gap-1">
          {value.map((item) => {
            const option = options.find((candidate) => candidate.value === item);
            return <span key={item} className="flex items-center gap-1 rounded-full bg-brand-primary/10 px-2 py-1 text-xs text-text">
              {option?.label ?? item}
              <Button type="button" variant="subtle" aria-label={`Remove ${option?.label ?? item}`} onClick={() => remove(item)} className="px-0.5 py-0 text-xs">×</Button>
            </span>;
          })}
          <Input type="text" placeholder={placeholder} value={query} changeHandler={(event) => setQuery(event.target.value)} />
        </div>
        {query && matches.length > 0 && <div className="absolute left-2 right-2 top-full z-10 mt-1 rounded-lg border border-brand-primary/10 bg-surface p-1 shadow-lg">
          {matches.map((option) => <Button key={option.value} type="button" variant="ghost" onClick={() => add(option.value)} className="block w-full px-2 py-1 text-left text-xs">{option.label}</Button>)}
        </div>}
      </div>
    </div>
  );
}
