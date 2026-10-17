import { useState, type ReactNode } from "react";
import Button from "./Button";

type TAccordionItemProps = {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  overlays?: ReactNode;
  defaultOpen?: boolean;
  level?: number;
};

export default function AccordionItem({
  title,
  icon,
  actions,
  children,
  overlays,
  defaultOpen = false,
  level = 0,
}: TAccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const paddingClass = ["pl-1", "pl-4", "pl-7"][Math.min(level, 2)];
  return (
    <div className="min-w-0">
      <div className="group flex min-h-8 items-center gap-1 rounded-control hover:bg-brand-primary/10">
        <Button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((isOpen) => !isOpen)}
          variant="ghost"
          className={`flex min-w-0 flex-1 items-center gap-1.5 py-1 pr-1 text-left text-sm ${paddingClass}`}
        >
          <span
            aria-hidden="true"
            className={`w-4 shrink-0 text-center text-xs transition-transform ${open ? "rotate-90" : ""}`}
          >
            ›
          </span>
          {icon && <span className="shrink-0 text-text/60">{icon}</span>}
          <span className="truncate">{title}</span>
        </Button>
        {actions && (
          <div className="mr-1 flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {actions}
          </div>
        )}
      </div>
      {open && children && <div>{children}</div>}
      {overlays}
    </div>
  );
}
