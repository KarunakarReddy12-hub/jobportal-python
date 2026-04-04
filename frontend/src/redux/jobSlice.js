import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchedQuery: "",
    allAppliedJobs: [],
  },
  reducers: {
    setAllJobs: (state, action) => { state.allJobs = action.payload; },
    setAllAdminJobs: (state, action) => { state.allAdminJobs = action.payload; },
    setSingleJob: (state, action) => { state.singleJob = action.payload; },
    setSearchedQuery: (state, action) => { state.searchedQuery = action.payload; },
    setAllAppliedJobs: (state, action) => { state.allAppliedJobs = action.payload; },
  },
});

export const {
  setAllJobs, setAllAdminJobs, setSingleJob, setSearchedQuery, setAllAppliedJobs,
} = jobSlice.actions;
export default jobSlice.reducer;
