import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./features/layout/navbar";
import Dashboard from "./features/dashboard/dashboard";
import JobsList from "./features/jobs/JobsList";
import JobDetails from "./features/jobs/JobDetails";
import CandidatesList from "./features/candidates/CandidatesList";
import CandidateProfile from "./features/candidates/CandidateProfile";
import CandidateVirtualKanban from "./features/candidates/CandidateKanban";
import AssessmentList from "./features/assessments/AssessmentList";
import AssessmentPreview from "./features/assessments/AssessmentPreview";
import AssessmentRuntime from "./features/assessments/AssessmentRuntime";
import AssessmentBuilder from "./features/assessments/AssessmentBuilder";
import { seedAllData } from "./utils/seedAll";

function App() {
  useEffect(() => {
    seedAllData();
  }, []);

  return (
    <Router>
      <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
        {/* 🔹 Global Navbar */}
        <Navbar />

        {/* 🔹 Toast notifications */}
        <Toaster position="bottom-right" toastOptions={{ duration: 2500 }} />

        {/* 🔹 Main Content */}
        <main className="pt-20 px-2 sm:px-4">
          <Routes>
            {/* Default route → Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Jobs */}
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />

            {/* Candidates */}
            <Route path="/candidates" element={<CandidatesList />} />
            <Route path="/candidates/:id" element={<CandidateProfile />} />
            <Route
              path="/candidates/kanban"
              element={<CandidateVirtualKanban />}
            />

            {/* Assessments */}
            <Route path="/assessments" element={<AssessmentList />} />
            <Route path="/assessments/new" element={<AssessmentBuilder />} />
            <Route path="/assessments/:jobId/edit" element={<AssessmentBuilder />} />
            <Route
              path="/assessments/:jobId/preview"
              element={<AssessmentPreview />}
            />
            <Route
              path="/assessments/:jobId/fill"
              element={<AssessmentRuntime />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
