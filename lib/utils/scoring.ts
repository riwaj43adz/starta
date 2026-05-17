import type {
  UoMType,
  StratumDepth,
  StratumLayer,
  Goal,
  QuarterlyUpdate,
  Quarter,
} from "@/lib/types";

/**
 * Compute achievement score based on Unit of Measurement type
 */
export function computeScore(
  uomType: UoMType,
  targetValue: number,
  actualValue: number
): number {
  switch (uomType) {
    case "numeric_max": {
      if (targetValue === 0) return 100;
      const pct = (actualValue / targetValue) * 100;
      return Math.min(Math.max(pct, 0), 150);
    }
    case "numeric_min": {
      if (actualValue <= targetValue) return 100;
      if (targetValue === 0) return 0;
      const overage = (actualValue - targetValue) / targetValue;
      return Math.max(0, 100 - overage * 100);
    }
    case "zero_based": {
      if (actualValue === 0) return 100;
      return Math.max(0, 100 - actualValue * 20);
    }
    case "timeline": {
      if (targetValue === 0) return 100;
      return Math.min((actualValue / targetValue) * 100, 100);
    }
    default:
      return 0;
  }
}

/**
 * Map score to geological depth
 */
export function scoreToDepth(score: number): StratumDepth {
  if (score >= 90) return "deep";
  if (score >= 70) return "solid";
  if (score >= 50) return "growing";
  if (score >= 30) return "light";
  if (score > 0) return "thin";
  return "empty";
}

/**
 * Get Tailwind color class for stratum depth
 */
export function depthToColor(depth: StratumDepth): string {
  switch (depth) {
    case "deep":    return "bg-amber-500";
    case "solid":   return "bg-amber-700";
    case "growing": return "bg-green-600";
    case "light":   return "bg-amber-300";
    case "thin":    return "bg-slate-500";
    case "empty":   return "bg-neutral-800";
  }
}

/**
 * Get hex color for stratum depth (for use in SVG/canvas)
 */
export function depthToHex(depth: StratumDepth): string {
  switch (depth) {
    case "deep":    return "var(--brand-amber)";
    case "solid":   return "var(--layer-solid)";
    case "growing": return "var(--layer-growing)";
    case "light":   return "var(--layer-light)";
    case "thin":    return "var(--layer-thin)";
    case "empty":   return "var(--surface-border-strong)";
  }
}

/**
 * Human-readable score label
 */
export function scoreToLabel(score: number): string {
  if (score >= 90) return "Exceptional depth";
  if (score >= 70) return "Strong layer";
  if (score >= 50) return "Good progress";
  if (score >= 30) return "Forming";
  if (score > 0) return "Beginning";
  return "Not started";
}

/**
 * Compute average score for a quarter across all goals
 */
export function quarterAverageScore(
  goals: Goal[],
  updates: QuarterlyUpdate[],
  quarter: Quarter
): number {
  const quarterUpdates = updates.filter((u) => u.quarter === quarter);
  if (quarterUpdates.length === 0) return 0;

  let weightedScore = 0;
  let totalWeight = 0;

  for (const update of quarterUpdates) {
    const goal = goals.find((g) => g.id === update.goalId);
    if (!goal) continue;
    weightedScore += update.computedScore * goal.weightage;
    totalWeight += goal.weightage;
  }

  if (totalWeight === 0) return 0;
  return weightedScore / totalWeight;
}

/**
 * Build strata layers for display
 */
export function buildStratumLayers(
  goals: Goal[],
  allUpdates: QuarterlyUpdate[]
): StratumLayer[] {
  const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

  return quarters.map((quarter) => {
    const qUpdates = allUpdates.filter((u) => u.quarter === quarter);
    const isComplete = qUpdates.length > 0;

    if (!isComplete) {
      return {
        quarter,
        isComplete: false,
        averageScore: 0,
        depth: "empty",
      };
    }

    const avgScore = quarterAverageScore(goals, allUpdates, quarter);
    const contextNotes = qUpdates
      .filter((u) => u.contextNote)
      .map((u) => u.contextNote);

    return {
      quarter,
      isComplete: true,
      averageScore: avgScore,
      depth: scoreToDepth(avgScore),
      contextNote: contextNotes[0],
      submittedAt: qUpdates[0]?.submittedAt,
    };
  });
}

/**
 * Validate weightage distribution
 */
export function validateWeightage(goals: { weightage: number }[]): {
  isValid: boolean;
  total: number;
  message?: string;
} {
  const total = goals.reduce((sum, g) => sum + g.weightage, 0);

  if (total !== 100) {
    return {
      isValid: false,
      total,
      message: `Total is ${total}% — needs to be exactly 100%`,
    };
  }

  const underweight = goals.find((g) => g.weightage < 10);
  if (underweight) {
    return {
      isValid: false,
      total,
      message: "Each goal needs at least 10% weight to stand on its own.",
    };
  }

  if (goals.length > 8) {
    return {
      isValid: false,
      total,
      message: "A canvas holds a maximum of 8 goals.",
    };
  }

  return { isValid: true, total };
}

/**
 * Format score for display (graceful zero-based handling)
 */
export function formatScore(score: number, uomType: UoMType): string {
  if (uomType === "zero_based" && score === 100) {
    return "Zero achieved ✓";
  }
  return `${Math.round(score)}%`;
}
