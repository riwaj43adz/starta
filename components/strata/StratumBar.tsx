"use client";

import { motion } from "framer-motion";
import type { StratumLayer, Quarter } from "@/lib/types";
import { depthToHex } from "@/lib/utils/scoring";
import { cn } from "@/lib/utils";

interface StratumBarProps {
  layers: StratumLayer[];
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  animate?: boolean;
  className?: string;
}

const QUARTER_LABELS: Record<Quarter, string> = {
  Q1: "Q1", Q2: "Q2", Q3: "Q3", Q4: "Q4",
};

const SIZE_HEIGHT: Record<string, string> = {
  sm: "6px", md: "10px", lg: "16px",
};

export default function StratumBar({
  layers, size = "md", showLabels = false, animate = true, className,
}: StratumBarProps) {
  const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

  const displayLayers = quarters.map((q) =>
    layers.find((l) => l.quarter === q) ?? {
      quarter: q, isComplete: false, averageScore: 0, depth: "empty" as const,
    }
  );

  return (
    <div className={cn("space-y-1", className)}>
      <div
        style={{ display: "flex", gap: "2px", overflow: "hidden", height: SIZE_HEIGHT[size] }}
        role="img"
        aria-label={`Stratum: ${displayLayers.map((l) => `${l.quarter}: ${l.isComplete ? l.depth : "pending"}`).join(", ")}`}
      >
        {displayLayers.map((layer, i) => (
          <motion.div
            key={layer.quarter}
            style={{
              flex: 1,
              transformOrigin: "left center",
              backgroundColor: layer.isComplete ? depthToHex(layer.depth) : "#E8E3D8",
            }}
            initial={animate ? { scaleX: 0, opacity: 0 } : false}
            animate={
              animate && layer.isComplete
                ? { scaleX: 1, opacity: 1 }
                : animate
                ? { scaleX: 1, opacity: 0.4 }
                : false
            }
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </div>

      {showLabels && (
        <div style={{ display: "flex", gap: "2px" }}>
          {displayLayers.map((layer) => (
            <div
              key={layer.quarter}
              style={{
                flex: 1, textAlign: "center",
                fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: layer.isComplete ? "#7A5C3E" : "#C9A97A",
              }}
            >
              {QUARTER_LABELS[layer.quarter]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
