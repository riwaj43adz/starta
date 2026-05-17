"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { USERS, getTeamForManager } from "@/lib/data/seed";
import { useUserStore } from "@/lib/store/useUserStore";
import { useDataStore } from "@/lib/store/useDataStore";
import WeightageAllocator from "@/components/strata/WeightageAllocator";
import { Check, RotateCcw, MessageSquare, Target } from "lucide-react";
import { toast } from "sonner";
import type { GoalSheet } from "@/lib/types";

const s = (i: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.07 } });

export default function ApprovalsPage() {
  const { currentUser } = useUserStore();
  const { goalSheets, updateGoalSheetStatus } = useDataStore();
  const [approved, setApproved] = useState<string[]>([]);
  const [returned, setReturned] = useState<Record<string, string>>({});
  const [returnComment, setReturnComment] = useState<Record<string, string>>({});

  if (!currentUser) return null;
  const team = getTeamForManager(currentUser.id);
  const pending = goalSheets.filter(
    sheet => team.some(m => m.id === sheet.userId) && sheet.status === "submitted" && !approved.includes(sheet.id) && !(sheet.id in returned)
  );

  const handleApprove = (sheet: GoalSheet) => {
    updateGoalSheetStatus(sheet.id, "approved");
    setApproved(prev => [...prev, sheet.id]);
    const employee = USERS.find(u => u.id === sheet.userId);
    toast.success(`${employee?.name}'s canvas approved.`);
  };

  const handleReturn = (sheet: GoalSheet) => {
    const comment = returnComment[sheet.id];
    if (!comment?.trim()) {
      toast.error("Add a note for them before returning — they deserve context.");
      return;
    }
    updateGoalSheetStatus(sheet.id, "returned");
    setReturned(prev => ({ ...prev, [sheet.id]: comment }));
    const employee = USERS.find(u => u.id === sheet.userId);
    toast.success(`Returned to ${employee?.name} with your note.`);
  };

  return (
    <div className="page-container" style={{ maxWidth: 960 }}>
      <motion.div {...s(0)} className="page-header">
        <div className="text-label" style={{ marginBottom: 6 }}>The Lens · Pending Action</div>
        <h1 className="text-display-lg">
          {pending.length > 0
            ? `${pending.length} Canvas${pending.length === 1 ? "" : "es"} Pending Review`
            : "You're all caught up."}
        </h1>
        <p className="text-body" style={{ marginTop: 4 }}>
          {pending.length > 0 
            ? "Review your team's intentions for the year. This is the foundation of their record." 
            : "Every intention has been reviewed and recorded."}
        </p>
      </motion.div>

      {pending.length === 0 && (
        <motion.div {...s(1)} className="card card-md" style={{ textAlign: "center", padding: "48px 24px" }}>
          <Check size={32} style={{ color: "var(--brand-amber)", margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--text-primary)" }}>Zero pending reviews</p>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 8 }}>Your team's goals are locked and ready for Q1.</p>
        </motion.div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {pending.map((sheet, i) => {
          const employee = USERS.find(u => u.id === sheet.userId);
          const isReturned = sheet.id in returned;
          if (isReturned) return null;

          return (
            <motion.div
              key={sheet.id}
              {...s(i + 1)}
              className="card"
              style={{ overflow: "hidden" }}
            >
              {/* Employee header */}
              <div style={{ padding: "18px 24px", background: "var(--surface-3)", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--brand-amber-dim)", border: "1px solid rgba(232,162,58,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--brand-amber)" }}>
                    {employee?.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{employee?.name}</h3>
                    <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                      {employee?.department} · Submitted {new Date(sheet.submittedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="badge badge-amber">Awaiting Review</div>
              </div>

              {/* Intention statement */}
              {sheet.intentionStatement && (
                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--surface-border)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-amber)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageSquare size={12} />
                    Their Intention
                  </div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontStyle: "italic", color: "var(--text-primary)", lineHeight: 1.6 }}>
                    "{sheet.intentionStatement}"
                  </p>
                </div>
              )}

              {/* Goals list */}
              <div style={{ padding: "24px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Target size={14} />
                  Proposed Goals
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  {sheet.goals.map((goal) => (
                    <div
                      key={goal.id}
                      style={{ padding: "16px", background: "var(--surface-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--surface-border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                            {goal.thrustArea}
                          </span>
                          {goal.isShared && (
                            <span style={{ fontSize: 9, padding: "2px 6px", background: "rgba(107,107,123,0.15)", color: "#8888A0", borderRadius: 3 }}>
                              Shared Goal
                            </span>
                          )}
                        </div>
                        <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{goal.title}</h4>
                        <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>{goal.description}</p>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 80 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--brand-amber)" }}>{goal.weightage}%</div>
                        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>Target: {goal.targetValue}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <WeightageAllocator
                  readOnly
                  goals={sheet.goals.map(g => ({ id: g.id, title: g.title, weightage: g.weightage }))}
                />

                {/* Return Note */}
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px dashed var(--surface-border-strong)" }}>
                  <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                    Manager Note
                  </label>
                  <textarea
                    className="context-field"
                    placeholder="Not a rejection — a question. What would you like them to reconsider? (Required only if returning)"
                    value={returnComment[sheet.id] ?? ""}
                    onChange={e => setReturnComment(prev => ({ ...prev, [sheet.id]: e.target.value }))}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
                  <button
                    onClick={() => handleApprove(sheet)}
                    className="btn-primary"
                  >
                    <Check size={14} /> Approve Canvas
                  </button>
                  <button
                    onClick={() => handleReturn(sheet)}
                    className="btn-secondary"
                  >
                    <RotateCcw size={14} /> Return for Revision
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
