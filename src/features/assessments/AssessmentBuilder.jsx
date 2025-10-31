import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssessmentByJobId, saveAssessment } from "../../indexedDB/assessmentDB";

export default function AssessmentBuilder() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState({
    title: "",
    jobId: jobId || "",
    sections: [],
  });
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!jobId) return;
      const data = await getAssessmentByJobId(jobId);
      if (data) setAssessment(data);
    })();
  }, [jobId]);

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      questions: [],
    };
    setAssessment((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setNewSectionTitle("");
  };

  const addQuestion = (sectionId, type = "short-text") => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      text: "",
      options: type.includes("choice") ? ["Option 1"] : [],
      required: false,
      validation: {},
      condition: null,
    };
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      ),
    }));
  };

  const updateQuestion = (sectionId, questionId, field, value) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
              ),
            }
          : s
      ),
    }));
  };

  const saveAssessmentData = async () => {
    if (!assessment.title.trim()) {
      alert("Please enter a title before saving.");
      return;
    }
    setSaving(true);
    try {
      await saveAssessment({ ...assessment, jobId });
      alert("✅ Assessment saved successfully!");
      navigate("/assessments");
    } catch (err) {
      console.error("Error saving assessment:", err);
      alert("⚠️ Failed to save assessment.");
    } finally {
      setSaving(false);
    }
  };

  const questionTypes = [
    { id: "short-text", label: "Short Text" },
    { id: "long-text", label: "Long Text" },
    { id: "single-choice", label: "Single Choice" },
    { id: "multi-choice", label: "Multiple Choice" },
    { id: "numeric", label: "Numeric (Range)" },
    { id: "file", label: "File Upload" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800"> Assessment Builder</h1>
          <button
            onClick={() => navigate("/assessments")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to List
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium mb-2">Assessment Title</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter assessment title..."
            value={assessment.title}
            onChange={(e) =>
              setAssessment((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        {/* Add Section */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-400 focus:outline-none"
            placeholder="New section title..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
          <button
            onClick={addSection}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition"
          >
            + Add Section
          </button>
        </div>

        {/* Sections */}
        {assessment.sections.map((section) => (
          <div
            key={section.id}
            className="mb-8 border-t border-gray-200 pt-4 pb-2"
          >
            <h2 className="text-xl font-medium text-gray-700 mb-3">{section.title}</h2>

            {/* Add Question Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {questionTypes.map((qt) => (
                <button
                  key={qt.id}
                  onClick={() => addQuestion(section.id, qt.id)}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition"
                >
                  + {qt.label}
                </button>
              ))}
            </div>

            {/* Questions */}
            {section.questions.map((q) => (
              <div
                key={q.id}
                className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-3 shadow-sm hover:shadow-md transition"
              >
                <input
                  type="text"
                  className="border-b border-gray-300 w-full p-1.5 mb-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter question text..."
                  value={q.text}
                  onChange={(e) =>
                    updateQuestion(section.id, q.id, "text", e.target.value)
                  }
                />

                <details className="text-xs text-gray-600 mt-2">
                  <summary className="cursor-pointer mb-1 font-medium">⚙️ Validation</summary>
                  <div className="pl-3 space-y-2 mt-1">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) =>
                          updateQuestion(section.id, q.id, "required", e.target.checked)
                        }
                      />
                      Required
                    </label>

                    {(q.type === "short-text" || q.type === "long-text") && (
                      <div className="flex items-center gap-2">
                        <span>Max Length:</span>
                        <input
                          type="number"
                          min="1"
                          className="border border-gray-300 p-1 w-20 rounded focus:ring-1 focus:ring-blue-400"
                          value={q.validation?.maxLength || ""}
                          onChange={(e) =>
                            updateQuestion(section.id, q.id, "validation", {
                              ...q.validation,
                              maxLength: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {q.type === "numeric" && (
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2">
                          Min:
                          <input
                            type="number"
                            className="border border-gray-300 p-1 w-20 rounded focus:ring-1 focus:ring-blue-400"
                            value={q.validation?.min || ""}
                            onChange={(e) =>
                              updateQuestion(section.id, q.id, "validation", {
                                ...q.validation,
                                min: Number(e.target.value),
                              })
                            }
                          />
                        </label>
                        <label className="flex items-center gap-2">
                          Max:
                          <input
                            type="number"
                            className="border border-gray-300 p-1 w-20 rounded focus:ring-1 focus:ring-blue-400"
                            value={q.validation?.max || ""}
                            onChange={(e) =>
                              updateQuestion(section.id, q.id, "validation", {
                                ...q.validation,
                                max: Number(e.target.value),
                              })
                            }
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            ))}
          </div>
        ))}

        {/* Save */}
        <button
          disabled={saving}
          onClick={saveAssessmentData}
          className={`mt-8 w-full py-3 rounded-lg font-medium text-white ${
            saving
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          } transition`}
        >
          {saving ? "Saving..." : " Save Assessment"}
        </button>
      </div>
    </div>
  );
}
