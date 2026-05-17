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
    <div className="min-h-screen max-w-2xl px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          <Settings size={12} className="inline mr-1.5" />
          Cycle Management
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          {cycle.name}
        </h1>
        <p className="text-sm" style={{ color: "#7A5C3E" }}>
          Configure when windows open and close. Changes take effect immediately.
        </p>
      </motion.div>

      {/* Active cycle toggle */}
      <div
        className="p-4 mb-6 flex items-center justify-between"
        style={{ background: "rgba(74,94,58,0.06)", border: "1px solid rgba(74,94,58,0.15)", borderRadius: "2px" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: "#7A9170" }} />
          <span className="text-sm font-medium" style={{ color: "#2C2A26" }}>Active cycle</span>
        </div>
        <span className="text-xs" style={{ color: "#7A9170" }}>Running</span>
      </div>

      {/* Windows */}
      <div className="space-y-4 mb-8">
        {windows.map((win, i) => (
          <motion.div
            key={win.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4"
            style={{ background: "white", border: "1px solid rgba(122,92,62,0.12)", borderRadius: "2px" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} style={{ color: "#C9A97A" }} />
              <p className="text-sm font-semibold" style={{ color: "#2C2A26" }}>{win.label}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Opens</label>
                <input type="date" className="strata-input" defaultValue={win.opens} />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Closes</label>
                <input type="date" className="strata-input" defaultValue={win.closes} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Late submissions */}
      <div
        className="p-4 mb-6"
        style={{ borderLeft: "3px solid #D4913A", background: "rgba(212,145,58,0.04)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle size={14} style={{ color: "#D4913A" }} />
          <p className="text-sm font-semibold" style={{ color: "#2C2A26" }}>Late submission policy</p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#7A5C3E" }}>
          Late entries are accepted but flagged. The system records them as late and notifies the relevant manager. Data is preserved — no submission is rejected outright.
        </p>
      </div>

      <button className="btn-primary" onClick={handleSave}>
        Save cycle configuration
      </button>
    </div>
  );
}
