import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TSessionState = { currentUserId: string; selectedListId: string | null };

const initialState: TSessionState = { currentUserId: "alice", selectedListId: "list-backlog" };

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: { selectList: (state, action: PayloadAction<string>) => { state.selectedListId = action.payload; } },
});

export const { selectList } = sessionSlice.actions;
export default sessionSlice.reducer;
