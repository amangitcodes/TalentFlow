import { rest } from "msw";
import {
  fetchAssessment,
  fetchAllAssessments,
  updateAssessment,
  submitAssessmentResponse,
} from "./assessmentsAPI";

export const assessmentsHandlers = [
  // GET /api/assessments → list all assessments
  rest.get("/api/assessments", async (_req, res, ctx) => {
    const data = await fetchAllAssessments();
    return res(ctx.status(200), ctx.json(data));
  }),

  // GET /api/assessments/:jobId → fetch single assessment
  rest.get("/api/assessments/:jobId", async (req, res, ctx) => {
    const { jobId } = req.params;
    const data = await fetchAssessment(jobId);
    if (!data) {
      return res(
        ctx.status(404),
        ctx.json({ message: `Assessment not found for jobId ${jobId}` })
      );
    }
    return res(ctx.status(200), ctx.json(data));
  }),

  // PUT /api/assessments/:jobId → save/update assessment
  rest.put("/api/assessments/:jobId", async (req, res, ctx) => {
    const { jobId } = req.params;
    const payload = await req.json();
    const updated = await updateAssessment(jobId, payload);
    return res(ctx.status(200), ctx.json(updated));
  }),

  // POST /api/assessments/:jobId/submit → save candidate response
  rest.post("/api/assessments/:jobId/submit", async (req, res, ctx) => {
    const { jobId } = req.params;
    const payload = await req.json();
    const result = await submitAssessmentResponse(jobId, payload);
    return res(ctx.status(200), ctx.json(result));
  }),

  
];
