import {
  getAssessmentByJobId,
  getAllAssessments,
  saveAssessment,
  saveResponse,
} from "../indexedDB/assessmentDB";

/* ================================
   Mocked Assessment API (MSW)
   ================================ */

/** Fetch single assessment by jobId */
export const fetchAssessment = async (jobId) => {
  return await getAssessmentByJobId(jobId);
};

/** Fetch all assessments */
export const fetchAllAssessments = async () => {
  return await getAllAssessments();
};

/** Create or update assessment */
export const updateAssessment = async (jobId, data) => {
  const record = {
    ...data,
    jobId,
    updatedAt: new Date().toISOString(),
  };
  await saveAssessment(record);
  return record;
};

/** Submit candidate response */
export const submitAssessmentResponse = async (jobId, response) => {
  const record = {
    ...response,
    jobId,
    submittedAt: new Date().toISOString(),
  };
  await saveResponse(record);
  return { success: true, jobId };
};
