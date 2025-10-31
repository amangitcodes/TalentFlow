// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   jobs: [],
//   loading: false,
//   error: null,
// };

// const jobsSlice = createSlice({
//   name: 'jobs',
//   initialState,
//   reducers: {
//     getJobsStart(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     getJobsSuccess(state, action) {
//       state.loading = false;
//       state.jobs = action.payload;
//     },
//     getJobsFailure(state, action) {  // <-- Ensure this is here
//       state.loading = false;
//       state.error = action.payload;
//     },
//   },
// });

// export const { getJobsStart, getJobsSuccess, getJobsFailure } = jobsSlice.actions;

// export default jobsSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllJobs, addJob, updateJob } from "../../indexedDB/jobDB";

// === Async Thunks ===

// Fetch jobs from IndexedDB
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const jobs = await getAllJobs();
  return jobs.sort((a, b) => a.order - b.order);
});

// Add new job
export const createJob = createAsyncThunk("jobs/createJob", async (jobData) => {
  const allJobs = await getAllJobs();
  const newOrder = allJobs.length;
  const id = await addJob({ ...jobData, order: newOrder, status: "active" });
  return { id, ...jobData, order: newOrder, status: "active" };
});

// Update job (edit fields)
export const editJob = createAsyncThunk("jobs/editJob", async ({ id, updates }) => {
  await updateJob(id, updates);
  return { id, updates };
});

// Toggle archive / unarchive
export const toggleArchiveJob = createAsyncThunk("jobs/toggleArchive", async (job) => {
  const newStatus = job.status === "active" ? "archived" : "active";
  await updateJob(job.id, { status: newStatus });
  return { id: job.id, status: newStatus };
});

// Reorder jobs (optimistic update + rollback)
export const reorderJobs = createAsyncThunk(
  "jobs/reorderJobs",
  async ({ reordered, previous }, { rejectWithValue }) => {
    try {
      // Simulate random failure (10%)
      const fail = Math.random() < 0.1;
      if (fail) throw new Error("Simulated network error");

      await Promise.all(
        reordered.map((job, index) => updateJob(job.id, { order: index }))
      );

      return reordered;
    } catch (error) {
      return rejectWithValue(previous); // rollback
    }
  }
);

// === Slice ===

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Fetch Jobs ===
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // === Create Job ===
      .addCase(createJob.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // === Edit Job ===
      .addCase(editJob.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const index = state.list.findIndex((j) => j.id === id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...updates };
        }
      })

      // === Toggle Archive ===
      .addCase(toggleArchiveJob.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const job = state.list.find((j) => j.id === id);
        if (job) job.status = status;
      })

      // === Reorder Jobs ===
      .addCase(reorderJobs.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(reorderJobs.rejected, (state, action) => {
        // Rollback if failed
        state.list = action.payload;
        state.error = "Reorder failed, rolled back.";
      });
  },
});

export default jobsSlice.reducer;
