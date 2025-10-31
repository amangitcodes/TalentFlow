import { saveAssessment, getAssessmentByJobId } from "../indexedDB/assessmentDB";

// Helper to get a random item
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ================================
// MAIN SEED FUNCTION
// ================================
export async function seedAssessments(total = 3) {
  const questionTypes = [
    "short-text",
    "long-text",
    "single-choice",
    "multi-choice",
    "numeric",
  ];

  console.log("⏳ Checking existing assessments...");

  let alreadySeeded = 0;

  // Check if assessments already exist to prevent duplicates
  for (let num = 1; num <= total; num++) {
    const existing = await getAssessmentByJobId(`job-${num}`);
    if (existing) alreadySeeded++;
  }

  if (alreadySeeded >= total) {
    console.info(`✅ ${alreadySeeded} assessments already exist — skipping seeding.`);
    return;
  }

  console.log(`🚀 Seeding ${total - alreadySeeded} new assessments...`);

  const assessments = [];
  for (let num = 1; num <= total; num++) {
    const existing = await getAssessmentByJobId(`job-${num}`);
    if (existing) continue;

    assessments.push({
      jobId: `job-${num}`,
      title: `Assessment for Job ${num}`,
      sections: [
        {
          id: `section-${num}`,
          title: "General Skills",
          questions: Array.from({ length: 10 }, (_, i) => {
            const type = randomItem(questionTypes);
            return {
              id: `q${i + 1}`,
              label: `Question ${i + 1} for Assessment ${num}`,
              type,
              options:
                type.includes("choice")
                  ? [
                      { id: "optA", label: "Option A" },
                      { id: "optB", label: "Option B" },
                      { id: "optC", label: "Option C" },
                    ]
                  : [],
              required: Math.random() < 0.7,
            };
          }),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Save all assessments (safe with retries)
  for (const assessment of assessments) {
    let saved = false;
    while (!saved) {
      try {
        await saveAssessment(assessment);
        saved = true;
        console.log(`✅ Saved ${assessment.title}`);
      } catch (err) {
        console.warn("⚠️ Retry saving assessment due to IndexedDB issue...");
        await new Promise((r) => setTimeout(r, 50));
      }
    }
  }

  console.log(`🎯 Successfully seeded ${assessments.length} assessments into IndexedDB.`);
}

// ================================
// RESET + RESEED
// ================================
export async function reseedAssessments() {
  console.log("♻️ Resetting and reseeding assessments...");
  const { clearAllAssessments } = await import("../indexedDB/assessmentDB");
  await clearAllAssessments();
  await seedAssessments(3);
}