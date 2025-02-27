import { configureStore } from '@reduxjs/toolkit';

import fetchSlice from './fetchSlice';

const store = configureStore({
  reducer: {
    fetchReducer: fetchSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;

// тип всего состояния хранилища. Используется для типизации useSelector
export type RootState = ReturnType<typeof store.getState>;
// тип функции dispatch, используется для типизации useDispatch
export type AppDispatch = typeof store.dispatch;
