"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ACTIVE_CYCLE } from "@/lib/data/seed";
import { Settings, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function CyclesPage() {
  const [cycle, setCycle] = useState(ACTIVE_CYCLE);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Cycle configuration saved.");
  };

  const windows = [
    { label: "Goal Setting Window", opens: cycle.goalSettingOpens, closes: cycle.goalSettingCloses },
    { label: "Q1 Check-in Window", opens: cycle.q1Opens, closes: cycle.q1Closes },
    { label: "Q2 Check-in Window", opens: cycle.q2Opens, closes: cycle.q2Closes },
    { label: "Q3 Check-in Window", opens: cycle.q3Opens, closes: cycle.q3Closes },
    { label: "Q4 Check-in Window", opens: cycle.q4Opens, closes: cycle.q4Closes },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 860 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <Settings size={12} />
          Cycle Management
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          {cycle.name}
        </h1>
        <p className="text-body">
          Configure when windows open and close. Changes take effect immediately.
        </p>
      </motion.div>

      {/* Active cycle toggle */}
      <div
        className="card"
        style={{ padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: "3px solid var(--status-success)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--status-success)" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Active cycle</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--status-success)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Running</span>
      </div>

      {/* Windows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {windows.map((win, i) => (
          <motion.div
            key={win.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card"
            style={{ padding: 20 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Calendar size={15} style={{ color: "var(--brand-amber)" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{win.label}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="text-label" style={{ display: "block", marginBottom: 6 }}>Opens</label>
                <input type="date" className="strata-input" defaultValue={win.opens} />
              </div>
              <div>
                <label className="text-label" style={{ display: "block", marginBottom: 6 }}>Closes</label>
                <input type="date" className="strata-input" defaultValue={win.closes} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Late submissions */}
      <div
        className="card"
        style={{ padding: 20, marginBottom: 24, borderLeft: "3px solid var(--brand-amber)", background: "var(--brand-amber-glow)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <AlertCircle size={15} style={{ color: "var(--brand-amber)" }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Late submission policy</p>
        </div>
        <p className="text-body">
          Late entries are accepted but flagged. The system records them as late and notifies the relevant manager. Data is preserved — no submission is rejected outright.
        </p>
      </div>

      <button className="btn-primary" onClick={handleSave}>
        Save cycle configuration
      </button>
    </div>
  );
}
