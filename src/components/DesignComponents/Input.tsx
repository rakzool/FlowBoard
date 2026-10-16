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
          className={`peer w-full rounded-lg border bg-white dark:bg-slate-900 px-4 pt-5 pb-2 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all duration-200 placeholder-transparent disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 dark:disabled:bg-slate-800 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          }`}
        />
        <label
          className={`pointer-events-none absolute left-4 transition-all duration-200 ease-out ${
            isFloating ? "top-2 text-xs font-medium" : "top-3.5 text-sm"
          } ${
            error
              ? "text-red-500"
              : isFocused
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400"
          }`}
        >
          {placeholder}
        </label>
      </div>

      {error && <span className="text-xs text-red-500 pl-1">{error}</span>}
    </div>
  );
}
