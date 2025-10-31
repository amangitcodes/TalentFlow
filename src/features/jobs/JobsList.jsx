import React, { useEffect, useState } from "react";
import JobForm from "./JobForm";
import { getAllJobs, addJob, updateJob } from "../../indexedDB/jobDB.js";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Edit2, Archive, RefreshCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 8;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const storedJobs = await getAllJobs();
      const sorted = storedJobs.sort((a, b) => a.order - b.order);
      setJobs(sorted);
    })();
  }, []);

  const handleSaveJob = async (data) => {
    if (selectedJob) await updateJob(selectedJob.id, data);
    else await addJob({ ...data, order: jobs.length });
    setShowForm(false);
    const refreshed = await getAllJobs();
    setJobs(refreshed.sort((a, b) => a.order - b.order));
    toast.success("Job saved successfully!");
  };

  const handleStatusToggle = async (job) => {
    const newStatus = job.status === "Open" ? "Closed" : "Open";
    await updateJob(job.id, { status: newStatus });
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
    );
    toast.success(`Job ${newStatus === "Open" ? "reopened" : "closed"}`);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(jobs);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setJobs(reordered);
    try {
      await Promise.all(
        reordered.map((job, i) => updateJob(job.id, { order: i }))
      );
    } catch {
      toast.error("Failed to reorder jobs");
    }
  };

  const filtered = jobs.filter((job) => {
    const matchesSearch = job.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      job.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100 px-6 sm:px-10 py-12 relative overflow-hidden">
      {/* Decorative blur accents */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Jobs Dashboard
          </h1>
          <button
            onClick={() => {
              setSelectedJob(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-transform hover:scale-[1.03]"
          >
            <Plus size={18} /> Add Job
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by title..."
            className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-1/4 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Job Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[500px] max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {selectedJob ? "Edit Job" : "Create Job"}
              </h3>
              <JobForm
                initialData={selectedJob}
                onSave={handleSaveJob}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Job List */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="jobs">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-5"
              >
                {paginated.length === 0 && (
                  <li className="text-center text-gray-700 bg-white p-12 rounded-2xl shadow">
                    No jobs found. Try adjusting filters or add a new job.
                  </li>
                )}

                {paginated.map((job, i) => (
                  <Draggable
                    key={job.id}
                    draggableId={String(job.id)}
                    index={i}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                job.status === "Open"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {job.location && `📍 ${job.location}`}{" "}
                            {job.jobType && ` • ${job.jobType}`}
                          </p>
                          {job.tags && job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {job.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          <button
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="flex items-center gap-1.5 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-2 rounded-lg transition-all"
                          >
                            <Eye size={15} /> View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setShowForm(true);
                            }}
                            className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-lg transition-all"
                          >
                            <Edit2 size={15} /> Edit
                          </button>
                          <button
                            onClick={() => handleStatusToggle(job)}
                            className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border transition-all ${
                              job.status === "Open"
                                ? "text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
                                : "text-green-600 bg-green-50 hover:bg-green-100 border-green-200"
                            }`}
                          >
                            {job.status === "Open" ? (
                              <>
                                <Archive size={15} /> Close
                              </>
                            ) : (
                              <>
                                <RefreshCcw size={15} /> Reopen
                              </>
                            )}
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-10 text-sm text-gray-700">
          <p>
            Showing{" "}
            <span className="font-medium">
              {(page - 1) * limit + 1}–{Math.min(page * limit, filtered.length)}
            </span>{" "}
            of {filtered.length} jobs
          </p>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
