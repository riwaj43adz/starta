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
    <div className="page-container" style={{ maxWidth: 860 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ marginBottom: 8, display: "flex", gap: 6, alignItems: "center" }}>
          <Archive size={12} />
          My Layers
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          Your depth, by quarter.
        </h1>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, color: "var(--text-tertiary)" }}>
          Your context archive. Accessible only to you. Permanently.
        </p>
      </motion.div>

      {/* Full stratum visualization */}
      {sheet && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: 24, marginBottom: 32, background: "var(--surface-3)" }}
        >
          <p className="text-label" style={{ marginBottom: 16 }}>
            FY 2025–26 · Complete Stratum
          </p>

          {/* Geological depth view */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {quarters.map((q, i) => {
              const layer = strata.find(l => l.quarter === q);
              const isComplete = layer?.isComplete;
              const color = isComplete ? (layer.depth === "deep" ? "var(--layer-deep)" : layer.depth === "solid" ? "var(--layer-solid)" : "var(--layer-growing)") : "var(--surface-border-strong)";

              return (
                <motion.div
                  key={q}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, width: 24, color: "var(--text-tertiary)" }}>{q}</span>
                  <div style={{ flex: 1, height: 12, background: color, borderRadius: 2 }} />
                  {isComplete && (
                    <span style={{ fontSize: 11, textTransform: "capitalize", color: "var(--text-secondary)" }}>
                      {layer.depth}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: "var(--text-tertiary)" }}>
            "{sheet.intentionStatement}"
          </p>
        </motion.div>
      )}

      {/* Quarter detail cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {quarters.map((q, i) => {
          const layer = strata.find(l => l.quarter === q);
          const qUpdates = updates.filter(u => u.quarter === q);
          const contextNotes = qUpdates.filter(u => u.contextNote).map(u => u.contextNote);
          const managerComment = comments.find(c => c.quarter === q);

          if (!layer?.isComplete) {
            return (
              <div
                key={q}
                className="card"
                style={{ padding: 20, border: "1px dashed var(--surface-border-strong)", background: "var(--surface-1)" }}
              >
                <p className="text-label" style={{ marginBottom: 4 }}>
                  {QUARTER_LABELS[q]}
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "var(--text-tertiary)" }}>
                  This layer has not yet formed.
                </p>
              </div>
            );
          }

          const layerColor = layer.depth === "deep" ? "var(--layer-deep)" : layer.depth === "solid" ? "var(--layer-solid)" : "var(--layer-growing)";

          return (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card"
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: "1px solid var(--surface-border)",
                  borderLeft: `3px solid ${layerColor}`,
                  background: "var(--surface-3)",
                }}
              >
                <p className="text-label">
                  {QUARTER_LABELS[q]}
                </p>
                <span style={{ fontSize: 11, textTransform: "capitalize", fontWeight: 600, color: layerColor }}>
                  {layer.depth} layer
                </span>
              </div>

              <div style={{ padding: 20 }}>
                {/* Context notes — the private archive */}
                {contextNotes.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <p className="text-label" style={{ color: "var(--brand-amber)", marginBottom: 8 }}>
                      Your words
                    </p>
                    {contextNotes.map((note, j) => (
                      <div key={j} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                        <div style={{ width: 2, flexShrink: 0, background: "var(--brand-amber)", borderRadius: 1 }} />
                        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.6 }}>
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Manager comment */}
                {managerComment && (
                  <div
                    className="card"
                    style={{ padding: 16, background: "var(--surface-1)", marginBottom: 20 }}
                  >
                    <p className="text-label" style={{ marginBottom: 6 }}>
                      Rajiv's note
                    </p>
                    <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      "{managerComment.commentText}"
                    </p>
                  </div>
                )}

                {/* Goal scores */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {qUpdates.map(u => {
                    const goal = sheet?.goals.find(g => g.id === u.goalId);
                    if (!goal) return null;
                    const scDepth = scoreToDepth(u.computedScore);
                    const scColor = scDepth === "deep" ? "var(--layer-deep)" : scDepth === "solid" ? "var(--layer-solid)" : "var(--layer-growing)";
                    
                    return (
                      <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>
                          {goal.title}
                        </p>
                        <span style={{ fontSize: 12, fontWeight: 600, color: scColor }}>
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
