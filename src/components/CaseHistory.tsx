import React, { useState, useMemo, useRef, useEffect } from "react";
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
  Filter,
  ArrowUp,
  ArrowDown,
  Layers,
  SlidersHorizontal,
  Crosshair
} from "lucide-react";

interface CaseHistoryProps {
  cases: CaseLog[];
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onToggleStatus?: (id: string, status: CaseStatus) => void;
}

type FilterTab = "pending" | "cyber" | "solved";

export default function CaseHistory({ 
  cases, 
  activeId, 
  onSelect, 
  onDelete,
  onToggleStatus 
}: CaseHistoryProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("pending");
  const [isCompact, setIsCompact] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeCaseRef = useRef<HTMLDivElement>(null);

  // Track scroll position to show quick scroll-to-top button
  useEffect(() => {
    const onWindowScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  };

  // Step scroll helpers
  const scrollStepUp = () => {
    window.scrollBy({ top: -240, behavior: "smooth" });
  };

  const scrollStepDown = () => {
    window.scrollBy({ top: 240, behavior: "smooth" });
  };

  const scrollToActiveCase = () => {
    if (activeCaseRef.current) {
      activeCaseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Current Month Name e.g. "August 2026"
  const currentMonthYear = useMemo(() => {
    return new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }, []);

  // Helper to identify cyber cases
  const isCaseCyber = (c: CaseLog) => {
    const cat = (c.category || "").toLowerCase();
    const inc = (c.incidentType || "").toLowerCase();
    const title = (c.title || "").toLowerCase();
    const notes = (c.rawNotes || "").toLowerCase();
    return (
      cat.includes("cyber") ||
      inc.includes("cyber") ||
      inc.includes("ransomware") ||
      inc.includes("crypto") ||
      inc.includes("trojan") ||
      inc.includes("phishing") ||
      inc.includes("bot") ||
      inc.includes("deepfake") ||
      title.includes("cyber") ||
      title.includes("crypto") ||
      title.includes("ransomware") ||
      title.includes("trojan") ||
      title.includes("tatkal") ||
      title.includes("sim swap") ||
      title.includes("deepfake") ||
      notes.includes("cyber") ||
      notes.includes("it act") ||
      notes.includes("ransomware")
    );
  };

  // Compute segregated sector stats
  const stats = useMemo(() => {
    const pending = cases.filter(c => (c.status || "pending") === "pending").length;
    const solved = cases.filter(c => c.status === "completed").length;
    const cyber = cases.filter(c => isCaseCyber(c)).length;

    return { pending, solved, cyber };
  }, [cases]);

  // Filtered cases strictly by segregated sector and search
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // 1. Strict 3-Way Sector Segregation (no "all" section)
      if (filterTab === "pending" && (c.status || "pending") !== "pending") {
        return false;
      }
      if (filterTab === "solved" && c.status !== "completed") {
        return false;
      }
      if (filterTab === "cyber" && !isCaseCyber(c)) {
        return false;
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
    <div className="flex flex-col bg-slate-950 border-r border-slate-900 select-none relative">
      
      {/* Sticky Header with Streamlined Sector Controls */}
      <div className="p-3 border-b border-slate-900 bg-slate-950/95 backdrop-blur-sm z-10 shrink-0 space-y-2 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <h2 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-200">
              Case Intel Vault
            </h2>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {currentMonthYear}
            </span>
          </div>
        </div>

        {/* 3 Dedicated Sector Switcher Tabs with Integrated Counts */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-[10.5px] font-mono font-bold">
          <button
            type="button"
            onClick={() => setFilterTab("pending")}
            className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              filterTab === "pending"
                ? "bg-amber-500 text-slate-950 shadow-sm font-extrabold"
                : "text-slate-400 hover:text-amber-400 hover:bg-slate-800/80"
            }`}
          >
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">Pending</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
              filterTab === "pending" ? "bg-slate-950/40 text-amber-950 font-black" : "bg-slate-800 text-slate-400"
            }`}>
              {stats.pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("cyber")}
            className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              filterTab === "cyber"
                ? "bg-cyan-500 text-slate-950 shadow-sm font-extrabold"
                : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80"
            }`}
          >
            <Terminal className="h-3 w-3 shrink-0" />
            <span className="truncate">Cyber</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
              filterTab === "cyber" ? "bg-slate-950/40 text-cyan-950 font-black" : "bg-slate-800 text-slate-400"
            }`}>
              {stats.cyber}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("solved")}
            className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              filterTab === "solved"
                ? "bg-emerald-500 text-slate-950 shadow-sm font-extrabold"
                : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80"
            }`}
          >
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            <span className="truncate">Solved</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
              filterTab === "solved" ? "bg-slate-950/40 text-emerald-950 font-black" : "bg-slate-800 text-slate-400"
            }`}>
              {stats.solved}
            </span>
          </button>
        </div>

        {/* Live Search & Quick Scroll / Active Controls */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${filterTab} records...`}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-7.5 pr-7 py-1 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1.5 text-slate-500 hover:text-slate-300 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Quick Scroll Steppers & Locate Active File */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={scrollStepUp}
              title="Scroll Up (Step)"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={scrollStepDown}
              title="Scroll Down (Step)"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={scrollToActiveCase}
              title="Scroll to currently selected active case"
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 flex items-center gap-1 text-[10px] font-mono cursor-pointer transition-colors"
            >
              <Crosshair className="h-3 w-3 text-amber-500" />
              <span>Active</span>
            </button>
          </div>
        </div>
      </div>

      {/* Case List in Unified Flow */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 divide-y divide-slate-900/80 pr-0.5 relative"
      >
        {filteredCases.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <FileText className="h-7 w-7 mx-auto stroke-[1] mb-2 text-slate-700" />
            <p className="text-xs font-sans font-medium text-slate-400">
              No {filterTab} cases found.
            </p>
            <p className="text-[10px] font-mono mt-1 text-slate-600">
              {searchQuery ? "Try refining your search keyword." : "Select another sector above to browse files."}
            </p>
          </div>
        ) : (
          filteredCases.map((c) => {
            const isActive = c.id === activeId;
            const isConfirming = confirmingId === c.id;
            const isCompleted = c.status === "completed";
            const isCyber = isCaseCyber(c);

            return (
              <div
                key={c.id}
                ref={isActive ? activeCaseRef : null}
                onClick={() => onSelect(c.id)}
                className={`text-left transition-all cursor-pointer group flex relative p-3 px-3.5 ${
                  isActive
                    ? "bg-slate-900 border-l-4 border-amber-500 shadow-inner"
                    : "hover:bg-slate-900/60 border-l-4 border-transparent"
                }`}
              >
                <div className="flex-1 min-w-0 pr-1">
                  
                  {/* Top Badges: Category & Status */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Category Pill */}
                      {isCyber ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800 flex items-center gap-1">
                          <Terminal className="h-2.5 w-2.5" />
                          CYBER
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800">
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
                          className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/60 hover:bg-emerald-900 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                          <span>SOLVED</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleStatus) onToggleStatus(c.id, "completed");
                          }}
                          title="Click to mark as Solved"
                          className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-700/60 hover:bg-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Clock className="h-2.5 w-2.5 text-amber-400" />
                          <span>PENDING</span>
                        </button>
                      )}
                    </div>

                    {/* Inline Delete Control */}
                    <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {isConfirming ? (
                        <div className="flex items-center gap-1 bg-red-950/90 border border-red-500/50 p-0.5 rounded animate-fadeIn">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDelete(c.id, e);
                              setConfirmingId(null);
                            }}
                            className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-red-600 hover:bg-red-500 text-white rounded transition-colors flex items-center gap-0.5 cursor-pointer"
                            title="Confirm purge"
                          >
                            <Check className="h-2.5 w-2.5" /> Purge
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmingId(null);
                            }}
                            className="p-0.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X className="h-2.5 w-2.5" />
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
                          className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition-colors opacity-40 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                          title="Purge case file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-xs sm:text-[13px] font-semibold leading-snug line-clamp-2 ${
                    isActive ? "text-amber-300 font-bold" : isCompleted ? "text-slate-300" : "text-slate-100 group-hover:text-amber-300"
                  }`}>
                    {c.title || "Untitled Investigation"}
                  </h3>

                  {/* Offense / Incident Type */}
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    {c.incidentType || "Pending Offense Classification"}
                  </p>

                  {/* Meta: Location, Officer & Date */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9.5px] text-slate-500 font-mono mt-2 pt-1 border-t border-slate-900/60">
                    <div className="flex items-center gap-1 truncate">
                      <Calendar className="h-3 w-3 text-slate-600 shrink-0" />
                      <span>{c.date ? c.date.split(" at ")[0] : "No date"}</span>
                    </div>

                    {c.assignedOfficer && (
                      <div className="flex items-center gap-1 truncate text-slate-400">
                        <UserCheck className="h-3 w-3 text-amber-500/70 shrink-0" />
                        <span className="truncate max-w-[130px]">{c.assignedOfficer}</span>
                      </div>
                    )}

                    {isCompleted && c.completedAt && (
                      <div className="flex items-center gap-1 text-emerald-400/90 text-[9px]">
                        <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                        <span>Solved: {new Date(c.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center pl-1">
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    isActive ? "text-amber-500 translate-x-0.5" : "text-slate-700 group-hover:text-slate-400"
                  }`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Quick Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="absolute bottom-10 right-3 p-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg border border-amber-300 transition-all z-20 cursor-pointer animate-fadeIn"
          title="Scroll back to top"
        >
          <ArrowUp className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      )}

      {/* Compact Sticky Footer with Sector Status */}
      <div className="p-2 border-t border-slate-900 bg-slate-950 text-[9px] text-slate-500 font-mono flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${
            filterTab === "pending" ? "bg-amber-400 animate-pulse" : filterTab === "cyber" ? "bg-cyan-400 animate-pulse" : "bg-emerald-400 animate-pulse"
          }`} />
          <span className="truncate font-semibold uppercase text-slate-400">
            {filterTab} SECTOR ({filteredCases.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={scrollToTop}
            title="Scroll to top"
            className="hover:text-amber-400 p-0.5 transition-colors cursor-pointer"
          >
            <ArrowUp className="h-2.5 w-2.5" />
          </button>
          <button
            type="button"
            onClick={scrollToBottom}
            title="Scroll to bottom"
            className="hover:text-amber-400 p-0.5 transition-colors cursor-pointer"
          >
            <ArrowDown className="h-2.5 w-2.5" />
          </button>
          <span className="text-slate-400 font-mono border-l border-slate-800 pl-1.5">
            {cases.length} Total
          </span>
        </div>
      </div>
    </div>
  );
}

