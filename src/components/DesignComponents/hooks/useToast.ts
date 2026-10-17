import { createContext, useContext } from "react";
import type { TFeedbackKind } from "../../../store/types/common.types";

type TToastContext = {
  showToast: (toast: { kind: TFeedbackKind; message: string }) => void;
  dismissToast: (id: number) => void;
};

export const ToastContext = createContext<TToastContext | null>(null);

export default function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
