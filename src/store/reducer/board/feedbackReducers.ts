import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import type { TBoardState, TBoardErrorPayload } from "./boardTypes";
import { setFeedback } from "./boardUtils";

export const feedbackReducers = {
  reportBoardError: ((state, action: PayloadAction<TBoardErrorPayload>) => {
    state.lastError = action.payload;
    setFeedback(state, "error", action.payload.message);
  }) as CaseReducer<TBoardState, PayloadAction<TBoardErrorPayload>>,
  clearBoardError: ((state) => {
    state.lastError = null;
  }) as CaseReducer<TBoardState>,
};
