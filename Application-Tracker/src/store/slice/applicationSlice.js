import { createSlice } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applications: [],
  },
  reducers: {
    addApplication(state, action) {
      state.applications.push(action.payload);
    },
    removeApplication(state, action) {
      state.applications = state.applications.filter(app => app.id !== action.payload);
    },
    updateApplication(state, action) {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },
  },
});

export const { addApplication, removeApplication, updateApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
