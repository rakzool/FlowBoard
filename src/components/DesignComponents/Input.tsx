import { useState, type ChangeEvent } from "react";

type TInputProps = {
  type?: string;
  placeholder: string;
  value: string;
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
  maxLength?: number;
};
export default function Input({
  type,
  placeholder,
  value,
  changeHandler,
  disabled,
  error,
  autoFocus,
  maxLength,
}: TInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = type === "date" || isFocused || value.length > 0;
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={changeHandler}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={`peer w-full rounded-control border border-border bg-surface px-3 pt-4 pb-1.5 text-sm text-text outline-none transition-all duration-200 placeholder-transparent disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-60 ${
            error
              ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
              : "focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          }`}
        />
        <label
          className={`pointer-events-none absolute left-4 transition-all duration-200 ease-out ${
            isFloating ? "top-2 text-xs font-medium" : "top-3.5 text-sm"
          } ${
            error
              ? "text-red-500"
              : isFocused
                ? "text-brand-primary"
                : "text-muted"
          }`}
        >
          {placeholder}
        </label>
      </div>

      {error && <span className="text-xs text-red-500 pl-1">{error}</span>}
    </div>
  );
}
