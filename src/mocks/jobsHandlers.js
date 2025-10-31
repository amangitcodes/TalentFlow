// src/mocks/jobsHandlers.js
import { rest } from "msw";
import { fetchJobs, createJob, updateExistingJob, reorderJobs } from "./jobsAPI";

/* GET /api/jobs */
export const jobsHandlers = [
  rest.get("/api/jobs", async (req, res, ctx) => {
    const search = req.url.searchParams.get("search") || "";
    const status = req.url.searchParams.get("status") || "";
    const jobs = await fetchJobs({ search, status });
    return res(ctx.status(200), ctx.json(jobs));
  }),

  /* POST /api/jobs */
  rest.post("/api/jobs", async (req, res, ctx) => {
    const payload = await req.json();
    const created = await createJob(payload);
    return res(ctx.status(201), ctx.json(created));
  }),

  /* PATCH /api/jobs/:id */
  rest.patch("/api/jobs/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    const updated = await updateExistingJob(id, updates);
    return res(ctx.status(200), ctx.json(updated));
  }),

  /* PATCH /api/jobs/reorder */
  rest.patch("/api/jobs/reorder", async (req, res, ctx) => {
    const { fromIndex, toIndex } = await req.json();
    const updated = await reorderJobs(Number(fromIndex), Number(toIndex));
    return res(ctx.status(200), ctx.json(updated));
  }),
];
