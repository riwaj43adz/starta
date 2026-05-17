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
    "Product Excellence": "#C4603A",
    "Technical Innovation": "#4A5E3A",
    "Customer Success": "#D4913A",
    "Team Leadership": "#7A5C3E",
    "Process Improvement": "#7A9170",
    "Revenue Growth": "#4A5568",
    "Compliance & Risk": "#9E4A2A",
    "Learning & Development": "#C9A97A",
  };

  const thrustColor = thrustAreaColors[goal.thrustArea] ?? "#7A5C3E";

  return (
    <motion.div
      className={cn(
        "goal-card relative cursor-pointer group",
        onClick ? "hover:shadow-stratum-hover" : "",
        className
      )}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
    >
      {/* Left accent for shared goals */}
      {goal.isShared && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ background: "#D4913A" }}
        />
      )}

      {/* Thrust area tag */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-medium tracking-wide uppercase px-2 py-0.5"
          style={{
            background: `${thrustColor}15`,
            color: thrustColor,
            borderRadius: "1px",
          }}
        >
          {goal.thrustArea}
        </span>
        <div className="flex items-center gap-2">
          {goal.isShared && (
            <span
              className="text-xs tracking-wide"
              style={{ color: "#D4913A" }}
            >
              shared
            </span>
          )}
          <span
            className="text-xs font-medium"
            style={{ color: "#C9A97A" }}
          >
            {goal.weightage}%
          </span>
        </div>
      </div>

      {/* Goal title */}
      <h3
        className="font-serif text-base font-semibold mb-1 leading-snug"
        style={{ color: "#2C2A26" }}
      >
        {goal.title}
      </h3>

      {/* Description */}
      <p
        className="text-xs leading-relaxed mb-4"
        style={{ color: "#7A5C3E", opacity: 0.8 }}
      >
        {goal.description}
      </p>

      {/* Progress sediment indicator + UoM */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium px-2 py-0.5"
            style={{
              background: "rgba(122,92,62,0.08)",
              color: "#7A5C3E",
              borderRadius: "1px",
            }}
          >
            {UOM_SHORT[goal.uomType]}
          </span>
          <span className="text-xs" style={{ color: "#C9A97A" }}>
            Target: {goal.targetValue}
          </span>
        </div>

        {showProgress && latestUpdate && (
          <div className="flex items-center gap-2">
            {/* Sediment fill indicator */}
            <div
              className="w-12 h-1 relative overflow-hidden"
              style={{ background: "#E8E3D8", borderRadius: "1px" }}
            >
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ background: depthColor, borderRadius: "1px" }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(score, 100)}%` }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
            <span
              className="text-xs font-semibold"
              style={{ color: depthColor }}
            >
              {formatScore(score, goal.uomType)}
            </span>
          </div>
        )}

        {showProgress && !latestUpdate && (
          <span className="text-xs" style={{ color: "#E8E3D8" }}>
            Not yet updated
          </span>
        )}
      </div>

      {/* Latest context note preview */}
      {latestUpdate?.contextNote && (
        <div
          className="mt-3 pt-3 flex gap-2"
          style={{ borderTop: "1px solid rgba(122,92,62,0.08)" }}
        >
          <div
            className="w-0.5 flex-shrink-0 mt-0.5"
            style={{ background: "#C9A97A" }}
          />
          <p
            className="text-xs leading-relaxed font-serif italic line-clamp-2"
            style={{ color: "#7A5C3E" }}
          >
            {latestUpdate.contextNote}
          </p>
        </div>
      )}
    </motion.div>
  );
}
