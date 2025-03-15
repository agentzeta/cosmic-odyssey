import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  currentStep: number;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>;
  sidebarOpen: boolean;
}

const initialState: UIState = {
  currentStep: 0,
  notifications: [],
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  setCurrentStep,
  addNotification,
  removeNotification,
  toggleSidebar,
} = uiSlice.actions;
export default uiSlice.reducer; 