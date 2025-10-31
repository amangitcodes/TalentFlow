// src/mocks/jobsAPI.js
import db, { getAllJobs, addJob, updateJob, reorderJobsInDB, getJobById } from "../indexedDB/jobDB";

/**
 * fetchJobs - fetch jobs with optional search / status filtering.
 * returns array of job objects.
 */
export const fetchJobs = async ({ search = "", status = "" } = {}) => {
  let jobs = await getAllJobs();

  if (search) {
    const s = search.toLowerCase();
    jobs = jobs.filter((j) => j.title.toLowerCase().includes(s) || (j.slug && j.slug.includes(s)));
  }

  if (status) {
    jobs = jobs.filter((j) => (j.status || "").toLowerCase() === status.toLowerCase());
  }

  jobs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return jobs;
};

export const createJob = async (job) => {
  const id = await addJob(job);
  const created = await getJobById(id);
  return created;
};

export const updateExistingJob = async (id, updates) => {
  const updated = await updateJob(Number(id), updates);
  return updated;
};

/**
 * reorderJobs by providing fromIndex and toIndex.
 * Implementation here uses a snapshot sort by order and reassigns order indices.
 */
export const reorderJobs = async (fromIndex, toIndex) => {
  const jobs = await getAllJobs();
  // ensure sorted by order
  const sorted = jobs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const [moved] = sorted.splice(fromIndex, 1);
  sorted.splice(toIndex, 0, moved);

  // reassign order
  await reorderJobsInDB(sorted.map((j) => ({ id: j.id })));
  // return updated list
  return await getAllJobs();
};
