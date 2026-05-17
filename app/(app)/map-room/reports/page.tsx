"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GOAL_SHEETS, QUARTERLY_UPDATES, USERS, ACTIVE_CYCLE
} from "@/lib/data/seed";
import { buildStratumLayers, scoreToDepth } from "@/lib/utils/scoring";
import { formatDate } from "@/lib/utils";
import { Download, Filter } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [scope, setScope] = useState<"org" | "individual">("org");
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4" | "annual">("annual");

  const handleExport = () => {
    toast.success("Achievement report generated. Download starting.");
    // In production: trigger CSV/Excel download
  };

  const employees = USERS.filter(u => u.role === "employee");

  return (
    <div className="min-h-screen max-w-3xl px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          Achievement Report
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          Build your report.
        </h1>
        <p className="text-sm font-serif italic" style={{ color: "#7A5C3E" }}>
          Not a flat CSV. A layered record with context included.
        </p>
      </motion.div>

      {/* Step 1: Scope */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: "#C9A97A" }}>1 · Scope</p>
        <div className="flex gap-2">
          {(["org", "individual"] as const).map(s => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className="px-4 py-2 text-sm font-medium capitalize transition-all duration-200"
              style={{
                border: `1px solid ${scope === s ? "#D4913A" : "rgba(122,92,62,0.2)"}`,
                background: scope === s ? "rgba(212,145,58,0.08)" : "white",
                color: scope === s ? "#D4913A" : "#7A5C3E",
                borderRadius: "2px",
              }}
            >
              {s === "org" ? "Organisation-wide" : "Individual"}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Period */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: "#C9A97A" }}>2 · Period</p>
        <div className="flex gap-2 flex-wrap">
          {(["Q1", "Q2", "Q3", "Q4", "annual"] as const).map(q => (
            <button
              key={q}
              onClick={() => setQuarter(q)}
              className="px-4 py-2 text-sm font-medium transition-all duration-200"
              style={{
                border: `1px solid ${quarter === q ? "#D4913A" : "rgba(122,92,62,0.2)"}`,
                background: quarter === q ? "rgba(212,145,58,0.08)" : "white",
                color: quarter === q ? "#D4913A" : "#7A5C3E",
                borderRadius: "2px",
              }}
            >
              {q === "annual" ? "Full Year" : q}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: "#C9A97A" }}>3 · Preview</p>
        <div style={{ border: "1px solid rgba(122,92,62,0.15)", borderRadius: "2px", overflow: "hidden" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#F5F0E8", borderBottom: "1px solid rgba(122,92,62,0.1)" }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#2C2A26" }}>{ACTIVE_CYCLE.name} Achievement Report</p>
              <p className="text-xs" style={{ color: "#7A5C3E" }}>
                {scope === "org" ? "Organisation-wide" : "Individual"} · {quarter === "annual" ? "Full Year" : quarter}
              </p>
            </div>
            <p className="text-xs" style={{ color: "#C9A97A" }}>
              {employees.length} employees · {GOAL_SHEETS.length} canvases
            </p>
          </div>

          {/* Preview rows */}
          {employees.map((emp, i) => {
            const sheet = GOAL_SHEETS.find(s => s.userId === emp.id);
            const updates = QUARTERLY_UPDATES.filter(u => sheet?.goals.some(g => g.id === u.goalId));
            const strata = sheet ? buildStratumLayers(sheet.goals, updates) : [];
            const q3Layer = strata.find(s => s.quarter === "Q3");

            return (
              <div
                key={emp.id}
                className="px-4 py-3 flex items-center justify-between"
                style={{
                  borderBottom: i < employees.length - 1 ? "1px solid rgba(122,92,62,0.08)" : "none",
                  background: i % 2 === 0 ? "white" : "rgba(245,240,232,0.3)",
                }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#2C2A26" }}>{emp.name}</p>
                  <p className="text-xs" style={{ color: "#7A5C3E" }}>{emp.department}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-0.5">
                    {strata.map(l => (
                      <div key={l.quarter} style={{ width: "16px", height: "6px", background: l.isComplete ? (l.depth === "deep" ? "#D4913A" : l.depth === "solid" ? "#7A5C3E" : "#7A9170") : "#E8E3D8", borderRadius: "1px" }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: "#7A5C3E" }}>
                    {sheet?.status ?? "No canvas"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Context notes included note */}
          <div className="px-4 py-3" style={{ background: "rgba(245,240,232,0.5)", borderTop: "1px solid rgba(122,92,62,0.08)" }}>
            <p className="text-xs font-serif italic" style={{ color: "#7A5C3E" }}>
              Context notes included · Audit trail appended · Plain English column labels
            </p>
          </div>
        </div>
      </div>

      {/* Export */}
      <button className="btn-amber flex items-center gap-2" onClick={handleExport}>
        <Download size={14} /> Export report
      </button>
      <p className="text-xs mt-2" style={{ color: "rgba(122,92,62,0.5)" }}>
        Priya walked into the appraisal committee with data she believed in. For the first time.
      </p>
    </div>
  );
}
