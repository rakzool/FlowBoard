import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { TAppDispatch } from "./store";
import type { TRootState } from "./reducer/rootReducer";

export const useAppDispatch = (): TAppDispatch => useDispatch<TAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
