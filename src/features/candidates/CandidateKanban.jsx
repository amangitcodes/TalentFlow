import React, { useEffect, useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getAllCandidates, updateCandidate } from "../../indexedDB/candidatesDB";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Columns } from "lucide-react";

const stages = [
  { id: "applied", label: "Applied", color: "border-blue-200 bg-blue-50" },
  { id: "screening", label: "Screening", color: "border-yellow-200 bg-yellow-50" },
  { id: "technical", label: "Technical", color: "border-purple-200 bg-purple-50" },
  { id: "offer", label: "Offer", color: "border-green-200 bg-green-50" },
  { id: "hired", label: "Hired", color: "border-emerald-200 bg-emerald-50" },
  { id: "rejected", label: "Rejected", color: "border-red-200 bg-red-50" },
];

export default function CandidateKanban() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [dragLoading, setDragLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    const data = await getAllCandidates();
    setCandidates(data);
  };

  const filtered = useMemo(() => {
    let result = candidates;
    if (filterStage !== "all") result = result.filter((c) => c.stage === filterStage);
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s)
      );
    }
    return result;
  }, [candidates, filterStage, search]);

  const stageCandidates = (stage) => filtered.filter((c) => c.stage === stage);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const candidateId = Number(draggableId);
    const newStage = destination.droppableId;

    setDragLoading(true);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );

    try {
      await updateCandidate(candidateId, { stage: newStage });
      await loadCandidates();
    } catch (err) {
      console.error("Error updating stage:", err);
    } finally {
      setDragLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 max-w-7xl mx-auto">
        <div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
             Candidate Kanban Board
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Track and manage candidates across stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/candidates")}
            className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition shadow-sm"
            title="List View"
          >
            <LayoutGrid size={18} className="text-gray-700" />
          </button>
          <button
            onClick={() => navigate("/candidates/kanban")}
            className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-indigo-100 transition shadow-sm"
            title="Kanban View"
          >
            <Columns size={18} className="text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 max-w-7xl mx-auto">
        <input
          type="text"
          placeholder="🔍 Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 w-72 bg-white/70 backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 bg-white/70 backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Stages</option>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {stages.map((stage) => {
            const items = stageCandidates(stage.id);
            return (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-2xl border-2 ${stage.color} p-4 min-h-[500px] flex flex-col transition-all duration-200 ${
                      snapshot.isDraggingOver ? "scale-[1.01] shadow-inner" : ""
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex justify-between items-center mb-3 sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200 rounded-t-xl px-1 py-2">
                      <h4 className="font-semibold text-sm text-gray-800 tracking-wide">
                        {stage.label}
                      </h4>
                      <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5">
                        {items.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                      {items.map((candidate, index) => (
                        <Draggable
                          key={candidate.id}
                          draggableId={candidate.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm hover:shadow-md p-4 cursor-grab transition-all duration-200 ${
                                snapshot.isDragging
                                  ? "rotate-[0.5deg] scale-[1.02] shadow-lg"
                                  : ""
                              }`}
                            >
                              <div className="mb-2">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {candidate.name}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">
                                  {candidate.email}
                                </p>
                              </div>

                              <div className="text-xs text-gray-600 mb-3">
                                <p className="font-medium text-gray-700">
                                  {candidate.jobTitle || "Unassigned Role"}
                                </p>
                                <p className="text-gray-500">
                                  Applied:{" "}
                                  {new Date(candidate.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => navigate(`/candidates/${candidate.id}`)}
                                  className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-all"
                                >
                                   View
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Loading Overlay */}
      {dragLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center text-indigo-700 font-medium">
          Updating stage...
        </div>
      )}
    </div>
  );
}
