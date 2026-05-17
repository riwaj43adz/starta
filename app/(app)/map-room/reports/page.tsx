"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GOAL_SHEETS, QUARTERLY_UPDATES, USERS, ACTIVE_CYCLE
} from "@/lib/data/seed";
import { buildStratumLayers } from "@/lib/utils/scoring";
import { Download } from "lucide-react";
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
    <div className="page-container" style={{ maxWidth: 860 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ marginBottom: 8 }}>
          Achievement Report
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          Build your report.
        </h1>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, color: "var(--text-tertiary)" }}>
          Not a flat CSV. A layered record with context included.
        </p>
      </motion.div>

      {/* Step 1: Scope */}
      <div style={{ marginBottom: 24 }}>
        <p className="text-label" style={{ marginBottom: 12 }}>1 · Scope</p>
        <div style={{ display: "flex", gap: 10 }}>
          {(["org", "individual"] as const).map(s => (
            <button
              key={s}
              onClick={() => setScope(s)}
              style={{
                padding: "8px 16px", fontSize: 13, fontWeight: 600, textTransform: "capitalize",
                border: `1px solid ${scope === s ? "var(--brand-amber)" : "var(--surface-border)"}`,
                background: scope === s ? "var(--brand-amber-dim)" : "var(--surface-2)",
                color: scope === s ? "var(--brand-amber)" : "var(--text-secondary)",
                borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all 200ms",
              }}
            >
              {s === "org" ? "Organisation-wide" : "Individual"}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Period */}
      <div style={{ marginBottom: 32 }}>
        <p className="text-label" style={{ marginBottom: 12 }}>2 · Period</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(["Q1", "Q2", "Q3", "Q4", "annual"] as const).map(q => (
            <button
              key={q}
              onClick={() => setQuarter(q)}
              style={{
                padding: "8px 16px", fontSize: 13, fontWeight: 600,
                border: `1px solid ${quarter === q ? "var(--brand-amber)" : "var(--surface-border)"}`,
                background: quarter === q ? "var(--brand-amber-dim)" : "var(--surface-2)",
                color: quarter === q ? "var(--brand-amber)" : "var(--text-secondary)",
                borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all 200ms",
              }}
            >
              {q === "annual" ? "Full Year" : q}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{ marginBottom: 32 }}>
        <p className="text-label" style={{ marginBottom: 12 }}>3 · Preview</p>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: "var(--surface-3)", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{ACTIVE_CYCLE.name} Achievement Report</p>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                {scope === "org" ? "Organisation-wide" : "Individual"} · {quarter === "annual" ? "Full Year" : quarter}
              </p>
            </div>
            <p style={{ fontSize: 12, color: "var(--brand-amber)" }}>
              {employees.length} employees · {GOAL_SHEETS.length} canvases
            </p>
          </div>

          {/* Preview rows */}
          {employees.map((emp, i) => {
            const sheet = GOAL_SHEETS.find(s => s.userId === emp.id);
            const updates = QUARTERLY_UPDATES.filter(u => sheet?.goals.some(g => g.id === u.goalId));
            const strata = sheet ? buildStratumLayers(sheet.goals, updates) : [];

            return (
              <div
                key={emp.id}
                style={{
                  padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: i < employees.length - 1 ? "1px solid var(--surface-border)" : "none",
                  background: i % 2 === 0 ? "var(--surface-2)" : "var(--surface-1)",
                }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{emp.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{emp.department}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {strata.map(l => {
                      let bg = "var(--surface-border-strong)";
                      if (l.isComplete) {
                        bg = l.depth === "deep" ? "var(--layer-deep)" : l.depth === "solid" ? "var(--layer-solid)" : "var(--layer-growing)";
                      }
                      return (
                        <div key={l.quarter} style={{ width: 16, height: 6, background: bg, borderRadius: 1 }} />
                      );
                    })}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {sheet?.status ?? "No canvas"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Context notes included note */}
          <div style={{ padding: "12px 20px", background: "var(--surface-3)", borderTop: "1px solid var(--surface-border)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "var(--text-tertiary)" }}>
              Context notes included · Audit trail appended · Plain English column labels
            </p>
          </div>
        </div>
      </div>

      {/* Export */}
      <button className="btn-primary" onClick={handleExport}>
        <Download size={14} /> Export report
      </button>
      <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 12 }}>
        Priya walked into the appraisal committee with data she believed in. For the first time.
      </p>
    </div>
  );
}
