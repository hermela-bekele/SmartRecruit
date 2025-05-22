// application-tracker/src/store/slice/jobsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobsList: [],
    loading: false,
  },
  reducers: {
    fetchJobsStart(state) {
      state.loading = true;
    },
    fetchJobsSuccess(state, action) {
      state.jobsList = action.payload;
      state.loading = false;
    },
    fetchJobsFailure(state) {
      state.loading = false;
    },
    addJob(state, action) {
      state.jobsList.push(action.payload);
    },
    removeJob(state, action) {
      state.jobsList = state.jobsList.filter(job => job.id !== action.payload);
    },
  },
});

export const { fetchJobsStart, fetchJobsSuccess, fetchJobsFailure, addJob, removeJob } = jobsSlice.actions;
export default jobsSlice.reducer;