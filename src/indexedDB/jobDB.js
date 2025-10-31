import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

// ================================
// DATABASE SCHEMA (v5)
// ================================
db.version(5).stores({
  jobs: "++id,slug,title,status,jobType,location,tags,order,createdAt",
});

// ================================
// JOB CRUD OPERATIONS
// ================================

// ✅ Add a new job
export const addJob = async (job) => {
  const newJob = {
    title: job.title,
    description: job.description || "",
    location: job.location || "",
    jobType: job.jobType || "Full-time",
    requirements: job.requirements || "",
    tags: job.tags || [],
    slug:
      job.slug ||
      job.title.toLowerCase().replace(/\s+/g, "-") +
        "-" +
        Math.random().toString(36).substring(2, 6),
    status: job.status || "Open",
    order: job.order ?? 0,
    createdAt: job.createdAt || new Date().toISOString(),
  };

  const id = await db.jobs.add(newJob);
  return id;
};

// ✅ Fetch all jobs (sorted)
export const getAllJobs = async () => {
  const jobs = await db.jobs.toArray();
  return jobs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

// ✅ Get a single job by ID
export const getJobById = async (id) => {
  return await db.jobs.get(Number(id));
};

// ✅ Update job (edit / archive / reorder)
export const updateJob = async (id, updates) => {
  await db.jobs.update(Number(id), updates);
  return await db.jobs.get(Number(id));
};

// ✅ Delete job
export const deleteJob = async (id) => {
  await db.jobs.delete(Number(id));
};

// ✅ Archive / Unarchive
export const toggleJobStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === "Open" ? "Closed" : "Open";
  await db.jobs.update(Number(id), { status: newStatus });
  return newStatus;
};

// ✅ Reorder jobs (updates order for all)
export const reorderJobsInDB = async (jobs) => {
  await Promise.all(
    jobs.map((job, index) => db.jobs.update(Number(job.id), { order: index }))
  );
};

// ✅ Clear all jobs (useful for reseeding)
export const clearJobs = async () => {
  await db.jobs.clear();
};

// default export for convenience
export default db;
