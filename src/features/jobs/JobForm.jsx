import React, { useState, useEffect } from "react";
import { Save, XCircle, Briefcase } from "lucide-react";

export default function JobForm({ initialData = null, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "Full-time",
    requirements: "",
    status: "Open",
    tags: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        location: initialData.location || "",
        jobType: initialData.jobType || "Full-time",
        requirements: initialData.requirements || "",
        status: initialData.status || "Open",
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : initialData.tags || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Please enter a job title!");
    if (!form.location.trim()) return alert("Please enter a location!");

    onSave({
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6 sm:p-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-blue-100"
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 text-blue-700">
            <Briefcase size={24} />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {initialData ? "Edit Job Details" : "Create a New Job"}
            </h2>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid gap-5">
          <Field
            label="Job Title"
            required
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer"
          />
          <TextArea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief job description..."
          />
          <Field
            label="Location"
            required
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g., Bangalore, Remote"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField
              label="Job Type"
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              options={[
                "Full-time",
                "Part-time",
                "Internship",
                "Contract",
                "Remote",
              ]}
            />
            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={["Open", "Closed"]}
            />
          </div>

          <TextArea
            label="Requirements"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="List key skills or qualifications..."
          />

          <Field
            label="Tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g., React, Frontend, Remote"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-all font-medium shadow-sm"
          >
            <XCircle size={18} /> Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-blue-200"
          >
            <Save size={18} /> Save
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------ Small UI Components ------------------ */

function Field({ label, required, name, value, onChange, placeholder }) {
  return (
    <div className="group">
      <label className="block text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="3"
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none transition-all duration-200"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
