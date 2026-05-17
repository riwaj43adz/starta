// ─── STRATA SEED DATA ───
// Realistic characters from the PRD: Aarav, Deepa, Rajiv, Priya

import type {
  User, Cycle, GoalSheet, Goal, QuarterlyUpdate,
  CheckInComment, AuditLogEntry, PreMeetingBrief,
} from "@/lib/types";

// ─── USERS ───
export const USERS: User[] = [
  {
    id: "user-rajiv",
    name: "Rajiv Sharma",
    email: "rajiv.sharma@acmecorp.in",
    role: "manager",
    managerId: null,
    department: "Engineering",
    isFirstYear: false,
  },
  {
    id: "user-priya",
    name: "Priya Nair",
    email: "priya.nair@acmecorp.in",
    role: "admin",
    managerId: null,
    department: "Human Resources",
    isFirstYear: false,
  },
  {
    id: "user-aarav",
    name: "Aarav Mehta",
    email: "aarav.mehta@acmecorp.in",
    role: "employee",
    managerId: "user-rajiv",
    department: "Engineering",
    isFirstYear: true,
  },
  {
    id: "user-deepa",
    name: "Deepa Krishnan",
    email: "deepa.krishnan@acmecorp.in",
    role: "employee",
    managerId: "user-rajiv",
    department: "Engineering",
    isFirstYear: false,
  },
  {
    id: "user-kiran",
    name: "Kiran Rao",
    email: "kiran.rao@acmecorp.in",
    role: "employee",
    managerId: "user-rajiv",
    department: "Engineering",
    isFirstYear: false,
  },
  {
    id: "user-meera",
    name: "Meera Pillai",
    email: "meera.pillai@acmecorp.in",
    role: "employee",
    managerId: "user-rajiv",
    department: "Engineering",
    isFirstYear: false,
  },
];

// ─── ACTIVE CYCLE ───
export const ACTIVE_CYCLE: Cycle = {
  id: "cycle-fy2526",
  year: 2025,
  name: "FY 2025–26",
  goalSettingOpens: "2025-05-01",
  goalSettingCloses: "2025-05-31",
  q1Opens: "2025-07-01",
  q1Closes: "2025-07-31",
  q2Opens: "2025-10-01",
  q2Closes: "2025-10-31",
  q3Opens: "2026-01-01",
  q3Closes: "2026-01-31",
  q4Opens: "2026-04-01",
  q4Closes: "2026-04-30",
  isActive: true,
};

// ─── AARAV'S GOALS ───
export const AARAV_GOALS: Goal[] = [
  {
    id: "goal-aarav-1",
    sheetId: "sheet-aarav",
    thrustArea: "Product Excellence",
    title: "Ship Product Analytics Dashboard",
    description: "Design, build and launch a self-serve analytics dashboard for the platform team with 100 weekly active users by Q3.",
    uomType: "numeric_max",
    targetValue: 100,
    weightage: 40,
    isShared: false,
    isLocked: true,
    displayOrder: 1,
  },
  {
    id: "goal-aarav-2",
    sheetId: "sheet-aarav",
    thrustArea: "Team Leadership",
    title: "Achieve 80% OKR Alignment Across Engineering",
    description: "Facilitate quarterly OKR sync sessions and ensure engineering team goals align with product roadmap.",
    uomType: "numeric_max",
    targetValue: 80,
    weightage: 30,
    isShared: false,
    isLocked: true,
    displayOrder: 2,
  },
  {
    id: "goal-aarav-3",
    sheetId: "sheet-aarav",
    thrustArea: "Process Improvement",
    title: "Stakeholder Communication Framework",
    description: "Establish a structured weekly comms rhythm with product, design, and business stakeholders.",
    uomType: "timeline",
    targetValue: 4,
    weightage: 20,
    isShared: false,
    isLocked: true,
    displayOrder: 3,
  },
  {
    id: "goal-aarav-shared",
    sheetId: "sheet-aarav",
    thrustArea: "Compliance & Risk",
    title: "Platform Security Compliance",
    description: "Achieve 100% security scan coverage across all services as part of the team-wide compliance initiative.",
    uomType: "numeric_max",
    targetValue: 100,
    weightage: 10,
    isShared: true,
    sharedFromId: "goal-shared-security",
    isLocked: true,
    displayOrder: 4,
  },
];

