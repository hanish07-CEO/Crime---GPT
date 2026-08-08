import React, { useState } from "react";
import { CaseLog } from "../types";
import { FileText, Trash2, Calendar, MapPin, ChevronRight, ShieldAlert, Check, X } from "lucide-react";

interface CaseHistoryProps {
  cases: CaseLog[];
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function CaseHistory({ cases, activeId, onSelect, onDelete }: CaseHistoryProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-900">
      <div className="p-4 border-b border-slate-900 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          <h2 className="text-xs font-bold font-sans tracking-wider uppercase text-slate-400">
            Internal Case Directory
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
          {cases.length} Filed
        </span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-900">
        {cases.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <FileText className="h-8 w-8 mx-auto stroke-[1] mb-2 text-slate-700" />
            <p className="text-xs font-sans">No saved case records.</p>
            <p className="text-[10px] font-mono mt-1 text-slate-600">Drafts will auto-save to browser local vault.</p>
          </div>
        ) : (
          cases.map((c) => {
            const isActive = c.id === activeId;
            const isConfirming = confirmingId === c.id;

            return (
              <div
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`p-3.5 text-left transition-colors cursor-pointer group flex relative ${
                  isActive
                    ? "bg-slate-900 border-l-2 border-amber-500"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                      {c.title || "Untitled Case Report"}
                    </h3>

                    {/* Inline Delete Control */}
                    <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {isConfirming ? (
                        <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-1 rounded animate-fadeIn">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDelete(c.id, e);
                              setConfirmingId(null);
                            }}
                            className="px-2 py-0.5 text-[10px] font-mono font-bold bg-red-600 hover:bg-red-500 text-white rounded transition-colors flex items-center gap-1 cursor-pointer"
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
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors opacity-80 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                          title="Purge case file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-amber-500 font-mono mt-0.5 uppercase tracking-wide">
                    {c.incidentType || "PENDING CLASSIFICATION"}
                  </p>

                  <div className="mt-2 flex flex-col gap-1 text-[10px] text-slate-400 font-sans">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="h-3 w-3 text-slate-500 shrink-0" />
                      <span>{c.date || "Date unspecified"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                      <span>{c.location || "Location pending"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center pl-2">
                  <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "text-amber-500 scale-110" : "text-slate-700 group-hover:text-slate-400"}`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-slate-900 bg-slate-950 text-[10px] text-slate-500 font-mono flex items-center justify-between">
        <span>STORAGE: LOCAL VAULT</span>
        <span className="text-green-500">SYS_SECURE</span>
      </div>
    </div>
  );
}
