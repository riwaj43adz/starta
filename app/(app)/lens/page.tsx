"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import { getTeamForManager, GOAL_SHEETS, getUserGoalSheet, getUserUpdates, PRE_MEETING_BRIEFS } from "@/lib/data/seed";
import { buildStratumLayers } from "@/lib/utils/scoring";
import StratumBar from "@/components/strata/StratumBar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, AlertTriangle } from "lucide-react";
import type { GoalSheet, User } from "@/lib/types";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const s = (i: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.07 } });

const teamRadar = [
  { axis: "Product",  aarav: 87, deepa: 80, kiran: 72, meera: 65 },
  { axis: "Leadership", aarav: 77, deepa: 60, kiran: 55, meera: 70 },
  { axis: "Process",  aarav: 75, deepa: 90, kiran: 68, meera: 72 },
  { axis: "Learning", aarav: 60, deepa: 85, kiran: 80, meera: 68 },
  { axis: "Compliance",aarav: 65, deepa: 95, kiran: 75, meera: 60 },
  { axis: "Innovation",aarav: 82, deepa: 78, kiran: 65, meera: 62 },
];

function MemberCard({ user, sheet, idx }: { user: User; sheet?: GoalSheet; idx: number }) {
  const updates = getUserUpdates(user.id);
  const strata = sheet ? buildStratumLayers(sheet.goals, updates) : [];
  const formed = strata.filter(l => l.isComplete);
  const latest = formed[formed.length - 1];
  const hasBrief = PRE_MEETING_BRIEFS.some(b => b.employeeId === user.id);

  const statusMap = {
    submitted: { label: "Needs review", color: "var(--brand-amber)" },
    locked:    { label: "Approved",     color: "var(--status-success)" },
    approved:  { label: "Approved",     color: "var(--status-success)" },
    draft:     { label: "Draft",        color: "var(--text-tertiary)" },
    returned:  { label: "Returned",     color: "var(--status-danger)" },
  };
  const st = sheet ? statusMap[sheet.status] : { label: "No canvas", color: "var(--text-tertiary)" };

  return (
    <motion.div {...s(idx)} className="card card-hover" style={{ position: "relative", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--brand-amber-dim)", border: "1px solid rgba(232,162,58,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--brand-amber)", flexShrink: 0 }}>
            {getInitials(user.name)}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{user.role} · {user.department}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {hasBrief && (
            <span className="badge badge-blue">Brief ready</span>
          )}
          <span style={{ fontSize: 11, fontWeight: 600, color: st.color }}>{st.label}</span>
        </div>
      </div>

      <StratumBar layers={strata} size="sm" showLabels animate />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          {formed.length}/4 layers · {sheet?.goals.length ?? 0} goals
        </div>
        {latest && (
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
            Q{formed.length}: {Math.round(latest.averageScore)}%
          </div>
        )}
      </div>

      {sheet?.intentionStatement && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--surface-border-strong)", fontSize: 13, fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          "{sheet.intentionStatement.slice(0, 100)}…"
        </div>
      )}
    </motion.div>
  );
}

