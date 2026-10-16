import { combineReducers } from '@reduxjs/toolkit';
import boardReducer from './boardReducer';
import sessionReducer from './sessionReducer';

export const rootReducer = combineReducers({ board: boardReducer, session: sessionReducer });
export type TRootState = ReturnType<typeof rootReducer>;
