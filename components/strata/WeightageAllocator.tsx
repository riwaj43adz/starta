"use client";

import { motion } from "framer-motion";

interface WeightageAllocatorProps {
  goals: { id: string; title: string; weightage: number; thrustArea?: string }[];
  onWeightageChange?: (goalId: string, newWeight: number) => void;
  readOnly?: boolean;
}

const COLORS = [
  "var(--status-danger)",
  "var(--brand-amber)",
  "var(--status-success)",
  "var(--layer-growing)",
  "var(--layer-solid)",
  "var(--status-info)",
];

export default function WeightageAllocator({
  goals,
  onWeightageChange,
  readOnly = false,
}: WeightageAllocatorProps) {
  const total = goals.reduce((s, g) => s + g.weightage, 0);
  const isComplete = total === 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Bar */}
      <div
        style={{ position: "relative", height: 16, display: "flex", overflow: "hidden", borderRadius: 2, background: "var(--surface-border-strong)" }}
        role="img"
        aria-label={`Weight distribution: ${total}% allocated`}
      >
        {goals.map((goal, i) => {
          const pct = (goal.weightage / 100) * 100;
          return (
            <motion.div
              key={goal.id}
              style={{
                width: `${pct}%`,
                backgroundColor: COLORS[i % COLORS.length],
                height: "100%",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          );
        })}

        {/* Completion glow */}
        {isComplete && (
          <motion.div
            style={{ position: "absolute", inset: 0, background: "var(--brand-amber-glow)", pointerEvents: "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, times: [0, 0.5, 1] }}
          />
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {goals.map((goal, i) => (
          <div key={goal.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{ width: 8, height: 8, borderRadius: 2, flexShrink: 0, background: COLORS[i % COLORS.length] }}
            />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {goal.title.slice(0, 24)}{goal.title.length > 24 ? "…" : ""}
            </span>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}
            >
              {goal.weightage}%
            </span>
          </div>
        ))}
      </div>

      {/* Total indicator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          {goals.length} {goals.length === 1 ? "goal" : "goals"} ·{" "}
          {isComplete ? (
            <span style={{ color: "var(--status-success)" }}>Fully weighted</span>
          ) : total < 100 ? (
            <span style={{ color: "var(--brand-amber)" }}>
              {100 - total}% remaining
            </span>
          ) : (
            <span style={{ color: "var(--status-danger)" }}>
              {total - 100}% over — reduce a goal
            </span>
          )}
        </span>
        <span
          style={{ fontSize: 14, fontWeight: 600, color: isComplete ? "var(--status-success)" : total > 100 ? "var(--status-danger)" : "var(--brand-amber)" }}
        >
          {total}%
        </span>
      </div>

      {/* Gentle validation message */}
      {!readOnly && total !== 100 && goals.length > 0 && (
        <p style={{ fontSize: 12, fontStyle: "italic", color: "var(--text-tertiary)", marginTop: 4 }}>
          {total < 100
            ? "Adjust the weights until they reach 100% — every goal needs its proper weight."
            : "One of these goals needs a little less weight to make room for the others."}
        </p>
      )}
    </div>
  );
}