export default function LensPage() {
  const { currentUser } = useUserStore();
  if (!currentUser) return null;
  const team = getTeamForManager(currentUser.id);
  const pending = GOAL_SHEETS.filter(s => team.some(m => m.id === s.userId) && s.status === "submitted");

  return (
    <div className="page-container">
      <motion.div {...s(0)} className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="text-label" style={{ marginBottom: 8 }}>The Lens · Manager View</div>
          <h1 className="text-display-lg">Engineering Team</h1>
          <p style={{ fontSize: 14, color: "var(--text-tertiary)", marginTop: 8 }}>{team.length} direct reports · FY 2025–26</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/lens/check-in-room"><button className="btn-secondary">Check-in Room</button></Link>
          <Link href="/lens/approvals"><button className="btn-primary">Approvals {pending.length > 0 && `(${pending.length})`}</button></Link>
        </div>
      </motion.div>

      {/* Alert banner */}
      {pending.length > 0 && (
        <motion.div {...s(1)} className="card" style={{ padding: "16px 20px", background: "var(--brand-amber-glow)", borderLeft: "3px solid var(--brand-amber)", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
          <AlertTriangle size={18} style={{ color: "var(--brand-amber)", flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: "var(--text-primary)" }}>
            <strong style={{ color: "var(--brand-amber)" }}>{pending.length} canvas{pending.length > 1 ? "es" : ""}</strong> waiting for your review — each is someone's intention for the year.
          </span>
          <Link href="/lens/approvals" style={{ marginLeft: "auto" }}>
            <button className="btn-ghost" style={{ color: "var(--brand-amber)" }}>Review now <ChevronRight size={14} /></button>
          </Link>
        </motion.div>
      )}

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Team Avg Score", value: "78%", note: "↑ 8pp from Q2", color: "var(--brand-amber)" },
          { label: "Check-ins Submitted", value: "3/4", note: "Q3 — Meera pending", color: "var(--status-success)" },
          { label: "Canvases Approved", value: "2/4", note: "2 pending review", color: "var(--status-info)" },
          { label: "Briefs Ready", value: `${PRE_MEETING_BRIEFS.length}`, note: "Pre-meeting intel", color: "var(--layer-solid)" },
        ].map(({ label, value, note, color }, i) => (
          <motion.div key={label} {...s(i + 2)} className="metric-card">
            <span className="metric-label">{label}</span>
            <div className="metric-value" style={{ color }}>{value}</div>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{note}</span>
          </motion.div>
        ))}
      </div>

      {/* Team grid + radar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {team.map((member, i) => {
          const sheet = getUserGoalSheet(member.id);
          return <MemberCard key={member.id} user={member} sheet={sheet} idx={i + 6} />;
        })}
      </div>

      {/* Team radar comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
        <motion.div {...s(10)} className="chart-container">
          <div className="chart-title">Team Competency Comparison</div>
          <div className="chart-subtitle">Across 6 thrust areas — Q3 performance</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={teamRadar}>
              <PolarGrid stroke="var(--surface-border)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "var(--text-secondary)", fontFamily: "var(--font-body)" }} />
              <Radar name="Aarav" dataKey="aarav" stroke="#E8A23A" fill="rgba(232,162,58,0.1)" strokeWidth={1.8} dot={false} />
              <Radar name="Deepa" dataKey="deepa" stroke="#5B8C6E" fill="rgba(91,140,110,0.1)" strokeWidth={1.8} dot={false} />
              <Radar name="Kiran" dataKey="kiran" stroke="#4A7A9B" fill="rgba(74,122,155,0.1)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              <Radar name="Meera" dataKey="meera" stroke="#9B7A5B" fill="rgba(155,122,91,0.1)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              <Tooltip contentStyle={{ background: "var(--surface-3)", border: "1px solid var(--surface-border)", borderRadius: 6, fontSize: 12, color: "var(--text-primary)" }} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
            {[
              { name: "Aarav", color: "#E8A23A" }, { name: "Deepa", color: "#5B8C6E" },
              { name: "Kiran", color: "#4A7A9B" }, { name: "Meera", color: "#9B7A5B" },
            ].map(l => (
              <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 3, background: l.color, borderRadius: 1.5 }} />
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{l.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pre-meeting briefs */}
        <motion.div {...s(11)} className="card">
          <div className="card-header" style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Pre-Meeting Briefs</div>
            <Link href="/lens/check-in-room">
              <button className="btn-ghost">Open room <ChevronRight size={14} /></button>
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px 24px" }}>
            {PRE_MEETING_BRIEFS.map(brief => (
              <div key={brief.id} style={{ padding: 16, background: "var(--surface-3)", borderRadius: "var(--radius-lg)", border: "1px solid var(--surface-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{brief.employee?.name}</span>
                  <span className="badge badge-blue">{brief.quarter}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{brief.whatChanged}</p>
                <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--brand-amber-glow)", borderLeft: "2px solid var(--brand-amber)", borderRadius: "0 4px 4px 0" }}>
                  <span className="text-label" style={{ color: "var(--brand-amber)" }}>Focus: </span>
                  <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{brief.suggestedFocus.slice(0, 90)}…</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
