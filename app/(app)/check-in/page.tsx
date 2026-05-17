"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getUserGoalSheet,
  QUARTERLY_UPDATES,
  getCheckInComments,
} from "@/lib/data/seed";
import { computeScore } from "@/lib/utils/scoring";
import type { Quarter, CheckInStatus } from "@/lib/types";
import { toast } from "sonner";
import { Clock, ChevronRight, ChevronDown } from "lucide-react";

const CURRENT_QUARTER: Quarter = "Q3";

export default function CheckInPage() {
  const { currentUser } = useUserStore();
  const sheet = currentUser ? getUserGoalSheet(currentUser.id) : undefined;
  const prevComments = sheet ? getCheckInComments(sheet.id) : [];
  const prevQ2Comment = prevComments.find(c => c.quarter === "Q2");
  const prevQ2Update = QUARTERLY_UPDATES.find(u => u.goalId === sheet?.goals[0]?.id && u.quarter === "Q2");

  const [contextNote, setContextNote] = useState("");
  const [goalStates, setGoalStates] = useState<Record<string, { actual: number; status: CheckInStatus }>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showLayerAnimate, setShowLayerAnimate] = useState(false);

  if (!currentUser || !sheet) return (
    <div className="px-8 py-8">
      <p style={{ color: "#7A5C3E" }}>No active goal sheet found.</p>
    </div>
  );

  const handleSubmit = () => {
    setSubmitted(true);
    setShowLayerAnimate(true);
    toast.success("Quarter submitted. Your stratum grows.");
  };

  return (
    <div className="min-h-screen max-w-2xl px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D4913A" }}>
          <Clock size={12} className="inline mr-1.5" />
          Q3 Check-in · January 2026
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          {submitted ? "Your layer is forming." : "This quarter is open. Tell us what happened."}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7A5C3E" }}>
          {submitted
            ? "Q3 has been recorded. Your stratum now has three layers."
            : "Start with what the numbers don't capture. Then update each goal."}
        </p>
      </motion.div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 text-center"
          style={{ background: "#2C2A26", borderRadius: "2px" }}
        >
          {/* Animated stratum completion */}
          <div className="flex gap-1 justify-center mb-6">
            {(["Q1", "Q2", "Q3", "Q4"] as Quarter[]).map((q, i) => (
              <motion.div
                key={q}
                style={{
                  width: "48px",
                  height: "8px",
                  background: i < 3 ? "#D4913A" : "#E8E3D8",
                  borderRadius: "1px",
                }}
                initial={i === 2 ? { scaleX: 0 } : { scaleX: 1 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i === 2 ? 0.4 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            ))}
          </div>
          <p className="font-serif italic text-lg" style={{ color: "#C9A97A" }}>
            Three layers. One more to go.
          </p>
          <p className="text-sm mt-2" style={{ color: "rgba(245,240,232,0.5)" }}>
            Your manager will add their comment to this quarter.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Previous quarter thread */}
          {prevQ2Comment && (
            <div
              className="p-4 mb-6"
              style={{ background: "rgba(122,92,62,0.04)", border: "1px solid rgba(122,92,62,0.1)", borderRadius: "2px" }}
            >
              <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: "#C9A97A" }}>
                Q2 · Rajiv's note
              </p>
              <p className="text-sm font-serif italic leading-relaxed" style={{ color: "#4A5568" }}>
                "{prevQ2Comment.commentText}"
              </p>
            </div>
          )}

          {/* Context field — FIRST, most prominent */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <label
              className="block font-serif text-base font-semibold mb-2"
              style={{ color: "#2C2A26" }}
            >
              What the numbers don't capture this quarter.
            </label>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: "#7A5C3E", opacity: 0.7 }}>
              A change in direction, an unexpected challenge, something you're proud of that won't show up in a metric. This stays in your record permanently.
            </p>
            <textarea
              className="context-field w-full"
              rows={5}
              placeholder="A change in direction, an unexpected challenge, something you're proud of that won't show up in a metric."
              value={contextNote}
              onChange={e => setContextNote(e.target.value)}
              aria-label="Context note — what the numbers don't capture"
            />
            {contextNote.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs mt-1.5 italic"
                style={{ color: "#7A9170" }}
              >
                This note will stay in your record permanently.
              </motion.p>
            )}
          </motion.div>

          {/* Goal updates */}
          <div className="space-y-4 mb-8">
            <h2 className="font-serif text-lg font-semibold" style={{ color: "#2C2A26" }}>
              Your goals this quarter
            </h2>
            {sheet.goals.map((goal, i) => {
              const state = goalStates[goal.id] ?? { actual: 0, status: "on_track" as CheckInStatus };
              const score = computeScore(goal.uomType, goal.targetValue, state.actual);

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="p-4"
                  style={{ background: "white", border: "1px solid rgba(122,92,62,0.1)", borderRadius: "2px" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#C9A97A" }}>
                        {goal.thrustArea} · {goal.weightage}%
                      </p>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: "#2C2A26" }}>
                        {goal.title}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5"
                      style={{ background: "rgba(122,92,62,0.08)", color: "#7A5C3E", borderRadius: "1px" }}
                    >
                      Target: {goal.targetValue}
                    </span>
                  </div>

                  {/* Actual value */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>
                        Actual achieved
                      </label>
                      <input
                        type="number"
                        className="strata-input"
                        value={state.actual}
                        onChange={e => setGoalStates(s => ({
                          ...s,
                          [goal.id]: { ...state, actual: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>
                        Status
                      </label>
                      <select
                        className="strata-input"
                        value={state.status}
                        onChange={e => setGoalStates(s => ({
                          ...s,
                          [goal.id]: { ...state, status: e.target.value as CheckInStatus }
                        }))}
                      >
                        <option value="not_started">Not started</option>
                        <option value="on_track">On track</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Score preview */}
                  {state.actual > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-2"
                    >
                      <div className="flex-1 h-0.5" style={{ background: "#E8E3D8", borderRadius: "1px" }}>
                        <motion.div
                          style={{ height: "100%", background: "#D4913A", borderRadius: "1px" }}
                          animate={{ width: `${Math.min(score, 100)}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "#D4913A" }}>
                        {Math.round(score)}%
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Submit */}
          <button
            className="btn-amber w-full justify-center text-center"
            onClick={handleSubmit}
          >
            Submit Q3 and close this quarter
          </button>
          <p className="text-xs text-center mt-2 italic" style={{ color: "rgba(122,92,62,0.5)" }}>
            "The feeling of closing a chapter — with your own words in it."
          </p>
        </>
      )}
    </div>
  );
}
