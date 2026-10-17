import { useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import useToast from "../DesignComponents/hooks/useToast";

export default function BoardFeedbackToaster() {
  const feedback = useAppSelector((state) => state.board.lastFeedback);
  const lastError = useAppSelector((state) => state.board.lastError);
  const { showToast } = useToast();

  useEffect(() => {
    if (feedback) {
      showToast(feedback);
    } else if (lastError) {
      showToast({ kind: "error", message: lastError.message });
    }
  }, [feedback, lastError, showToast]);

  return null;
}
