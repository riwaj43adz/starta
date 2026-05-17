"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface WeightageAllocatorProps {
  goals: { id: string; title: string; weightage: number; thrustArea?: string }[];
  onWeightageChange?: (goalId: string, newWeight: number) => void;
  readOnly?: boolean;
}

const COLORS = [
  "#C4603A", "#D4913A", "#7A9170", "#4A5E3A",
  "#7A5C3E", "#4A5568", "#9E4A2A", "#C9A97A",
];

export default function WeightageAllocator({
  goals,
  onWeightageChange,
  readOnly = false,
}: WeightageAllocatorProps) {
  const total = goals.reduce((s, g) => s + g.weightage, 0);
  const isComplete = total === 100;

  return (
    <div className="space-y-3">
      {/* Bar */}
      <div
        className="relative h-4 flex overflow-hidden"
        style={{ borderRadius: "1px", background: "#E8E3D8" }}
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
            className="absolute inset-0"
            style={{ background: "rgba(212,145,58,0.12)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, times: [0, 0.5, 1] }}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {goals.map((goal, i) => (
          <div key={goal.id} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-none flex-shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs" style={{ color: "#7A5C3E" }}>
              {goal.title.slice(0, 24)}{goal.title.length > 24 ? "…" : ""}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "#2C2A26" }}
            >
              {goal.weightage}%
            </span>
          </div>
        ))}
      </div>

      {/* Total indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "#C9A97A" }}>
          {goals.length} {goals.length === 1 ? "goal" : "goals"} ·{" "}
          {isComplete ? (
            <span style={{ color: "#7A9170" }}>Fully weighted</span>
          ) : total < 100 ? (
            <span style={{ color: "#D4913A" }}>
              {100 - total}% remaining
            </span>
          ) : (
            <span style={{ color: "#C4603A" }}>
              {total - 100}% over — reduce a goal
            </span>
          )}
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: isComplete ? "#7A9170" : total > 100 ? "#C4603A" : "#D4913A" }}
        >
          {total}%
        </span>
      </div>

      {/* Gentle validation message */}
      {!readOnly && total !== 100 && goals.length > 0 && (
        <p
          className="text-xs italic"
          style={{ color: "rgba(122,92,62,0.6)" }}
        >
          {total < 100
            ? "Adjust the weights until they reach 100% — every goal needs its proper weight."
            : "One of these goals needs a little less weight to make room for the others."}
        </p>
      )}
    </div>
  );
}
