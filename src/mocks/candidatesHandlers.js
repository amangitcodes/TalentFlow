// src/mocks/candidatesHandlers.js
import { rest } from "msw";
import {
  fetchCandidates,
  updateCandidateStage,
  fetchCandidateTimeline,
  createCandidate,
} from "./candidatesAPI";

/* GET /api/candidates */
export const candidatesHandlers = [
  rest.get("/api/candidates", async (req, res, ctx) => {
    const search = req.url.searchParams.get("search") || "";
    const stage = req.url.searchParams.get("stage") || "";
    const page = Number(req.url.searchParams.get("page") || 1);
    const limit = Number(req.url.searchParams.get("limit") || 50);

    // re-use candidateAPI which returns {data, total, page, limit}
    const result = await fetchCandidates({ search, stage, page, limit });
    return res(ctx.status(200), ctx.json(result));
  }),

  /* PATCH /api/candidates/:id */
  rest.patch("/api/candidates/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const payload = await req.json();
    // expect payload to contain stage or other updates
    const updated = await updateCandidateStage(id, payload.stage || payload);
    return res(ctx.status(200), ctx.json(updated));
  }),

  /* GET /api/candidates/:id/timeline */
  rest.get("/api/candidates/:id/timeline", async (req, res, ctx) => {
    const { id } = req.params;
    const timeline = await fetchCandidateTimeline(id);
    return res(ctx.status(200), ctx.json(timeline));
  }),

  /* POST /api/candidates (create) */
  rest.post("/api/candidates", async (req, res, ctx) => {
    const payload = await req.json();
    const created = await createCandidate(payload);
    return res(ctx.status(201), ctx.json(created));
  }),
];
