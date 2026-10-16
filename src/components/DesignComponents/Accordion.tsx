import { useState, type ReactNode } from "react";

type AccordionItemProps = {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
  level?: number;
};

type AccordionProps = { children: ReactNode; className?: string };

export function AccordionItem({ title, icon, actions, children, defaultOpen = false, level = 0 }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="min-w-0">
      <div className="group flex min-h-9 items-center gap-1 rounded-lg hover:bg-brand-primary/10" style={{ paddingLeft: `${level * 14 + 4}px` }}>
        <button type="button" aria-expanded={open} onClick={() => setOpen((isOpen) => !isOpen)} className="flex min-w-0 flex-1 items-center gap-2 px-1 py-1.5 text-left text-sm font-medium">
          <span aria-hidden="true" className={`w-4 shrink-0 text-center text-xs transition-transform ${open ? "rotate-90" : ""}`}>›</span>
          {icon && <span className="shrink-0 text-text/60">{icon}</span>}
          <span className="truncate">{title}</span>
        </button>
        {actions && <div className="mr-1 flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">{actions}</div>}
      </div>
      {open && children && <div>{children}</div>}
    </div>
  );
}

export default function Accordion({ children, className = "" }: AccordionProps) {
  return <div className={`space-y-0.5 ${className}`}>{children}</div>;
}
