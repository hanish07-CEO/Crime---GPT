import React, { useState, useEffect } from "react";
import { Shield, Clock, FileText, Lock, UserCheck, AlertTriangle, FileCode2, Award, LogIn, Fingerprint, Activity } from "lucide-react";

interface WorkspaceProps {
  onReset: () => void;
  activeCaseTitle?: string;
  onOpenSolutionDoc: () => void;
  currentTab: string;
  onOpenLoginPortal?: () => void;
}

export default function WorkspaceHeader({ onReset, activeCaseTitle, onOpenSolutionDoc, currentTab, onOpenLoginPortal }: WorkspaceProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [officerBadge, setOfficerBadge] = useState("DS-2948");
  const [officerName, setOfficerName] = useState("Det. Jane Miller");
  const [department, setDepartment] = useState("Special Investigations Division");
  const [clearanceLevel, setClearanceLevel] = useState("Level 4 - Top Secret / CJIS");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Tactical Police Warning / Classification Stripe */}
      <div className="bg-amber-500 text-slate-950 px-3 sm:px-4 py-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase border-b border-amber-600 shadow-md select-none overflow-x-auto scroller-none">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          <AlertTriangle className="h-3 w-3 stroke-[2.5]" />
          <span className="truncate">LAW ENFORCEMENT SENSITIVE (LES) // CJIS v5.9 COMPLIANT</span>
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0 font-mono text-[9.5px]">
          <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded">JURISDICTION: GUJARAT POLICE DEPT - AHMEDABAD ZONE</span>
          <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-emerald-950 animate-pulse" /> DISPATCH NODE: ACTIVE</span>
          <span>THREAT LEVEL: ALPHA-2</span>
        </div>
      </div>

      <header className="border-b border-slate-800 bg-slate-950 px-3 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-2 sm:p-2.5 rounded-xl border border-amber-500/30 text-amber-500 shadow-lg shadow-amber-500/5 flex items-center justify-center relative group shrink-0">
              <Shield className="h-5 w-5 sm:h-7 sm:w-7 stroke-[1.75]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-wider text-white font-mono uppercase">
                  Crime<span className="text-amber-500">GPT</span>
                </h1>
                <span className="px-1.5 sm:px-2 py-0.5 text-[8.5px] sm:text-[9px] font-mono tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded font-bold uppercase">
                  POLICE INTEL
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-sans flex items-center gap-1.5 mt-0.5">
                <span className="hidden sm:inline">Criminal Investigation Command &amp; Prosecutorial Engine</span>
                <span className="sm:hidden text-[10px] text-slate-500">Police Legal Intel Core</span>
              </p>
            </div>
          </div>

          {/* Mobile Right Quick Officer Avatar */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={() => {
                if (onOpenLoginPortal) {
                  onOpenLoginPortal();
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5 text-[11px] font-mono cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-amber-400">{officerBadge}</span>
            </button>
          </div>
        </div>

        {/* Center / Right Control Panel & Officer Credentials */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
          
          {/* Active Case Badge */}
          {activeCaseTitle && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
              <FileText className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">CASE:</span>
              <span className="max-w-[140px] truncate font-semibold text-slate-200">{activeCaseTitle}</span>
            </div>
          )}

          {/* Time Clock */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-slate-900 border border-slate-800 text-amber-400 text-[10.5px] sm:text-[11px]">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentTime || "SYNCING RTC..."}</span>
          </div>

          {/* Solution Document Direct Access Button */}
          <button
            onClick={onOpenSolutionDoc}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded font-mono text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              currentTab === "solutionDocument"
                ? "bg-amber-500 text-slate-950 ring-2 ring-amber-400/50"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:border-amber-400"
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">SOLUTION DOC &amp; ROADMAP</span>
            <span className="sm:hidden">SOLUTION DOC</span>
          </button>

          {/* Officer Auth Badge / Login Portal Trigger (Desktop) */}
          <button
            onClick={() => {
              if (onOpenLoginPortal) {
                onOpenLoginPortal();
              } else {
                setShowLoginModal(true);
              }
            }}
            className="hidden md:flex px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 items-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <UserCheck className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-[11px]">{officerBadge}</span>
          </button>

          {/* New Case File */}
          <button
            onClick={onReset}
            className="px-2.5 sm:px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-colors rounded cursor-pointer font-sans text-xs flex items-center gap-1.5 font-semibold"
          >
            + <span className="hidden sm:inline">New Case File</span><span className="sm:hidden">New Case</span>
          </button>
        </div>
      </header>

      {/* OFFICER LOGIN / CREDENTIAL MODAL (CrimeGPT-X Portal Style) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                <h3 className="font-mono font-bold text-slate-100 uppercase text-sm tracking-wider">
                  Officer Credential Portal
                </h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white font-mono text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Officer Badge Details */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Badge ID:</span>
                <input
                  type="text"
                  value={officerBadge}
                  onChange={(e) => setOfficerBadge(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-400 font-bold text-right focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Officer Name:</span>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-right focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Division:</span>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-right text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Clearance:</span>
                <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  {clearanceLevel}
                </span>
              </div>
            </div>

            {/* Biometric verification simulation */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-lg flex items-center gap-3">
              <Fingerprint className="h-8 w-8 text-amber-500 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-mono font-bold text-amber-400">BIOMETRIC BADGE VERIFIED</p>
                <p className="text-[10px] text-slate-400">Session encrypted under CJIS 256-bit AES protocols. All actions logged.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
              >
                Confirm Operator Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

