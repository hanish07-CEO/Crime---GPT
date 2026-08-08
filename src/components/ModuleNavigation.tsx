import React from "react";
import { UserCheck, FileEdit, Cpu, FileCode2, ChevronRight, Shield, LogOut, Sparkles } from "lucide-react";

export type AppModule = "portal" | "dossier" | "workspace" | "solutionDocument";

interface ModuleNavProps {
  activeModule: string;
  setActiveModule: (module: "portal" | "dossier" | "workspace" | "solutionDocument") => void;
  userProfile: any;
  onSignOut: () => void;
  onOpenLoginModal: () => void;
}

export default function ModuleNavigation({
  activeModule,
  setActiveModule,
  userProfile,
  onSignOut,
  onOpenLoginModal
}: ModuleNavProps) {
  return (
    <div className="bg-slate-900 border-b border-amber-500/30 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-md">
      
      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scroller-none py-0.5">
        
        {/* Step 1: Officer Portal */}
        <button
          onClick={() => setActiveModule("portal")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-bold ${
            activeModule === "portal"
              ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>1. OFFICER PORTAL</span>
          {userProfile && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0 hidden sm:inline" />

        {/* Step 2: Incident Dossier Input */}
        <button
          onClick={() => setActiveModule("dossier")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-bold ${
            activeModule === "dossier"
              ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <FileEdit className="h-3.5 w-3.5" />
          <span>2. INCIDENT DOSSIER</span>
        </button>

        <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0 hidden sm:inline" />

        {/* Step 3: Intelligence Workspace */}
        <button
          onClick={() => setActiveModule("workspace")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-bold ${
            activeModule === "workspace"
              ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>3. INTEL WORKSPACE</span>
        </button>

        <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0 hidden sm:inline" />

        {/* Step 4: Solution Document & Roadmap */}
        <button
          onClick={() => setActiveModule("solutionDocument")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-bold ${
            activeModule === "solutionDocument"
              ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <FileCode2 className="h-3.5 w-3.5" />
          <span>4. SOLUTION DOC & ROADMAP</span>
          <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[9px] rounded border border-amber-400/30">
            PROPOSAL
          </span>
        </button>
      </div>

      {/* Officer Auth Info Bar */}
      <div className="flex items-center gap-2">
        {userProfile ? (
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-[11px]">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-amber-400 font-bold">{userProfile.badgeNumber || "BADGE ACTIVE"}</span>
            <span className="text-slate-400 hidden md:inline">({userProfile.displayName || userProfile.email})</span>
            <button
              onClick={onSignOut}
              title="Sign Out Officer"
              className="ml-1 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLoginModal}
            className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Sign In / Officer Badge</span>
          </button>
        )}
      </div>

    </div>
  );
}
