import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getCandidateById,
  getCandidateTimeline,
  getNotesForCandidate,
  addNote,
  updateCandidate,
} from "../../indexedDB/candidatesDB";
import { MessageSquarePlus, Mail, Briefcase } from "lucide-react";

const STAGE_LABELS = {
  applied: "Applied",
  screening: "Screening",
  technical: "Technical",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

const STAGES = [
  { id: "applied", label: "Applied" },
  { id: "screening", label: "Screening" },
  { id: "technical", label: "Technical" },
  { id: "offer", label: "Offer" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

export default function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);
  const [stageUpdating, setStageUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const candidateData = await getCandidateById(id);
        const timelineData = await getCandidateTimeline(id);
        const notesData = await getNotesForCandidate(id);
        setCandidate(candidateData);
        setTimeline([...timelineData].reverse());
        setNotes(notesData);
      } catch (err) {
        console.error("Error loading candidate profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      setNoteLoading(true);
      await addNote(Number(id), newNote);
      const updatedNotes = await getNotesForCandidate(id);
      setNotes(updatedNotes);
      setNewNote("");
    } catch (err) {
      console.error("Error adding note:", err);
    } finally {
      setNoteLoading(false);
    }
  };

  const handleStageChange = async (newStage) => {
    if (newStage === candidate.stage) return;
    try {
      setStageUpdating(true);
      await updateCandidate(Number(id), { stage: newStage });
      const updatedCandidate = await getCandidateById(id);
      const updatedTimeline = await getCandidateTimeline(id);
      setCandidate(updatedCandidate);
      setTimeline([...updatedTimeline].reverse());
    } catch (err) {
      console.error("Error updating stage:", err);
    } finally {
      setStageUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60 text-gray-600 text-lg">
        Loading candidate profile...
      </div>
    );

  if (!candidate)
    return (
      <div className="p-6 text-center text-red-500 text-lg">
        Candidate not found.
      </div>
    );

  const stageLabel = STAGE_LABELS[candidate.stage] || "Applied";
  const initials = candidate.name
    ? candidate.name
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
    : "NA";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100 p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative max-w-4xl mx-auto">
        <Link
          to="/candidates"
          className="inline-block mb-6 text-blue-600 font-medium hover:underline"
        >
          ← Back to Candidates
        </Link>

        {/* Candidate Header */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-900 leading-tight mb-2">
              {candidate.name}
            </h2>
            <p className="text-gray-700 flex items-center gap-2">
              <Mail size={16} className="text-blue-500" />
              <a
                href={`mailto:${candidate.email}`}
                className="text-blue-600 hover:underline"
              >
                {candidate.email}
              </a>
            </p>
            {candidate.jobTitle && (
              <p className="text-gray-700 mt-1 flex items-center gap-2">
                <Briefcase size={16} className="text-indigo-500" />
                {candidate.jobTitle}
              </p>
            )}

            {/* Stage Info + Dropdown */}
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <p>
                <strong className="text-gray-800">Stage:</strong>{" "}
                <span
                  className={`font-semibold ${
                    stageLabel === "Hired"
                      ? "text-green-600"
                      : stageLabel === "Rejected"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {stageLabel}
                </span>
              </p>

              <select
                value={candidate.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                disabled={stageUpdating}
                className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm hover:shadow transition-all"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>

              {stageUpdating && (
                <span className="text-sm text-indigo-600 animate-pulse">
                  Updating...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🕓 Status Timeline
          </h3>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100 p-6 shadow-sm">
            {timeline.length === 0 ? (
              <p className="text-gray-500 italic">
                No timeline data available.
              </p>
            ) : (
              <ul className="space-y-4">
                {timeline.map((item) => (
                  <li
                    key={item.id}
                    className="relative pl-6 border-l-2 border-blue-400"
                  >
                    <div className="absolute -left-[6px] top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="font-medium text-gray-800">
                      {STAGE_LABELS[item.stage] || item.stage}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            📝 Notes & Mentions
          </h3>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100 p-6 shadow-sm">
            {notes.length === 0 ? (
              <p className="text-gray-500 italic mb-4">
                No notes yet — start the conversation!
              </p>
            ) : (
              <div className="space-y-4 mb-6">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border border-gray-100 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all"
                  >
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(note.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a note... use @name to mention someone"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows={3}
              ></textarea>
              <button
                onClick={handleAddNote}
                disabled={noteLoading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
              >
                <MessageSquarePlus size={18} />
                {noteLoading ? "Adding..." : "Add Note"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
