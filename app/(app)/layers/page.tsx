"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import { getUserGoalSheet, getUserUpdates, getCheckInComments } from "@/lib/data/seed";
import { buildStratumLayers, scoreToDepth, depthToHex } from "@/lib/utils/scoring";
import { QUARTER_LABELS } from "@/lib/types";
import type { Quarter } from "@/lib/types";
import { Archive } from "lucide-react";

export default function LayersPage() {
  const { currentUser } = useUserStore();
  if (!currentUser) return null;

  const sheet = getUserGoalSheet(currentUser.id);
  const updates = getUserUpdates(currentUser.id);
  const comments = sheet ? getCheckInComments(sheet.id) : [];
  const strata = sheet ? buildStratumLayers(sheet.goals, updates) : [];

  const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

  return (
    <div className="min-h-screen max-w-2xl px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          <Archive size={12} className="inline mr-1.5" />
          My Layers
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          Your depth, by quarter.
        </h1>
        <p className="font-serif italic text-sm" style={{ color: "#7A5C3E" }}>
          Your context archive. Accessible only to you. Permanently.
        </p>
      </motion.div>

      {/* Full stratum visualization */}
      {sheet && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 mb-8"
          style={{ background: "#2C2A26", borderRadius: "2px" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(201,169,122,0.5)" }}>
            FY 2025–26 · Complete Stratum
          </p>

          {/* Geological depth view */}
          <div className="space-y-1 mb-4">
            {quarters.map((q, i) => {
              const layer = strata.find(l => l.quarter === q);
              const color = layer?.isComplete ? depthToHex(layer.depth) : "#E8E3D8";
              const opacity = layer?.isComplete ? 1 : 0.2;

              return (
                <motion.div
                  key={q}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                >
                  <span className="text-xs font-medium w-6" style={{ color: "rgba(201,169,122,0.5)" }}>{q}</span>
                  <div className="flex-1 h-3 rounded-none" style={{ background: color, opacity }} />
                  {layer?.isComplete && (
                    <span className="text-xs capitalize" style={{ color: "rgba(201,169,122,0.5)" }}>
                      {layer.depth}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs font-serif italic" style={{ color: "rgba(201,169,122,0.4)" }}>
            "{sheet.intentionStatement}"
          </p>
        </motion.div>
      )}

      {/* Quarter detail cards */}
      <div className="space-y-6">
        {quarters.map((q, i) => {
          const layer = strata.find(l => l.quarter === q);
          const qUpdates = updates.filter(u => u.quarter === q);
          const contextNotes = qUpdates.filter(u => u.contextNote).map(u => u.contextNote);
          const managerComment = comments.find(c => c.quarter === q);

          if (!layer?.isComplete) {
            return (
              <div
                key={q}
                className="p-4"
                style={{ border: "1px dashed rgba(122,92,62,0.2)", borderRadius: "2px" }}
              >
                <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#C9A97A" }}>
                  {QUARTER_LABELS[q]}
                </p>
                <p className="text-sm mt-1 font-serif italic" style={{ color: "rgba(122,92,62,0.4)" }}>
                  This layer has not yet formed.
                </p>
              </div>
            );
          }

          return (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="overflow-hidden"
              style={{ border: "1px solid rgba(122,92,62,0.12)", borderRadius: "2px" }}
            >
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{
                  borderBottom: "1px solid rgba(122,92,62,0.08)",
                  borderLeft: `3px solid ${depthToHex(layer.depth)}`,
                  background: "#F5F0E8",
                }}
              >
                <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#7A5C3E" }}>
                  {QUARTER_LABELS[q]}
                </p>
                <span className="text-xs capitalize" style={{ color: depthToHex(layer.depth) }}>
                  {layer.depth} layer
                </span>
              </div>

              <div className="p-5">
                {/* Context notes — the private archive */}
                {contextNotes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: "#C9A97A" }}>
                      Your words
                    </p>
                    {contextNotes.map((note, j) => (
                      <div key={j} className="flex gap-2">
                        <div className="w-0.5 flex-shrink-0 mt-0.5" style={{ background: "#C9A97A" }} />
                        <p className="text-sm font-serif italic leading-relaxed" style={{ color: "#4A5568" }}>
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Manager comment */}
                {managerComment && (
                  <div
                    className="p-3"
                    style={{ background: "rgba(122,92,62,0.04)", border: "1px solid rgba(122,92,62,0.08)", borderRadius: "2px" }}
                  >
                    <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "#C9A97A" }}>
                      Rajiv's note
                    </p>
                    <p className="text-sm font-serif italic leading-relaxed" style={{ color: "#4A5568" }}>
                      "{managerComment.commentText}"
                    </p>
                  </div>
                )}

                {/* Goal scores */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {qUpdates.map(u => {
                    const goal = sheet?.goals.find(g => g.id === u.goalId);
                    if (!goal) return null;
                    return (
                      <div key={u.id} className="flex items-center justify-between py-1">
                        <p className="text-xs truncate" style={{ color: "#7A5C3E", maxWidth: "120px" }}>
                          {goal.title.slice(0, 22)}…
                        </p>
                        <span className="text-xs font-semibold" style={{ color: depthToHex(scoreToDepth(u.computedScore)) }}>
                          {Math.round(u.computedScore)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
