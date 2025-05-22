import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: 'light',
    notificationsEnabled: true,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setNotifications(state, action) {
      state.notificationsEnabled = action.payload;
    },
  },
});

export const { toggleTheme, setNotifications } = settingsSlice.actions;
export default settingsSlice.reducer;
