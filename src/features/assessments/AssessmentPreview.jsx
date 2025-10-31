import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAssessmentByJobId } from "../../indexedDB/assessmentDB";
import { FileText, ArrowLeft } from "lucide-react";

export default function AssessmentPreview() {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAssessmentByJobId(jobId);
      setAssessment(data);
      setLoading(false);
    })();
  }, [jobId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Loading assessment...
      </div>
    );

  if (!assessment)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Assessment not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <Link
            to="/assessments"
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Assessments
          </Link>

          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm px-4 py-2 rounded-xl">
            <FileText size={18} className="text-blue-600" />
            <span className="font-medium text-gray-800">Preview Mode</span>
          </div>
        </div>

        {/* Assessment Container */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {assessment.title}
          </h1>

          {assessment.sections.length === 0 ? (
            <p className="text-gray-500 italic">No sections available.</p>
          ) : (
            assessment.sections.map((section, idx) => (
              <div
                key={section.id}
                className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-transparent border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {idx + 1}. {section.title}
                </h2>

                {section.questions.length === 0 ? (
                  <p className="text-gray-500 italic">No questions in this section.</p>
                ) : (
                  section.questions.map((q) => (
                    <div
                      key={q.id}
                      className="mb-5 p-4 rounded-xl bg-white/70 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <label className="block text-gray-800 font-medium mb-2">
                        {q.text}
                      </label>

                      {/* Question Type Preview */}
                      <div className="text-sm text-gray-600">
                        {q.type === "short-text" && (
                          <input
                            type="text"
                            placeholder="Short text answer..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                            disabled
                          />
                        )}
                        {q.type === "long-text" && (
                          <textarea
                            rows={3}
                            placeholder="Long text answer..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                            disabled
                          ></textarea>
                        )}
                        {q.type === "single-choice" && (
                          <p className="italic text-gray-500">Single-choice options</p>
                        )}
                        {q.type === "multi-choice" && (
                          <p className="italic text-gray-500">Multiple-choice options</p>
                        )}
                        {q.type === "numeric" && (
                          <input
                            type="number"
                            placeholder="Numeric input..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                            disabled
                          />
                        )}
                        {q.type === "file" && (
                          <div className="border border-dashed border-gray-300 rounded-lg px-4 py-3 text-gray-500 bg-gray-50 text-center cursor-not-allowed">
                            File upload field
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
