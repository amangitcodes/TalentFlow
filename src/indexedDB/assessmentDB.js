import Dexie from "dexie";

// =====================
// Initialize Database
// =====================

const db = new Dexie("TalentFlowDB");

// Define or extend schema (keep same version as other DB modules)
db.version(1).stores({
  assessments: "jobId, title, updatedAt",
  responses: "++id, jobId, candidateId, submittedAt, [jobId+candidateId]",
});

export default db;

// =====================
// CRUD: Assessments
// =====================

// Get assessment by jobId
export async function getAssessmentByJobId(jobId) {
  return await db.assessments.get({ jobId });
}

// Get all assessments
export async function getAllAssessments() {
  return await db.assessments.toArray();
}

// Save or update an assessment
export async function saveAssessment(assessment) {
  assessment.updatedAt = new Date().toISOString();
  return await db.assessments.put(assessment);
}

// Delete an assessment by jobId
export async function deleteAssessment(jobId) {
  return await db.assessments.where("jobId").equals(jobId).delete();
}

// Export all assessments as JSON string (for backup or sharing)
export async function exportAssessments() {
  const data = await db.assessments.toArray();
  return JSON.stringify(data, null, 2);
}

// Import assessments from JSON string
export async function importAssessments(jsonString) {
  const data = JSON.parse(jsonString);
  await db.assessments.bulkPut(data);
  return data.length;
}

// =====================
// CRUD: Responses
// =====================

// Save candidate response (local-only by default)
export async function saveResponse(response) {
  response.submittedAt = new Date().toISOString();
  response.syncStatus = response.syncStatus || "local"; // local | pending | synced
  return await db.responses.add(response);
}

// Get all responses for a specific job
export async function getResponsesByJob(jobId) {
  return await db.responses.where("jobId").equals(jobId).toArray();
}

// Get all responses for a specific candidate
export async function getResponsesByCandidate(candidateId) {
  return await db.responses.where("candidateId").equals(candidateId).toArray();
}

// Get all unsynced responses (useful for background sync)
export async function getPendingResponses() {
  return await db.responses.where("syncStatus").equals("local").toArray();
}

// Mark a response as synced after successful upload
export async function markResponseSynced(id) {
  return await db.responses.update(id, { syncStatus: "synced" });
}

// Local-only submit helper (mimics POST /assessments/:jobId/submit)
export async function submitAssessmentResponse(jobId, candidateId, answers) {
  const response = {
    jobId,
    candidateId,
    answers,
    submittedAt: new Date().toISOString(),
    syncStatus: "local",
  };
  return await saveResponse(response);
}
