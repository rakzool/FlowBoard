import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TSessionState = { currentUserId: string; selectedListId: string | null };

const initialState: TSessionState = { currentUserId: "alice", selectedListId: "list-backlog" };

const sessionSlice = createSlice({
  name: "session",
  initialState,
    reducers: {
      selectList: (state, action: PayloadAction<string | null>) => { state.selectedListId = action.payload; },
      switchUser: (state, action: PayloadAction<string>) => { state.currentUserId = action.payload; state.selectedListId = null; },
    },
});

export const { selectList, switchUser } = sessionSlice.actions;
export default sessionSlice.reducer;
