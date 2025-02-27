import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
// TypedUseSelectorHook<RootState> - типизированная версия useSelector, чтобы TypeScript знал структуру состояния
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