// ─── DEEPA'S GOALS ───
export const DEEPA_GOALS: Goal[] = [
  {
    id: "goal-deepa-1",
    sheetId: "sheet-deepa",
    thrustArea: "Technical Innovation",
    title: "Achieve 99.9% Platform Uptime",
    description: "Drive reliability improvements across core services, targeting 99.9% availability across all quarters.",
    uomType: "numeric_max",
    targetValue: 99.9,
    weightage: 35,
    isShared: false,
    isLocked: true,
    displayOrder: 1,
  },
  {
    id: "goal-deepa-2",
    sheetId: "sheet-deepa",
    thrustArea: "Learning & Development",
    title: "Complete Architecture Knowledge Transfer",
    description: "Document and transfer architectural knowledge of legacy systems to 3 junior engineers by Q2.",
    uomType: "timeline",
    targetValue: 3,
    weightage: 25,
    isShared: false,
    isLocked: true,
    displayOrder: 2,
  },
  {
    id: "goal-deepa-3",
    sheetId: "sheet-deepa",
    thrustArea: "Technical Innovation",
    title: "Lead 3 Architecture Reviews",
    description: "Conduct formal architecture reviews for 3 major product initiatives, with documented recommendations.",
    uomType: "numeric_max",
    targetValue: 3,
    weightage: 25,
    isShared: false,
    isLocked: true,
    displayOrder: 3,
  },
  {
    id: "goal-deepa-shared",
    sheetId: "sheet-deepa",
    thrustArea: "Compliance & Risk",
    title: "Platform Security Compliance",
    description: "Achieve 100% security scan coverage across all services.",
    uomType: "numeric_max",
    targetValue: 100,
    weightage: 15,
    isShared: true,
    sharedFromId: "goal-shared-security",
    isLocked: true,
    displayOrder: 4,
  },
];

// ─── KIRAN'S GOALS ───
const KIRAN_GOALS: Goal[] = [
  {
    id: "goal-kiran-1",
    sheetId: "sheet-kiran",
    thrustArea: "Technical Innovation",
    title: "Migrate 4 Services to New Infra Stack",
    description: "Lead the migration of legacy services to the new Kubernetes-based infrastructure.",
    uomType: "numeric_max",
    targetValue: 4,
    weightage: 50,
    isShared: false,
    isLocked: false,
    displayOrder: 1,
  },
  {
    id: "goal-kiran-2",
    sheetId: "sheet-kiran",
    thrustArea: "Learning & Development",
    title: "Earn AWS Solutions Architect Certification",
    description: "Complete the AWS SAA-C03 certification by Q2.",
    uomType: "timeline",
    targetValue: 1,
    weightage: 30,
    isShared: false,
    isLocked: false,
    displayOrder: 2,
  },
  {
    id: "goal-kiran-shared",
    sheetId: "sheet-kiran",
    thrustArea: "Compliance & Risk",
    title: "Platform Security Compliance",
    description: "Achieve 100% security scan coverage across all services.",
    uomType: "numeric_max",
    targetValue: 100,
    weightage: 20,
    isShared: true,
    sharedFromId: "goal-shared-security",
    isLocked: false,
    displayOrder: 3,
  },
];

// ─── MEERA'S GOALS ───
const MEERA_GOALS: Goal[] = [
  {
    id: "goal-meera-1",
    sheetId: "sheet-meera",
    thrustArea: "Customer Success",
    title: "Reduce P1 Incident Response Time to <2hr",
    description: "Improve on-call process and runbooks to consistently resolve P1 incidents within 2 hours.",
    uomType: "numeric_min",
    targetValue: 2,
    weightage: 45,
    isShared: false,
    isLocked: false,
    displayOrder: 1,
  },
  {
    id: "goal-meera-2",
    sheetId: "sheet-meera",
    thrustArea: "Process Improvement",
    title: "Implement Weekly Engineering Health Metrics",
    description: "Define and publish a weekly engineering health dashboard covering velocity, quality, and reliability.",
    uomType: "timeline",
    targetValue: 1,
    weightage: 35,
    isShared: false,
    isLocked: false,
    displayOrder: 2,
  },
  {
    id: "goal-meera-shared",
    sheetId: "sheet-meera",
    thrustArea: "Compliance & Risk",
    title: "Platform Security Compliance",
    description: "Achieve 100% security scan coverage.",
    uomType: "numeric_max",
    targetValue: 100,
    weightage: 20,
    isShared: true,
    sharedFromId: "goal-shared-security",
    isLocked: false,
    displayOrder: 3,
  },
];

