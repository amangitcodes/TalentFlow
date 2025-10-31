import React, { useEffect, useState } from "react";
import CandidateCard from "./CandidateCard";
import { fetchCandidates } from "../../indexedDB/candidatesDB";
import { Plus, LayoutGrid, Columns, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(50);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const { data, total } = await fetchCandidates({
          search: searchTerm,
          stage: stageFilter,
          page,
          limit,
        });
        setCandidates(data);
        setTotal(total);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [searchTerm, stageFilter, page, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-6 py-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Candidates
          </h1>
          
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => navigate("/candidates")}
            className="p-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
            title="List View"
          >
            <LayoutGrid size={18} className="text-gray-700" />
          </button>
          <button
            onClick={() => navigate("/candidates/kanban")}
            className="p-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
            title="Kanban View"
          >
            <Columns size={18} className="text-gray-700" />
          </button>
          
        </div>
      </header>

      {/* Filters & Search */}
      <section className="flex flex-col sm:flex-row justify-between gap-4 px-6 max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Stages</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="technical">Technical</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
      </section>

      {/* Candidate Grid */}
      <main className="px-6 pb-16 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading candidates...
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center bg-white border border-gray-200 rounded-xl py-20 shadow-sm">
            <p className="text-gray-600 font-medium">
              No candidates found. Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 items-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  ← Prev
                </button>
                <span className="text-gray-600 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
