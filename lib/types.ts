// ─── STRATA CORE TYPES ───

export type UserRole = "employee" | "manager" | "admin";

export type GoalSheetStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "locked"
  | "returned";

export type UoMType =
  | "numeric_max"
  | "numeric_min"
  | "timeline"
  | "zero_based";

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export type CheckInStatus = "not_started" | "on_track" | "completed";

export type StratumDepth = "deep" | "solid" | "growing" | "light" | "thin" | "empty";

// ─── USER ───
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId: string | null;
  department: string;
  avatarUrl?: string;
  isFirstYear: boolean;
}

// ─── CYCLE ───
export interface Cycle {
  id: string;
  year: number;
  name: string;
  goalSettingOpens: string;
  goalSettingCloses: string;
  q1Opens: string;
  q1Closes: string;
  q2Opens: string;
  q2Closes: string;
  q3Opens: string;
  q3Closes: string;
  q4Opens: string;
  q4Closes: string;
  isActive: boolean;
}

// ─── GOAL SHEET ───
export interface GoalSheet {
  id: string;
  userId: string;
  cycleId: string;
  intentionStatement: string;
  status: GoalSheetStatus;
  managerComment?: string;
  submittedAt?: string;
  approvedAt?: string;
  lockedAt?: string;
  isFirstSubmission: boolean;
  goals: Goal[];
  user?: User;
  manager?: User;
}

// ─── GOAL ───
export interface Goal {
  id: string;
  sheetId: string;
  thrustArea: string;
  title: string;
  description: string;
  uomType: UoMType;
  targetValue: number;
  weightage: number;
  isShared: boolean;
  sharedFromId?: string;
  isLocked: boolean;
  displayOrder: number;
  quarterlyUpdates?: QuarterlyUpdate[];
}

// ─── QUARTERLY UPDATE ───
export interface QuarterlyUpdate {
  id: string;
  goalId: string;
  quarter: Quarter;
  actualValue: number;
  status: CheckInStatus;
  contextNote: string;
  computedScore: number;
  isLate: boolean;
  submittedAt: string;
}

// ─── CHECK-IN COMMENT ───
export interface CheckInComment {
  id: string;
  sheetId: string;
  managerId: string;
  quarter: Quarter;
  commentText: string;
  createdAt: string;
  manager?: User;
}

// ─── SHARED GOAL ASSIGNMENT ───
export interface SharedGoalAssignment {
  id: string;
  sourceGoalId: string;
  recipientUserId: string;
  customWeightage: number;
  createdBy: string;
  createdAt: string;
}

// ─── AUDIT LOG ENTRY ───
export interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  actorId: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  createdAt: string;
  actor?: User;
}

// ─── PRE-MEETING BRIEF ───
export interface PreMeetingBrief {
  id: string;
  managerId: string;
  employeeId: string;
  quarter: Quarter;
  whatChanged: string;
  contextSummary: string;
  suggestedFocus: string;
  generatedAt: string;
  check_in_date?: string;
  employee?: User;
}

// ─── STRATUM LAYER (computed) ───
export interface StratumLayer {
  quarter: Quarter;
  isComplete: boolean;
  averageScore: number;
  depth: StratumDepth;
  contextNote?: string;
  submittedAt?: string;
}

// ─── TEAM MEMBER OVERVIEW ───
export interface TeamMemberOverview {
  user: User;
  goalSheet?: GoalSheet;
  strata: StratumLayer[];
  pendingAction?: "needs_approval" | "check_in_open" | "check_in_complete" | "no_sheet";
  currentQuarterStatus?: CheckInStatus;
}

// ─── THRUST AREAS ───
export const THRUST_AREAS = [
  "Product Excellence",
  "Technical Innovation",
  "Customer Success",
  "Team Leadership",
  "Process Improvement",
  "Revenue Growth",
  "Compliance & Risk",
  "Learning & Development",
] as const;

export type ThrustArea = (typeof THRUST_AREAS)[number];

// ─── UOM LABELS ───
export const UOM_LABELS: Record<UoMType, string> = {
  numeric_max: "Higher is better (e.g., revenue, users)",
  numeric_min: "Lower is better (e.g., defects, incidents)",
  timeline: "Milestone / date-based completion",
  zero_based: "Target zero (e.g., safety incidents)",
};

export const UOM_SHORT: Record<UoMType, string> = {
  numeric_max: "↑ Max",
  numeric_min: "↓ Min",
  timeline: "⌛ Timeline",
  zero_based: "◎ Zero",
};

// ─── QUARTER LABELS ───
export const QUARTER_LABELS: Record<Quarter, string> = {
  Q1: "Quarter 1 · July–September",
  Q2: "Quarter 2 · October–December",
  Q3: "Quarter 3 · January–March",
  Q4: "Quarter 4 · April–June",
};