// ─── GOAL SHEETS ───
export const GOAL_SHEETS: GoalSheet[] = [
  {
    id: "sheet-aarav",
    userId: "user-aarav",
    cycleId: "cycle-fy2526",
    intentionStatement: "To be known as the PM who shipped something real — not just documented, not just planned, but actually in the hands of users and making their work easier.",
    status: "locked",
    submittedAt: "2025-05-08T10:30:00Z",
    approvedAt: "2025-05-10T14:20:00Z",
    lockedAt: "2025-05-10T14:20:00Z",
    isFirstSubmission: true,
    goals: AARAV_GOALS,
  },
  {
    id: "sheet-deepa",
    userId: "user-deepa",
    cycleId: "cycle-fy2526",
    intentionStatement: "To do work that lasts longer than the sprint it was built in. To make the systems around me more trustworthy, and the engineers around me more capable.",
    status: "locked",
    submittedAt: "2025-05-06T09:00:00Z",
    approvedAt: "2025-05-09T11:15:00Z",
    lockedAt: "2025-05-09T11:15:00Z",
    isFirstSubmission: false,
    goals: DEEPA_GOALS,
  },
  {
    id: "sheet-kiran",
    userId: "user-kiran",
    cycleId: "cycle-fy2526",
    intentionStatement: "To stop being the person who keeps the lights on and start being the person who redesigns the electrical grid. I want to leave this team with infrastructure they can trust for the next five years.",
    status: "submitted",
    submittedAt: "2025-05-20T11:00:00Z",
    isFirstSubmission: false,
    goals: KIRAN_GOALS,
  },
  {
    id: "sheet-meera",
    userId: "user-meera",
    cycleId: "cycle-fy2526",
    intentionStatement: "I want to build something that makes the next incident a learning moment rather than a crisis. This year is about turning chaos into systems.",
    status: "submitted",
    submittedAt: "2025-05-22T09:30:00Z",
    isFirstSubmission: true,
    goals: MEERA_GOALS,
  },
];

// ─── QUARTERLY UPDATES ───
export const QUARTERLY_UPDATES: QuarterlyUpdate[] = [
  // Aarav Q1
  {
    id: "qu-aarav-1-q1",
    goalId: "goal-aarav-1",
    quarter: "Q1",
    actualValue: 12,
    status: "on_track",
    contextNote: "",
    computedScore: 12,
    isLate: false,
    submittedAt: "2025-07-28T16:00:00Z",
  },
  {
    id: "qu-aarav-2-q1",
    goalId: "goal-aarav-2",
    quarter: "Q1",
    actualValue: 45,
    status: "on_track",
    contextNote: "",
    computedScore: 56,
    isLate: false,
    submittedAt: "2025-07-28T16:00:00Z",
  },
  // Aarav Q2 — the pivot quarter
  {
    id: "qu-aarav-1-q2",
    goalId: "goal-aarav-1",
    quarter: "Q2",
    actualValue: 28,
    status: "on_track",
    contextNote: "Our main project pivoted in June after a market shift. I rebuilt the roadmap alone over two weekends. The metrics don't show that, but it was the hardest quarter of my career. We're back on track now with a stronger foundation.",
    computedScore: 28,
    isLate: false,
    submittedAt: "2025-10-24T18:30:00Z",
  },
  {
    id: "qu-aarav-2-q2",
    goalId: "goal-aarav-2",
    quarter: "Q2",
    actualValue: 62,
    status: "on_track",
    contextNote: "",
    computedScore: 77,
    isLate: false,
    submittedAt: "2025-10-24T18:30:00Z",
  },
  {
    id: "qu-aarav-3-q2",
    goalId: "goal-aarav-3",
    quarter: "Q2",
    actualValue: 3,
    status: "on_track",
    contextNote: "",
    computedScore: 75,
    isLate: false,
    submittedAt: "2025-10-24T18:30:00Z",
  },
  // Aarav Q3 — shipped the dashboard
  {
    id: "qu-aarav-1-q3",
    goalId: "goal-aarav-1",
    quarter: "Q3",
    actualValue: 87,
    status: "completed",
    contextNote: "Finally shipped the dashboard. Got very little sleep but it's live. Users are logging in. Saw someone use it in a meeting last week and felt something I haven't felt since I started here.",
    computedScore: 87,
    isLate: false,
    submittedAt: "2026-01-26T20:00:00Z",
  },
  {
    id: "qu-aarav-2-q3",
    goalId: "goal-aarav-2",
    quarter: "Q3",
    actualValue: 74,
    status: "on_track",
    contextNote: "",
    computedScore: 92,
    isLate: false,
    submittedAt: "2026-01-26T20:00:00Z",
  },
  // Deepa Q1
  {
    id: "qu-deepa-1-q1",
    goalId: "goal-deepa-1",
    quarter: "Q1",
    actualValue: 99.91,
    status: "completed",
    contextNote: "The reliability work is invisible until something breaks. I'm choosing not to let things break. Three near-incidents averted through proactive monitoring changes I made in May.",
    computedScore: 100,
    isLate: false,
    submittedAt: "2025-07-25T11:00:00Z",
  },
  {
    id: "qu-deepa-shared-q1",
    goalId: "goal-deepa-shared",
    quarter: "Q1",
    actualValue: 65,
    status: "on_track",
    contextNote: "",
    computedScore: 65,
    isLate: false,
    submittedAt: "2025-07-25T11:00:00Z",
  },
  // Deepa Q2
  {
    id: "qu-deepa-1-q2",
    goalId: "goal-deepa-1",
    quarter: "Q2",
    actualValue: 99.94,
    status: "completed",
    contextNote: "Spent 40% of this quarter unblocking junior engineers who were stuck on infrastructure issues. Their productivity tripled after I cleared the path. None of this shows up in my goals. I want it on record.",
    computedScore: 100,
    isLate: false,
    submittedAt: "2025-10-22T09:30:00Z",
  },
  {
    id: "qu-deepa-2-q2",
    goalId: "goal-deepa-2",
    quarter: "Q2",
    actualValue: 3,
    status: "completed",
    contextNote: "All three engineers can now navigate the legacy codebase independently. One of them already found and fixed a bug I had missed. That's the goal.",
    computedScore: 100,
    isLate: false,
    submittedAt: "2025-10-22T09:30:00Z",
  },
  // Deepa Q3
  {
    id: "qu-deepa-1-q3",
    goalId: "goal-deepa-1",
    quarter: "Q3",
    actualValue: 99.97,
    status: "completed",
    contextNote: "Three junior engineers deployed to production independently for the first time this quarter. I was more proud of that than anything in my own metrics. The reliability numbers are a side effect of good engineering culture, not the goal itself.",
    computedScore: 100,
    isLate: false,
    submittedAt: "2026-01-20T14:00:00Z",
  },
  {
    id: "qu-deepa-3-q3",
    goalId: "goal-deepa-3",
    quarter: "Q3",
    actualValue: 2,
    status: "on_track",
    contextNote: "",
    computedScore: 67,
    isLate: false,
    submittedAt: "2026-01-20T14:00:00Z",
  },
];

