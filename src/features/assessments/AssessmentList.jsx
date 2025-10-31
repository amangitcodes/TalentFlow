import React, { useEffect, useState } from "react";
import { getAllAssessments } from "../../indexedDB/assessmentDB";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Eye, Pencil } from "lucide-react";

export default function AssessmentList() {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getAllAssessments();
      setAssessments(data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        
         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Assessment Manager
          </h1>

        <button
          onClick={() => navigate("/assessments/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md 
                     hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
        >
          <PlusCircle size={18} />
          <span className="font-medium">New Assessment</span>
        </button>
      </div>

      {/* Assessment List */}
      {assessments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 py-20">
          <p className="text-lg">No assessments found yet.</p>
          <button
            onClick={() => navigate("/assessments/new")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all"
          >
            Create Your First Assessment
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((a) => (
            <div
              key={a.jobId}
              className="bg-white/70 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-sm hover:shadow-md 
                         p-6 transition-all duration-200 hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                {a.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Updated: {new Date(a.updatedAt).toLocaleDateString()}
              </p>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => navigate(`/assessments/${a.jobId}/edit`)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-700 bg-blue-50 
                             border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => navigate(`/assessments/${a.jobId}/preview`)}
                  className="flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 
                             border border-green-100 px-3 py-1.5 rounded-lg hover:bg-green-100 transition"
                >
                  <Eye size={14} /> Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
