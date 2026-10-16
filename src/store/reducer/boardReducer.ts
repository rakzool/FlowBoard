import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TContainer, TStatus, TTask } from "../types/common.types";

export type TBoardState = { containers: TContainer[]; statuses: TStatus[]; tasks: TTask[] };

const initialState: TBoardState = { containers: [], statuses: [], tasks: [] };

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addContainer: (state, action: PayloadAction<TContainer>) => { state.containers.push(action.payload); },
    addTask: (state, action: PayloadAction<TTask>) => { state.tasks.push(action.payload); },
  },
});

export const { addContainer, addTask } = boardSlice.actions;
export default boardSlice.reducer;
