import Button from "./Button";
import type { TFeedbackKind } from "../../store/types/common.types";

export type TToastData = {
  id: number;
  kind: TFeedbackKind;
  message: string;
};

type TToastProps = {
  toast: TToastData;
  onClose: (id: number) => void;
};

export default function Toast({ toast, onClose }: TToastProps) {
  const isSuccess = toast.kind === "success";
  return (
    <div
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
      className={`flex w-[min(22rem,calc(100vw-2rem))] items-start gap-3 rounded-panel border px-3 py-2.5 shadow-panel ${
        isSuccess
          ? "border-brand-secondary bg-brand-secondary text-white"
          : "border-red-600 bg-red-600 text-white"
      }`}
    >
      <span aria-hidden="true" className="pt-0.5 text-base font-semibold">
        {isSuccess ? "✓" : "!"}
      </span>
      <p className="min-w-0 flex-1 text-sm font-medium">{toast.message}</p>
      <Button
        type="button"
        variant="subtle"
        aria-label="Dismiss notification"
        onClick={() => onClose(toast.id)}
        className="-mr-2 -mt-1 px-2 py-1 text-base leading-none"
      >
        ×
      </Button>
    </div>
  );
}
