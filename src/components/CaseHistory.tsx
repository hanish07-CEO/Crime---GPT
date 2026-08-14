import React, { useState, useMemo } from "react";
import { CaseLog, CaseStatus } from "../types";
import { 
  FileText, 
  Trash2, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  ShieldAlert, 
  Check, 
  X, 
  Search, 
  Clock, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  UserCheck, 
  RotateCcw,
  Sparkles,
  Filter
} from "lucide-react";

interface CaseHistoryProps {
  cases: CaseLog[];
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onToggleStatus?: (id: string, status: CaseStatus) => void;
}

type FilterTab = "all" | "pending" | "completed_this_month" | "cyber_crime";

export default function CaseHistory({ 
  cases, 
  activeId, 
  onSelect, 
  onDelete,
  onToggleStatus 
}: CaseHistoryProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  // Current Month Name e.g. "August 2026"
  const currentMonthYear = useMemo(() => {
    return new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }, []);

  // Compute monthly stats
  const stats = useMemo(() => {
    const total = cases.length;
    
    const pending = cases.filter(c => (c.status || "pending") === "pending").length;

    // Cases completed in current month or marked as completed
    const completedThisMonth = cases.filter(c => {
      if (c.status !== "completed") return false;
      if (!c.completedAt) return true; // Default to completed if marked as completed
      try {
        const completedDate = new Date(c.completedAt);
        const now = new Date();
        return (
          completedDate.getMonth() === now.getMonth() &&
          completedDate.getFullYear() === now.getFullYear()
        );
      } catch (e) {
        return true;
      }
    }).length;

    const cyberCrime = cases.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const inc = (c.incidentType || "").toLowerCase();
      const title = (c.title || "").toLowerCase();
      return cat.includes("cyber") || inc.includes("cyber") || inc.includes("ransomware") || title.includes("cyber") || title.includes("ransomware") || title.includes("phishing") || title.includes("deepfake");
    }).length;

    return { total, pending, completedThisMonth, cyberCrime };
  }, [cases]);

  // Filtered cases based on search and tab
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // 1. Tab filter
      if (filterTab === "pending" && (c.status || "pending") !== "pending") {
        return false;
      }
      if (filterTab === "completed_this_month" && c.status !== "completed") {
        return false;
      }
      if (filterTab === "cyber_crime") {
        const cat = (c.category || "").toLowerCase();
        const inc = (c.incidentType || "").toLowerCase();
        const title = (c.title || "").toLowerCase();
        const isCyber = cat.includes("cyber") || inc.includes("cyber") || inc.includes("ransomware") || title.includes("cyber") || title.includes("ransomware") || title.includes("phishing") || title.includes("deepfake");
        if (!isCyber) return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (c.title || "").toLowerCase();
        const type = (c.incidentType || "").toLowerCase();
        const loc = (c.location || "").toLowerCase();
        const officer = (c.assignedOfficer || "").toLowerCase();
        const badge = (c.badgeNumber || "").toLowerCase();
        const notes = (c.rawNotes || "").toLowerCase();
        return (
          title.includes(q) ||
          type.includes(q) ||
          loc.includes(q) ||
          officer.includes(q) ||
          badge.includes(q) ||
          notes.includes(q)
        );
      }

      return true;
    });
  }, [cases, filterTab, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-900 select-none">
      
      {/* Header with Monthly Tracking Banner */}
      <div className="p-3.5 border-b border-slate-900 bg-slate-950">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <h2 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-200">
              Case Intel Vault
            </h2>
          </div>
          <span className="text-[9.5px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            {currentMonthYear}
          </span>
        </div>

        {/* 4 Quick Stat Counters */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
          <div 
            onClick={() => setFilterTab("pending")}
            className={`p-1.5 rounded border transition-all cursor-pointer flex items-center justify-between ${
              filterTab === "pending"
                ? "bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/50"
                : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-400" />
              <span>Pending</span>
            </span>
            <span className="font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
              {stats.pending}
            </span>
          </div>

          <div 
            onClick={() => setFilterTab("completed_this_month")}
            className={`p-1.5 rounded border transition-all cursor-pointer flex items-center justify-between ${
              filterTab === "completed_this_month"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50"
                : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Solved Sector</span>
            </span>
            <span className="font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
              {stats.completedThisMonth}
            </span>
          </div>

          <div 
            onClick={() => setFilterTab("cyber_crime")}
            className={`p-1.5 rounded border transition-all cursor-pointer flex items-center justify-between col-span-2 ${
              filterTab === "cyber_crime"
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50"
                : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3 text-cyan-400" />
              <span>Cyber Crime Involving Dossiers</span>
            </span>
            <span className="font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800">
              {stats.cyberCrime} active / solved
            </span>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative mt-2.5">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases, cyber logs, officers..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-0.5 scroller-none text-[10px] font-mono">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              filterTab === "all"
                ? "bg-slate-800 text-white font-bold border border-slate-700"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            All ({cases.length})
          </button>
          <button
            onClick={() => setFilterTab("pending")}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              filterTab === "pending"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-amber-400 hover:bg-slate-900"
            }`}
          >
            <span>⏳ Pending</span>
            <span>({stats.pending})</span>
          </button>
          <button
            onClick={() => setFilterTab("completed_this_month")}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              filterTab === "completed_this_month"
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "text-emerald-400 hover:bg-slate-900"
            }`}
          >
            <span>✅ Solved Sector</span>
            <span>({stats.completedThisMonth})</span>
          </button>
          <button
            onClick={() => setFilterTab("cyber_crime")}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              filterTab === "cyber_crime"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-cyan-400 hover:bg-slate-900"
            }`}
          >
            <span>💻 Cyber</span>
            <span>({stats.cyberCrime})</span>
          </button>
        </div>
      </div>

      {/* Case List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-900/80">
        {filteredCases.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <FileText className="h-8 w-8 mx-auto stroke-[1] mb-2 text-slate-700" />
            <p className="text-xs font-sans">No matching case records found.</p>
            <p className="text-[10px] font-mono mt-1 text-slate-600">
              {searchQuery ? "Try refining your search keyword." : "Change filter to view records."}
            </p>
          </div>
        ) : (
          filteredCases.map((c) => {
            const isActive = c.id === activeId;
            const isConfirming = confirmingId === c.id;
            const isCompleted = c.status === "completed";
            const isCyber = 
              (c.category || "").toLowerCase().includes("cyber") || 
              (c.incidentType || "").toLowerCase().includes("cyber") ||
              (c.title || "").toLowerCase().includes("ransomware") ||
              (c.title || "").toLowerCase().includes("phishing") ||
              (c.title || "").toLowerCase().includes("deepfake");

            return (
              <div
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`p-3 text-left transition-all cursor-pointer group flex relative ${
                  isActive
                    ? "bg-slate-900 border-l-2 border-amber-500 shadow-inner"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  
                  {/* Top Badges: Category & Status */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Category Pill */}
                      {isCyber ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800 flex items-center gap-1">
                          <Terminal className="h-2.5 w-2.5" />
                          CYBER CRIME
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800">
                          {c.category || "STATUTORY"}
                        </span>
                      )}

                      {/* Status Badge with Quick Toggle */}
                      {isCompleted ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleStatus) onToggleStatus(c.id, "pending");
                          }}
                          title="Click to reopen case as Pending"
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/60 hover:bg-emerald-900 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                          <span>COMPLETED</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleStatus) onToggleStatus(c.id, "completed");
                          }}
                          title="Click to mark as Completed this month"
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-700/60 hover:bg-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Clock className="h-2.5 w-2.5 text-amber-400" />
                          <span>PENDING</span>
                        </button>
                      )}
                    </div>

                    {/* Inline Delete Control */}
                    <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {isConfirming ? (
                        <div className="flex items-center gap-1 bg-red-950/90 border border-red-500/50 p-1 rounded animate-fadeIn">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDelete(c.id, e);
                              setConfirmingId(null);
                            }}
                            className="px-2 py-0.5 text-[9px] font-mono font-bold bg-red-600 hover:bg-red-500 text-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                            title="Confirm purge"
                          >
                            <Check className="h-3 w-3" /> Purge
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmingId(null);
                            }}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfirmingId(c.id);
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition-colors opacity-60 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                          title="Purge case file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-xs font-semibold leading-tight line-clamp-2 ${
                    isActive ? "text-amber-300" : isCompleted ? "text-slate-300" : "text-slate-200 group-hover:text-white"
                  }`}>
                    {c.title || "Untitled Investigation"}
                  </h3>

                  {/* Offense / Incident Type */}
                  <p className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                    {c.incidentType || "Pending Offense Classification"}
                  </p>

                  {/* Meta: Location, Officer & Date */}
                  <div className="mt-2 flex flex-col gap-1 text-[9.5px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="h-3 w-3 text-slate-600 shrink-0" />
                      <span>{c.date || "Date unspecified"}</span>
                    </div>

                    {c.assignedOfficer && (
                      <div className="flex items-center gap-1.5 truncate text-slate-400">
                        <UserCheck className="h-3 w-3 text-amber-500/70 shrink-0" />
                        <span>{c.assignedOfficer}</span>
                      </div>
                    )}

                    {isCompleted && c.completedAt && (
                      <div className="flex items-center gap-1 text-emerald-400/90 text-[9px]">
                        <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                        <span>Resolved: {new Date(c.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center pl-1.5">
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    isActive ? "text-amber-500 translate-x-0.5" : "text-slate-700 group-hover:text-slate-400"
                  }`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-900 bg-slate-950/90 text-[9.5px] text-slate-500 font-mono flex items-center justify-between">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>CYBER INTEL VAULT</span>
        </span>
        <span className="text-amber-400/80 font-bold">
          {stats.completedThisMonth} RESOLVED THIS MO.
        </span>
      </div>
    </div>
  );
}

