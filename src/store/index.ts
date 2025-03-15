import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import agentReducer from './slices/agentSlice';
import technologyReducer from './slices/technologySlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    agents: agentReducer,
    technology: technologyReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 