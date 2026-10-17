
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, type TRootState } from './reducer/rootReducer';
import { buildSeedState } from './seedState';
 
// Factory so tests can create isolated stores with their own fixtures.
export const makeStore = (preloadedState?: Partial<TRootState>) =>
  configureStore({ reducer: rootReducer, preloadedState });
 
export const store = makeStore(buildSeedState());
 
export type TAppStore = ReturnType<typeof makeStore>;
export type TAppDispatch = TAppStore['dispatch'];
export type { TRootState };
