// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import providerReducer from './slices/providerSlice'; // 변경된 임포트 경로

const store = configureStore({
  reducer: {
    provider: providerReducer
  }
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
