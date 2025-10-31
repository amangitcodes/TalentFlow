import Dexie from "dexie";

// Initialize IndexedDB
const db = new Dexie("TalentFlowDB");

// Define schema
db.version(3).stores({
  candidates: "++id,name,email,jobTitle,stage",
  timeline: "++id,candidateId,timestamp,stage",
  notes: "++id,candidateId,content,timestamp",
});

// ───────────────────────────────
// 🎯 Stage Definitions (Updated)
// ───────────────────────────────
export const CANDIDATE_STAGES = [
  { key: "applied", label: "Applied" },
  { key: "screening", label: "Screening" },
  { key: "technical", label: "Technical" },
  { key: "offer", label: "Offer" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];

// ───────────────────────────────
// ⚙️ Simulated Network (Safe for Seeding)
// ───────────────────────────────
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const simulateNetwork = async (disableError = false) => {
  // Skip random errors during seeding
  if (globalThis.__SEEDING__) return;
  await delay(200 + Math.random() * 1000);
  if (!disableError && Math.random() < 0.08) {
    throw new Error("Simulated network error");
  }
};

// ───────────────────────────────
// 🧩 Candidate Operations
// ───────────────────────────────

// Add new candidate and create initial timeline entry
export const addCandidate = async (candidate) => {
  await simulateNetwork();

  const id = await db.candidates.add({
    ...candidate,
    stage: candidate.stage || "applied",
  });

  await db.timeline.add({
    candidateId: id,
    stage: candidate.stage || "applied",
    timestamp: new Date().toISOString(),
  });

  return id;
};

// Get all candidates
export const getAllCandidates = async () => db.candidates.toArray();

// Fetch candidates with filters + pagination
export const fetchCandidates = async ({
  search = "",
  stage = "",
  page = 1,
  limit = 50,
} = {}) => {
  await simulateNetwork();

  let all = await db.candidates.toArray();

  if (search) {
    const s = search.toLowerCase();
    all = all.filter(
      (c) =>
        c.name?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s)
    );
  }

 if (stage) {
  const stageLower = stage.toLowerCase();
  all = all.filter(c => c.stage?.toLowerCase() === stageLower);
}


  const total = all.length;
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return { data, total, page, limit };
};

// Get single candidate by ID
export const getCandidateById = async (id) => db.candidates.get(Number(id));

// Update candidate info or stage
export const updateCandidate = async (id, updates) => {
  await simulateNetwork();

  await db.candidates.update(id, updates);

  if (updates.stage) {
    await db.timeline.add({
      candidateId: id,
      stage: updates.stage,
      timestamp: new Date().toISOString(),
    });
  }
};

// Delete candidate and related data
export const deleteCandidate = async (id) => {
  await simulateNetwork();

  await db.candidates.delete(id);
  await db.timeline.where("candidateId").equals(id).delete();
  await db.notes.where("candidateId").equals(id).delete();
};

// ───────────────────────────────
// 🕓 Timeline Operations
// ───────────────────────────────
export const getCandidateTimeline = async (candidateId) =>
  db.timeline
    .where("candidateId")
    .equals(Number(candidateId))
    .sortBy("timestamp");

// ───────────────────────────────
// 📝 Notes Operations
// ───────────────────────────────
export const addNote = async (candidateId, content) => {
  await simulateNetwork();

  return db.notes.add({
    candidateId,
    content,
    timestamp: new Date().toISOString(),
  });
};

export const getNotesForCandidate = async (candidateId) =>
  db.notes
    .where("candidateId")
    .equals(Number(candidateId))
    .sortBy("timestamp");

export const deleteNote = async (noteId) => db.notes.delete(noteId);

// ───────────────────────────────
// 🔁 Reseed Utility
// ───────────────────────────────
export const resetCandidates = async () => {
  await db.candidates.clear();
  await db.timeline.clear();
  await db.notes.clear();
  console.log("✅ Candidates, timeline, and notes cleared.");
};

export default db;
