import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClasses = (path) =>
    `px-3 py-2 text-sm font-medium transition-all duration-200 ${
      location.pathname.startsWith(path)
        ? "text-indigo-700 border-b-2 border-indigo-600"
        : "text-gray-700 hover:text-indigo-700 hover:border-b-2 hover:border-indigo-400"
    }`;

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          onClick={() => handleNav("/")}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-indigo-600">TALENTFLOW</span>
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNav("/dashboard")}
            className={linkClasses("/dashboard")}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNav("/jobs")}
            className={linkClasses("/jobs")}
          >
            Jobs
          </button>
          <button
            onClick={() => handleNav("/candidates")}
            className={linkClasses("/candidates")}
          >
            Candidates
          </button>
          <button
            onClick={() => handleNav("/assessments")}
            className={linkClasses("/assessments")}
          >
            Assessments
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-indigo-600 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm animate-fadeIn">
          <div className="flex flex-col px-6 py-3 space-y-2">
            <button
              onClick={() => handleNav("/dashboard")}
              className={`text-left ${linkClasses("/dashboard")}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNav("/jobs")}
              className={`text-left ${linkClasses("/jobs")}`}
            >
              Jobs
            </button>
            <button
              onClick={() => handleNav("/candidates")}
              className={`text-left ${linkClasses("/candidates")}`}
            >
              Candidates
            </button>
            <button
              onClick={() => handleNav("/assessments")}
              className={`text-left ${linkClasses("/assessments")}`}
            >
              Assessments
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
