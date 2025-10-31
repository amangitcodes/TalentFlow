import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAssessmentByJobId,
  saveResponse,
} from "../../indexedDB/assessmentDB";

export default function AssessmentRuntime() {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const data = await getAssessmentByJobId(jobId);
      setAssessment(data);
    })();
  }, [jobId]);

  // Validate before submit
  const validate = () => {
    const errs = {};
    assessment.sections.forEach((s) =>
      s.questions.forEach((q) => {
        const val = answers[q.id];

        if (q.required && !val) {
          errs[q.id] = "Required field.";
        }
        if (q.type === "numeric") {
          const num = Number(val);
          if (q.validation?.min && num < q.validation.min)
            errs[q.id] = `Value must be ≥ ${q.validation.min}`;
          if (q.validation?.max && num > q.validation.max)
            errs[q.id] = `Value must be ≤ ${q.validation.max}`;
        }
        if (
          (q.type === "short-text" || q.type === "long-text") &&
          q.validation?.maxLength &&
          val?.length > q.validation.maxLength
        ) {
          errs[q.id] = `Max length is ${q.validation.maxLength} chars.`;
        }
      })
    );
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return alert("❌ Please fix validation errors!");
    await saveResponse({ jobId, answers });
    alert("✅ Submitted successfully!");
  };

  if (!assessment) return <p>Loading assessment...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">{assessment.title}</h1>
      {assessment.sections.map((section) => (
        <div key={section.id} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
          {section.questions.map((q) => (
            <div key={q.id} className="mb-4">
              <label className="block font-medium mb-1">
                {q.text} {q.required && <span className="text-red-500">*</span>}
              </label>

              {/* Inputs */}
              {q.type === "short-text" && (
                <input
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              )}
              {q.type === "long-text" && (
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              )}
              {q.type === "numeric" && (
                <input
                  type="number"
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              )}

              {errors[q.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[q.id]}</p>
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