// ─── CHECK-IN COMMENTS ───
export const CHECKIN_COMMENTS: CheckInComment[] = [
  {
    id: "cc-rajiv-aarav-q2",
    sheetId: "sheet-aarav",
    managerId: "user-rajiv",
    quarter: "Q2",
    commentText: "Aarav — I only learned about the pivot last week. Thank you for handling it without escalating. That took judgment. Let's talk in our next 1:1 about how you want to use this story going forward — it speaks to something important about how you work.",
    createdAt: "2025-11-02T10:00:00Z",
  },
  {
    id: "cc-rajiv-aarav-q3",
    sheetId: "sheet-aarav",
    managerId: "user-rajiv",
    quarter: "Q3",
    commentText: "The dashboard launch was a real milestone. What I noticed most was not the metric — it was that you stayed calm in the last two weeks when the timeline was under pressure. That's the quality I want to see grow.",
    createdAt: "2026-01-30T09:30:00Z",
  },
  {
    id: "cc-rajiv-deepa-q1",
    sheetId: "sheet-deepa",
    managerId: "user-rajiv",
    quarter: "Q1",
    commentText: "The reliability numbers speak for themselves. But the three near-incidents you mentioned — I want those documented in your achievement report. That's exactly the kind of preventive work that disappears in most systems.",
    createdAt: "2025-08-05T11:00:00Z",
  },
  {
    id: "cc-rajiv-deepa-q2",
    sheetId: "sheet-deepa",
    managerId: "user-rajiv",
    quarter: "Q2",
    commentText: "The junior mentorship work you described is exactly the kind of leadership we need to recognize formally. I'm noting this explicitly for your appraisal. The tripling of their productivity — that is a team achievement with your name on it.",
    createdAt: "2025-11-01T14:30:00Z",
  },
  {
    id: "cc-rajiv-deepa-q3",
    sheetId: "sheet-deepa",
    managerId: "user-rajiv",
    quarter: "Q3",
    commentText: "Three independent production deployments. I remember when those three were afraid to open a terminal alone. What you built — the confidence, the skill, the judgment — that does not show up in any dashboard, and it is among the most important things that happened on this team this year.",
    createdAt: "2026-01-28T16:00:00Z",
  },
];

