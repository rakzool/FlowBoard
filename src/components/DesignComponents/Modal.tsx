import { useEffect, useRef, type ReactNode } from "react";
import Button from "./Button";

type TModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "lg" | "xl";
};

export default function Modal({
  open,
  title,
  children,
  onClose,
  size = "lg",
}: TModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      role="presentation"
    >
      <div className="absolute inset-0" onMouseDown={onClose} />
      <section
        className={`relative z-10 w-full ${size === "xl" ? "max-w-4xl" : "max-w-lg"} rounded-panel border border-border bg-surface p-5 shadow-panel`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-base font-semibold">
            {title}
          </h2>
          <Button
            ref={closeButtonRef}
            type="button"
            variant="subtle"
            aria-label="Close dialog"
            onClick={onClose}
            className="px-2 py-1 text-lg leading-none"
          >
            ×
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
