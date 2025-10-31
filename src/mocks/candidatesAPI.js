// src/mocks/candidateAPI.js
import db, {
  fetchCandidates as dbFetchCandidates,
  updateCandidate as dbUpdateCandidate,
  getCandidateById,
  getCandidateTimeline,
  addCandidate,
  getAllCandidates,
} from "../indexedDB/candidatesDB";

/**
 * fetchCandidates wrapper: returns array or {data,total,page,limit}
 * your db.fetchCandidates already returns {data, total, page, limit}
 */
export const fetchCandidates = async (opts = {}) => {
  // your indexedDB utility returns {data, total, page, limit}
  return await dbFetchCandidates(opts);
};

/**
 * updateCandidateStage - update stage for candidate
 */
export const updateCandidateStage = async (id, stage) => {
  await dbUpdateCandidate(Number(id), { stage });
  return { id: String(id), stage };
};

export const fetchCandidateTimeline = async (id) => {
  return await getCandidateTimeline(Number(id));
};

export const createCandidate = async (candidate) => {
  const id = await addCandidate(candidate);
  return await getCandidateById(Number(id));
};

export const fetchAllCandidates = async () => {
  return await getAllCandidates();
};