// ─── AUDIT LOG ───
export const AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "audit-1",
    entityType: "goal",
    entityId: "goal-aarav-1",
    actorId: "user-rajiv",
    action: "unlock_and_edit",
    fieldName: "target_value",
    oldValue: "120",
    newValue: "100",
    reason: "Discussed with Aarav — Q1 context made the original target unrealistic given the pivot. Adjusted to reflect the revised roadmap scope.",
    createdAt: "2025-10-15T10:00:00Z",
  },
  {
    id: "audit-2",
    entityType: "goal_sheet",
    entityId: "sheet-aarav",
    actorId: "user-priya",
    action: "admin_note",
    fieldName: "status",
    oldValue: "locked",
    newValue: "locked",
    reason: "Annual review preparation — verified all Q1-Q3 data. Context notes for Q2 are strong. Flagged for appraisal committee review.",
    createdAt: "2026-02-01T09:00:00Z",
  },
  {
    id: "audit-3",
    entityType: "cycle",
    entityId: "cycle-fy2526",
    actorId: "user-priya",
    action: "extend_q3_window",
    fieldName: "q3_closes",
    oldValue: "2026-01-24",
    newValue: "2026-01-31",
    reason: "Extended Q3 check-in window by one week due to the Bengaluru office network outage affecting submission access.",
    createdAt: "2026-01-25T08:00:00Z",
  },
];

// ─── PRE-MEETING BRIEFS ───
export const PRE_MEETING_BRIEFS: PreMeetingBrief[] = [
  {
    id: "brief-rajiv-aarav-q3",
    managerId: "user-rajiv",
    employeeId: "user-aarav",
    quarter: "Q3",
    whatChanged: "Aarav submitted Q3 check-in on Jan 26. Dashboard reached 87 WAU — 87% of annual target. OKR alignment at 74%, trending toward completion. Q3 marks 3 consecutive on-track quarters.",
    contextSummary: "Context note from Q3: \"Finally shipped the dashboard. Got very little sleep but it's live.\" He mentioned feeling something he hasn't felt since joining. Q2 note referenced rebuilding the roadmap alone after a market pivot.",
    suggestedFocus: "Acknowledge the fatigue behind the milestone. Ask how he's feeling about the pace, not just the output. This is a good moment to talk about what's next for Q4 with intentionality.",
    generatedAt: "2026-01-29T08:00:00Z",
    check_in_date: "2026-01-30",
    employee: USERS.find(u => u.id === "user-aarav"),
  },
  {
    id: "brief-rajiv-deepa-q3",
    managerId: "user-rajiv",
    employeeId: "user-deepa",
    quarter: "Q3",
    whatChanged: "Deepa submitted Q3 on Jan 20. Uptime at 99.97% — effectively perfect. Architecture review at 2/3. Three junior engineers deployed independently for the first time.",
    contextSummary: "Context note: \"Three junior engineers deployed to production independently for the first time. I was more proud of that than anything in my own metrics.\" Consistent pattern: she consistently flags mentorship work that doesn't appear in her formal goals.",
    suggestedFocus: "The junior deployment milestone deserves explicit recognition in your conversation, not just in comments. Ask her what she wants the recognition to look like — some people want public acknowledgment, others prefer it noted privately for the appraisal.",
    generatedAt: "2026-01-29T08:00:00Z",
    check_in_date: "2026-01-30",
    employee: USERS.find(u => u.id === "user-deepa"),
  },
];

// ─── CURRENT USER (for demo — switches based on role demo) ───
export function getDemoUser(role: "employee" | "manager" | "admin" = "employee"): User {
  if (role === "manager") return USERS.find(u => u.id === "user-rajiv")!;
  if (role === "admin") return USERS.find(u => u.id === "user-priya")!;
  return USERS.find(u => u.id === "user-aarav")!;
}

export function getUserGoalSheet(userId: string): GoalSheet | undefined {
  return GOAL_SHEETS.find(s => s.userId === userId);
}

export function getUserUpdates(userId: string): QuarterlyUpdate[] {
  const sheet = getUserGoalSheet(userId);
  if (!sheet) return [];
  const goalIds = sheet.goals.map(g => g.id);
  return QUARTERLY_UPDATES.filter(u => goalIds.includes(u.goalId));
}

export function getTeamForManager(managerId: string): User[] {
  return USERS.filter(u => u.managerId === managerId);
}

export function getCheckInComments(sheetId: string): CheckInComment[] {
  return CHECKIN_COMMENTS.filter(c => c.sheetId === sheetId);
}
