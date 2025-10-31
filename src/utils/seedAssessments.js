import { saveAssessment } from "../indexedDB/assessmentDB";

// Helper to get a random item
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate and seed sample assessment data
export async function seedAssessments() {
  const questionTypes = [
    "short-text",
    "long-text",
    "single-choice",
    "multi-choice",
    "numeric",
  ];

  // Create 3 assessments, each with 10 questions
  const assessments = [1, 2, 3].map((num) => ({
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
  }));

  // Save all assessments into IndexedDB
  for (const a of assessments) {
    await saveAssessment(a);
  }

  console.log("✅ Seeded 3 assessments with 10 questions each into IndexedDB");
}
