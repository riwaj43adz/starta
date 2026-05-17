"use client";

import { motion } from "framer-motion";
import type { Goal, QuarterlyUpdate } from "@/lib/types";
import { UOM_SHORT } from "@/lib/types";
import { scoreToDepth, depthToHex, formatScore } from "@/lib/utils/scoring";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  updates?: QuarterlyUpdate[];
  showProgress?: boolean;
  className?: string;
  onClick?: () => void;
  index?: number;
}

export default function GoalCard({
  goal,
  updates = [],
  showProgress = true,
  className,
  onClick,
  index = 0,
}: GoalCardProps) {
  const latestUpdate = updates
    .filter((u) => u.goalId === goal.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];

  const score = latestUpdate?.computedScore ?? 0;
  const depth = latestUpdate ? scoreToDepth(score) : "empty";
  const depthColor = depthToHex(depth);

  const thrustAreaColors: Record<string, string> = {
    "Product Excellence": "var(--status-danger)",
    "Technical Innovation": "var(--layer-growing)",
    "Customer Success": "var(--brand-amber)",
    "Team Leadership": "var(--layer-solid)",
    "Process Improvement": "var(--status-success)",
    "Revenue Growth": "var(--status-info)",
    "Compliance & Risk": "var(--status-danger)",
    "Learning & Development": "var(--layer-light)",
  };

  const thrustColor = thrustAreaColors[goal.thrustArea] ?? "var(--text-tertiary)";

  return (
    <motion.div
      className={cn(
        "card relative",
        onClick ? "card-hover" : "",
        className
      )}
      style={{ padding: 20, display: "flex", flexDirection: "column" }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
    >
      {/* Left accent for shared goals */}
      {goal.isShared && (
        <div
          style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--brand-amber)" }}
        />
      )}

      {/* Thrust area tag */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <span
          className="text-label"
          style={{
            padding: "2px 6px",
            background: `color-mix(in srgb, ${thrustColor} 15%, transparent)`,
            color: thrustColor,
            borderRadius: 2,
          }}
        >
          {goal.thrustArea}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {goal.isShared && (
            <span className="badge badge-amber">
              shared
            </span>
          )}
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)" }}>
            {goal.weightage}%
          </span>
        </div>
      </div>

      {/* Goal title */}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4, lineHeight: 1.3 }}>
        {goal.title}
      </h3>

      {/* Description */}
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
        {goal.description}
      </p>

      {/* Progress sediment indicator + UoM */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="badge badge-neutral">
            {UOM_SHORT[goal.uomType]}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
            Target: {goal.targetValue}
          </span>
        </div>

        {showProgress && latestUpdate && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Sediment fill indicator */}
            <div
              style={{ width: 48, height: 4, position: "relative", overflow: "hidden", background: "var(--surface-border-strong)", borderRadius: 2 }}
            >
              <motion.div
                style={{ position: "absolute", inset: "0 auto 0 0", background: depthColor, borderRadius: 2 }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(score, 100)}%` }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: depthColor }}>
              {formatScore(score, goal.uomType)}
            </span>
          </div>
        )}

        {showProgress && !latestUpdate && (
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
            Not yet updated
          </span>
        )}
      </div>

      {/* Latest context note preview */}
      {latestUpdate?.contextNote && (
        <div
          style={{ marginTop: 12, paddingTop: 12, display: "flex", gap: 8, borderTop: "1px solid var(--surface-border)" }}
        >
          <div style={{ width: 2, flexShrink: 0, marginTop: 2, background: "var(--text-tertiary)" }} />
          <p style={{ fontSize: 13, lineHeight: 1.6, fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {latestUpdate.contextNote}
          </p>
        </div>
      )}
    </motion.div>
  );
}
