import { addJob, getAllJobs } from "../indexedDB/jobDB";

// ================================
// JOB SEED DATA
// ================================

const jobTitles = [
  "Frontend Developer", "Backend Engineer", "Full Stack Developer", "Data Analyst",
  "UI/UX Designer", "QA Engineer", "Project Manager", "DevOps Engineer",
  "Mobile App Developer", "Machine Learning Engineer", "Data Scientist",
  "Product Manager", "Security Analyst", "Cloud Architect", "Software Engineer Intern",
  "System Administrator", "Technical Writer", "Business Analyst", "AI Researcher",
  "Database Administrator", "Game Developer", "Blockchain Developer",
  "Automation Tester", "Network Engineer", "Support Engineer",
];

const possibleTags = [
  "Remote", "On-site", "Hybrid", "Full-time", "Part-time", "Contract",
  "Urgent", "Fresher", "Experienced", "Hot Role",
];

const possibleJobTypes = ["Full-time", "Part-time", "Internship", "Contract", "Remote"];
const possibleLocations = ["Bangalore", "Hyderabad", "Pune", "Remote", "Mumbai", "Chennai"];

// ================================
// HELPERS
// ================================

const getRandomTags = () => {
  const count = Math.floor(Math.random() * 3) + 1;
  return [...possibleTags].sort(() => 0.5 - Math.random()).slice(0, count);
};
const getRandomStatus = () => (Math.random() < 0.8 ? "Open" : "Closed");
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ================================
// SEED FUNCTION
// ================================

export const seedJobs = async () => {
  const existingJobs = await getAllJobs();
  if (existingJobs.length >= jobTitles.length) {
    console.log("✅ Jobs already exist — skipping seeding.");
    return;
  }

  console.log("⏳ Seeding jobs...");

  const seedData = jobTitles.map((title, index) => ({
    title,
    description: `We are looking for a passionate ${title} to join our dynamic team.`,
    location: getRandomItem(possibleLocations),
    jobType: getRandomItem(possibleJobTypes),
    requirements: "Proficiency in modern tools, good communication, teamwork.",
    tags: getRandomTags(),
    slug: `${title.toLowerCase().replace(/\s+/g, "-")}-${index}`,
    status: getRandomStatus(),
    order: index,
    createdAt: new Date().toISOString(),
  }));

  // Sequential add ensures deterministic order
  for (const job of seedData) {
    await addJob(job);
  }

  console.log(`✅ Seeded ${seedData.length} jobs successfully.`);
};
