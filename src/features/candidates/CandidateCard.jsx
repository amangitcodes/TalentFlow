import React from "react";
import { Mail, Eye, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ Updated stage labels
const STAGE_LABELS = {
  applied: "Applied",
  screen: "Screening",
  tech: "Technical",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

export default function CandidateCard({ candidate }) {
  const navigate = useNavigate();

  const stageLabel = STAGE_LABELS[candidate.stage] || "Applied";
  const jobTitle = candidate.jobTitle || "Unassigned";

  return (
    <div
      className="group relative bg-white/60 backdrop-blur-md border border-gray-100 
                 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 
                 transition-all duration-300 p-6 flex flex-col justify-between min-h-[220px]"
    >
      {/* ─── Top Section ─── */}
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          {candidate.name}
        </h3>

        {/* Job Title */}
        <div className="flex items-center text-gray-600 text-sm">
          <Briefcase size={14} className="mr-1 text-indigo-500" />
          {jobTitle}
        </div>

        {/* Stage + Contact */}
        <div className="text-gray-700 text-sm flex flex-wrap gap-2 mt-1">
          <span
            className={`font-medium px-3 py-1 rounded-full border text-xs ${
              stageLabel === "Hired"
                ? "bg-green-100/60 text-green-700 border-green-200"
                : stageLabel === "Rejected"
                ? "bg-red-100/60 text-red-700 border-red-200"
                : "bg-blue-100/60 text-blue-700 border-blue-200"
            }`}
          >
            {stageLabel}
          </span>
          <span className="text-gray-600">📧 {candidate.email}</span>
        </div>

        {/* Skills (optional) */}
        {candidate.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {candidate.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-xs bg-indigo-100/60 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-200"
              >
                #{skill}
              </span>
            ))}
            {candidate.skills.length > 4 && (
              <span className="text-xs text-gray-500">
                +{candidate.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* ─── Bottom Buttons ─── */}
      <div className="flex flex-wrap justify-between items-center gap-3 mt-auto">
        {/*  */}

        <button
          onClick={() => navigate(`/candidates/${candidate.id}`)}
          className="flex items-center gap-2 text-sm font-medium 
                     bg-green-50 text-green-700 border border-green-200 
                     px-4 py-2 rounded-lg hover:bg-green-100 hover:shadow-sm
                     active:scale-95 transition-all duration-200"
          aria-label={`View ${candidate.name}'s profile`}
        >
          <Eye size={15} /> View
        </button>
      </div>
    </div>
  );
}
