import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllJobs } from "../../indexedDB/jobDB";
import { ArrowLeft, MapPin, Briefcase, Calendar } from "lucide-react";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      const jobs = await getAllJobs();
      const found = jobs.find((j) => j.id === Number(jobId));
      if (!found) {
        setNotFound(true);
        return;
      }
      setJob(found);
    };
    loadJob();
  }, [jobId]);

  if (notFound) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-medium">
        ❌ Job not found
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading job details...
        </div>
      </div>
    );
  }

  const tagsArray = Array.isArray(job.tags)
    ? job.tags
    : job.tags
    ? job.tags.split(",").map((t) => t.trim())
    : [];

  const statusColor =
    job.status === "Open" || job.status === "Active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-10">
      {/* Background aesthetic blobs */}
      <div className="absolute top-[-5rem] left-[-5rem] w-[300px] h-[300px] bg-indigo-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5rem] right-[-5rem] w-[250px] h-[250px] bg-blue-300/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
        {/* Header Bar */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white/80">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-700 transition-all text-sm font-medium"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <span
            className={`px-4 py-1.5 text-sm font-semibold rounded-full border ${statusColor}`}
          >
            {job.status}
          </span>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          {/* Title */}
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-snug">
            {job.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-gray-700 text-sm">
            {job.location && (
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                <MapPin size={16} className="text-indigo-600" /> {job.location}
              </div>
            )}
            {job.jobType && (
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                <Briefcase size={16} className="text-indigo-600" /> {job.jobType}
              </div>
            )}
            {job.createdAt && (
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                <Calendar size={16} className="text-indigo-600" />{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Description Section */}
          {job.description && (
            <section className="bg-white/70 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <h2 className="text-lg font-semibold text-indigo-700 mb-3">
                Description
              </h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </section>
          )}

          {/* Requirements Section */}
          {job.requirements && (
            <section className="bg-white/70 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <h2 className="text-lg font-semibold text-indigo-700 mb-3">
                Requirements
              </h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </section>
          )}

          {/* Tags */}
          {tagsArray.length > 0 && (
            <section className="bg-white/70 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <h2 className="text-lg font-semibold text-indigo-700 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tagsArray.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
