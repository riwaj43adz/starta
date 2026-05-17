"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getUserGoalSheet,
  QUARTERLY_UPDATES,
  getCheckInComments,
} from "@/lib/data/seed";
import { computeScore } from "@/lib/utils/scoring";
import type { Quarter, CheckInStatus } from "@/lib/types";
import { toast } from "sonner";
import { Clock } from "lucide-react";

const CURRENT_QUARTER: Quarter = "Q3";

export default function CheckInPage() {
  const { currentUser } = useUserStore();
  const sheet = currentUser ? getUserGoalSheet(currentUser.id) : undefined;
  const prevComments = sheet ? getCheckInComments(sheet.id) : [];
  const prevQ2Comment = prevComments.find(c => c.quarter === "Q2");

  const [contextNote, setContextNote] = useState("");
  const [goalStates, setGoalStates] = useState<Record<string, { actual: number; status: CheckInStatus }>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showLayerAnimate, setShowLayerAnimate] = useState(false);

  if (!currentUser || !sheet) return (
    <div className="page-container">
      <p className="text-body">No active goal sheet found.</p>
    </div>
  );

  const handleSubmit = () => {
    setSubmitted(true);
    setShowLayerAnimate(true);
    toast.success("Quarter submitted. Your stratum grows.");
  };

  return (
    <div className="page-container" style={{ maxWidth: 860 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ color: "var(--brand-amber)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={12} />
          Q3 Check-in · January 2026
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          {submitted ? "Your layer is forming." : "This quarter is open. Tell us what happened."}
        </h1>
        <p className="text-body">
          {submitted
            ? "Q3 has been recorded. Your stratum now has three layers."
            : "Start with what the numbers don't capture. Then update each goal."}
        </p>
      </motion.div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{ padding: 32, textAlign: "center", background: "var(--surface-3)" }}
        >
          {/* Animated stratum completion */}
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 24 }}>
            {(["Q1", "Q2", "Q3", "Q4"] as Quarter[]).map((q, i) => (
              <motion.div
                key={q}
                style={{
                  width: 48, height: 8, borderRadius: 1,
                  background: i < 3 ? "var(--brand-amber)" : "var(--surface-border-strong)",
                }}
                initial={i === 2 ? { scaleX: 0 } : { scaleX: 1 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i === 2 ? 0.4 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--brand-amber)" }}>
            Three layers. One more to go.
          </p>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 8 }}>
            Your manager will add their comment to this quarter.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Previous quarter thread */}
          {prevQ2Comment && (
            <div
              className="card"
              style={{ padding: 20, marginBottom: 24, background: "var(--surface-1)" }}
            >
              <p className="text-label" style={{ marginBottom: 8 }}>
                Q2 · Rajiv's note
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                "{prevQ2Comment.commentText}"
              </p>
            </div>
          )}

          {/* Context field */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 32 }}>
            <label style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", display: "block", marginBottom: 8 }}>
              What the numbers don't capture this quarter.
            </label>
            <p className="text-body-sm" style={{ marginBottom: 12 }}>
              A change in direction, an unexpected challenge, something you're proud of that won't show up in a metric. This stays in your record permanently.
            </p>
            <textarea
              className="context-field"
              rows={5}
              placeholder="A change in direction, an unexpected challenge, something you're proud of that won't show up in a metric."
              value={contextNote}
              onChange={e => setContextNote(e.target.value)}
            />
            {contextNote.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontSize: 12, color: "var(--status-success)", fontStyle: "italic", marginTop: 6 }}
              >
                This note will stay in your record permanently.
              </motion.p>
            )}
          </motion.div>

          {/* Goal updates */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)" }}>
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
                  className="card"
                  style={{ padding: 20 }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <p className="text-label" style={{ marginBottom: 4 }}>
                        {goal.thrustArea} · {goal.weightage}%
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                        {goal.title}
                      </p>
                    </div>
                    <span className="badge badge-neutral">
                      Target: {goal.targetValue}
                    </span>
                  </div>

                  {/* Actual value */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label className="text-label" style={{ display: "block", marginBottom: 6 }}>
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
                      <label className="text-label" style={{ display: "block", marginBottom: 6 }}>
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
                      style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div style={{ flex: 1, height: 2, background: "var(--surface-border-strong)", borderRadius: 1 }}>
                        <motion.div
                          style={{ height: "100%", background: "var(--brand-amber)", borderRadius: 1 }}
                          animate={{ width: `${Math.min(score, 100)}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--brand-amber)" }}>
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
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px 16px" }}
            onClick={handleSubmit}
          >
            Submit Q3 and close this quarter
          </button>
          <p style={{ fontSize: 12, textAlign: "center", marginTop: 8, fontStyle: "italic", color: "var(--text-tertiary)" }}>
            "The feeling of closing a chapter — with your own words in it."
          </p>
        </>
      )}
    </div>
  );
}
