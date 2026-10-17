import { createSlice } from "@reduxjs/toolkit";
import { containerReducers } from "./board/containerReducers";
import { feedbackReducers } from "./board/feedbackReducers";
import { initialBoardState } from "./board/boardTypes";
import { taskReducers } from "./board/taskReducers";

export type { TBoardState } from "./board/boardTypes";

const boardSlice = createSlice({
  name: "board",
  initialState: initialBoardState,
  reducers: {
    ...containerReducers,
    ...taskReducers,
    ...feedbackReducers,
  },
});

export const {
  addContainer,
  updateContainer,
  updateContainerAccess,
  removeContainer,
  addTask,
  updateTask,
  archiveTask,
  unarchiveTask,
  moveTask,
  reportBoardError,
  clearBoardError,
} = boardSlice.actions;

export default boardSlice.reducer;
