import React, { useEffect, useState } from "react";
import { Briefcase, Users, ClipboardList, TrendingUp, Mail, Globe, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllCandidates } from "../../indexedDB/candidatesDB";
import { getAllAssessments } from "../../indexedDB/assessmentDB";
import { getAllJobs } from "../../indexedDB/jobDB";

export default function EDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    closedJobs: 0,
    totalCandidates: 0,
    candidatesByStage: {},
    totalAssessments: 0,
    completedAssessments: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const [jobs, candidates, assessments] = await Promise.all([
          getAllJobs(),
          getAllCandidates(),
          getAllAssessments(),
        ]);

        // Detect open/closed job statuses dynamically
        const openJobs = jobs.filter(
          (j) =>
            j.status?.toLowerCase() === "open" ||
            j.stage?.toLowerCase() === "open" ||
            j.isActive === true
        ).length;

        const closedJobs = jobs.filter(
          (j) =>
            j.status?.toLowerCase() === "closed" ||
            j.stage?.toLowerCase() === "closed" ||
            j.isActive === false
        ).length;

        // Candidate distribution by stage
        const candidatesByStage = candidates.reduce((acc, c) => {
          const stage = c.stage || c.status || "unknown";
          acc[stage] = (acc[stage] || 0) + 1;
          return acc;
        }, {});

        const completedAssessments = assessments.filter(
          (a) => a.completed === true || a.status === "completed"
        ).length;

        setStats({
          totalJobs: jobs.length,
          openJobs,
          closedJobs,
          totalCandidates: candidates.length,
          candidatesByStage,
          totalAssessments: assessments.length,
          completedAssessments,
        });
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const StatCard = ({ icon, color, title, value, subtitle, onClick }) => (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white/70 backdrop-blur-md border border-white/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-5 rounded-2xl"
    >
      <div className="flex justify-between items-center mb-3">
        <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
        <TrendingUp className="text-gray-400" size={18} />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent">
            HR Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time overview of jobs, candidates, and assessments
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Jobs"
          subtitle={`${stats.openJobs} open • ${stats.closedJobs} closed`}
          value={stats.totalJobs}
          icon={<Briefcase size={22} />}
          color="blue"
          onClick={() => navigate("/jobs")}
        />
        <StatCard
          title="Candidates"
          subtitle={`${Object.keys(stats.candidatesByStage).length} stages`}
          value={stats.totalCandidates}
          icon={<Users size={22} />}
          color="indigo"
          onClick={() => navigate("/candidates")}
        />
        <StatCard
          title="Assessments"
          subtitle={`${stats.completedAssessments} completed`}
          value={stats.totalAssessments}
          icon={<ClipboardList size={22} />}
          color="purple"
          onClick={() => navigate("/assessments")}
        />
      </div>

      {/* Candidate Breakdown */}
      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Candidate Breakdown by Stage
        </h2>
        {Object.keys(stats.candidatesByStage).length === 0 ? (
          <p className="text-gray-500 text-sm">No candidate data available.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.candidatesByStage).map(([stage, count]) => (
              <li
                key={stage}
                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border"
              >
                <span className="capitalize">{stage}</span>
                <span className="text-indigo-700 font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <div className="grid sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">About TalentFlow</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              TalentFlow helps streamline the hiring process with job tracking,
              assessments, and candidate management — all in one unified dashboard.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
            <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
              <Mail size={14} /> contact@talentflow.com
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mt-1">
              <Globe size={14} /> www.talentflow.io
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Follow Us</h4>
            <div className="flex justify-center sm:justify-start gap-4 text-gray-600">
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                <Github size={18} className="hover:text-gray-900 transition" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <svg
                  className="w-5 h-5 fill-current hover:text-gray-900 transition"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5V24H0V8zM9 8h4.66v2.57h.06c.65-1.24 2.25-2.55 4.64-2.55 4.96 0 5.88 3.27 5.88 7.52V24h-5V16.17c0-1.86-.03-4.26-2.6-4.26-2.6 0-3 2.03-3 4.13V24H9V8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} TalentFlow — Built for smarter, data-driven hiring
        </p>
      </footer>
    </div>
  );
}
