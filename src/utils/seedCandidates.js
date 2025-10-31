import db, { addCandidate, resetCandidates } from "../indexedDB/candidatesDB";
import { getAllJobs } from "../indexedDB/jobDB";

// ================================
// RANDOM DATA GENERATORS
// ================================
const firstNames = [
  "Aman", "Neha", "Riya", "Karan", "Raj", "Pooja", "Rohit",
  "Sanya", "Vivek", "Simran", "Anjali", "Ishaan", "Kavita",
];
const lastNames = [
  "Sharma", "Verma", "Patel", "Rathore", "Gupta", "Jain",
  "Singh", "Yadav", "Joshi", "Agarwal", "Mehta",
];
const stages = ["applied", "screening", "technical", "offer", "hired", "rejected"];

const generateRandomName = (id) => {
  const f = firstNames[id % firstNames.length];
  const l = lastNames[id % lastNames.length];
  return `${f} ${l}`;
};

// Fisher–Yates Shuffle
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// ================================
// MAIN SEED FUNCTION
// ================================
export async function seedCandidates(total = 500) {
  const count = await db.candidates.count();
  if (count >= total) {
    console.info(`✅ ${count} candidates already exist — skipping seeding.`);
    return;
  }

  const jobs = await getAllJobs();
  if (jobs.length === 0) {
    console.warn("⚠️ No jobs found — seed jobs before seeding candidates.");
    return;
  }

  console.log("⏳ Seeding candidates with balanced stage distribution...");
  globalThis.__SEEDING__ = true;

  const perStage = Math.floor(total / stages.length);
  let remaining = total - perStage * stages.length;
  const candidates = [];

  let id = 1;
  for (const stage of stages) {
    let countForStage = perStage;
    if (remaining > 0) {
      countForStage++;
      remaining--;
    }

    for (let i = 0; i < countForStage; i++, id++) {
      const name = generateRandomName(id);
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      candidates.push({
        name,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        jobId: job.id,
        jobTitle: job.title,
        stage,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Shuffle & trim (guarantees exactly total)
  const finalCandidates = shuffleArray(candidates).slice(0, total);

  // Insert in batches safely
  const batchSize = 200;
  let inserted = 0;

  for (let start = 0; start < finalCandidates.length; start += batchSize) {
    const batch = finalCandidates.slice(start, start + batchSize);

    for (const candidate of batch) {
      let added = false;
      while (!added) {
        try {
          await addCandidate(candidate);
          added = true;
          inserted++;
        } catch (err) {
          if (err.message.includes("Simulated network error")) {
            console.warn("⚠️ Retrying candidate due to simulated network issue...");
          } else {
            throw err;
          }
        }
      }
    }
    console.log(`✅ Batch ${start + 1}–${Math.min(start + batchSize, total)} complete.`);
  }

  console.log(`🎯 Exactly ${inserted} candidates inserted successfully.`);
  globalThis.__SEEDING__ = false;
}

// ================================
// RESET + RESEED
// ================================
export async function reseedCandidates() {
  console.log("♻️ Resetting and reseeding candidates...");
  await resetCandidates();
  await seedCandidates(1000);
}
