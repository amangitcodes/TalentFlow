// src/utils/seedAll.js
import { seedJobs } from "./seedJobs";
import { seedCandidates } from "./seedCandidates";
import { seedAssessments } from "./seedAssessments"; // optional — include if you have it
import { getAllJobs } from "../indexedDB/jobDB";
import db from "../indexedDB/candidatesDB";

/**
 * 🌱 Runs all seeders (Jobs, Candidates, Assessments)
 * Ensures each runs only if necessary.
 * Automatically disables simulated errors during seeding.
 */
export const seedAllData = async () => {
  console.group("🌱 Database Seeding");

  // Disable simulated network randomness globally during seeding
  globalThis.__SEEDING__ = true;

  try {
    // ────────────────────────────────
    // Step 1: Seed Jobs
    // ────────────────────────────────
    const jobs = await getAllJobs();
    if (jobs.length === 0) {
      console.log("🧱 No jobs found → seeding jobs...");
      await seedJobs();
    } else {
      console.log(`✅ ${jobs.length} jobs already exist — skipping.`);
    }

    // ────────────────────────────────
    // Step 2: Seed Candidates
    // ────────────────────────────────
    const candidateCount = await db.candidates.count();
    if (candidateCount === 0) {
      console.log("👥 No candidates found → seeding candidates...");
      await seedCandidates();
    } else {
      console.log(`✅ ${candidateCount} candidates already exist — skipping.`);
    }

    // ────────────────────────────────
    // Step 3: Seed Assessments (optional)
    // ────────────────────────────────
    if (typeof seedAssessments === "function") {
      console.log("📝 Seeding assessments (if empty)...");
      await seedAssessments();
    }

    console.log("🌟 All seeding complete!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    // Re-enable simulated network randomness
    globalThis.__SEEDING__ = false;
    console.groupEnd();
  }
};
