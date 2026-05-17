"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GOAL_SHEETS, USERS, getTeamForManager } from "@/lib/data/seed";
import { useUserStore } from "@/lib/store/useUserStore";
import WeightageAllocator from "@/components/strata/WeightageAllocator";
import { Check, RotateCcw, Edit3 } from "lucide-react";
import { toast } from "sonner";
import type { GoalSheet } from "@/lib/types";

export default function ApprovalsPage() {
  const { currentUser } = useUserStore();
  const [approved, setApproved] = useState<string[]>([]);
  const [returned, setReturned] = useState<Record<string, string>>({});
  const [returnComment, setReturnComment] = useState<Record<string, string>>({});

  if (!currentUser) return null;
  const team = getTeamForManager(currentUser.id);
  const pending = GOAL_SHEETS.filter(
    s => team.some(m => m.id === s.userId) && s.status === "submitted" && !approved.includes(s.id)
  );

  const handleApprove = (sheet: GoalSheet) => {
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
    setReturned(prev => ({ ...prev, [sheet.id]: comment }));
    const employee = USERS.find(u => u.id === sheet.userId);
    toast.success(`Returned to ${employee?.name} with your note.`);
  };

  return (
    <div className="min-h-screen max-w-2xl px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          Pending Approvals
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          {pending.length > 0
            ? `${pending.length} ${pending.length === 1 ? "canvas" : "canvases"} waiting for your eye.`
            : "You're all caught up."}
        </h1>
      </motion.div>

      {pending.length === 0 && (
        <div className="p-8 text-center" style={{ border: "1px solid rgba(122,92,62,0.1)", borderRadius: "2px" }}>
          <p className="font-serif italic text-lg" style={{ color: "#7A5C3E" }}>
            Every canvas has been reviewed.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {pending.map((sheet, i) => {
          const employee = USERS.find(u => u.id === sheet.userId);
          const isReturned = sheet.id in returned;
          if (isReturned) return null;

          return (
            <motion.div
              key={sheet.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="overflow-hidden"
              style={{ border: "1px solid rgba(122,92,62,0.15)", borderRadius: "2px" }}
            >
              {/* Employee header */}
              <div className="px-5 py-4" style={{ background: "#F5F0E8", borderBottom: "1px solid rgba(122,92,62,0.12)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg font-semibold" style={{ color: "#2C2A26" }}>
                      {employee?.name}
                    </p>
                    <p className="text-xs" style={{ color: "#7A5C3E" }}>
                      {employee?.department} · Submitted {new Date(sheet.submittedAt!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5" style={{ background: "rgba(212,145,58,0.12)", color: "#D4913A", borderRadius: "1px" }}>
                    Awaiting review
                  </span>
                </div>
              </div>

              {/* Intention statement — read this first */}
              {sheet.intentionStatement && (
                <div className="px-5 py-4" style={{ background: "rgba(44,42,38,0.02)", borderBottom: "1px solid rgba(122,92,62,0.08)" }}>
                  <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "#C9A97A" }}>
                    What {employee?.name.split(" ")[0]} wants to be known for
                  </p>
                  <p className="font-serif italic text-base leading-relaxed" style={{ color: "#2C2A26" }}>
                    "{sheet.intentionStatement}"
                  </p>
                </div>
              )}

              {/* Goals */}
              <div className="p-5">
                <div className="space-y-3 mb-5">
                  {sheet.goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3"
                      style={{ border: "1px solid rgba(122,92,62,0.1)", borderRadius: "2px", background: "white" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#C9A97A" }}>
                            {goal.thrustArea}
                          </p>
                          <p className="text-sm font-semibold mt-0.5" style={{ color: "#2C2A26" }}>
                            {goal.title}
                          </p>
                          {goal.isShared && (
                            <p className="text-xs mt-0.5" style={{ color: "#D4913A" }}>
                              Shared goal · delivered by you
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold" style={{ color: "#7A5C3E" }}>
                            {goal.weightage}%
                          </p>
                          <p className="text-xs" style={{ color: "#C9A97A" }}>
                            Target: {goal.targetValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <WeightageAllocator
                  readOnly
                  goals={sheet.goals.map(g => ({ id: g.id, title: g.title, weightage: g.weightage }))}
                />

                {/* Return comment */}
                <div className="mt-5">
                  <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>
                    Note for {employee?.name.split(" ")[0]} (required if returning)
                  </label>
                  <textarea
                    className="strata-input"
                    rows={2}
                    placeholder="Not a rejection — a question. What would you like them to reconsider?"
                    value={returnComment[sheet.id] ?? ""}
                    onChange={e => setReturnComment(prev => ({ ...prev, [sheet.id]: e.target.value }))}
                    style={{ width: "100%", resize: "vertical" }}
                  />
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => handleApprove(sheet)}
                    className="btn-amber flex items-center gap-2"
                  >
                    <Check size={14} /> Approve canvas
                  </button>
                  <button
                    onClick={() => handleReturn(sheet)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RotateCcw size={14} /> Return with note
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
