"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import { getTeamForManager, GOAL_SHEETS, getUserGoalSheet, getUserUpdates, PRE_MEETING_BRIEFS } from "@/lib/data/seed";
import { buildStratumLayers, depthToHex } from "@/lib/utils/scoring";
import StratumBar from "@/components/strata/StratumBar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { FileCheck, MessageSquare, ChevronRight, TrendingUp, Clock, AlertTriangle } from "lucide-react";
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
    submitted: { label: "Needs review", color: "#E8A23A", bg: "rgba(232,162,58,0.12)" },
    locked:    { label: "Approved",     color: "#4A9B6E", bg: "rgba(74,155,110,0.12)" },
    approved:  { label: "Approved",     color: "#4A9B6E", bg: "rgba(74,155,110,0.12)" },
    draft:     { label: "Draft",        color: "#6B6B7B", bg: "rgba(107,107,123,0.12)" },
    returned:  { label: "Returned",     color: "#C4503A", bg: "rgba(196,80,58,0.12)" },
  };
  const st = sheet ? statusMap[sheet.status] : { label: "No canvas", color: "#6B6B7B", bg: "rgba(107,107,123,0.1)" };

  return (
    <motion.div {...s(idx)} className="card card-md card-hover" style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(232,162,58,0.12)", border: "1px solid rgba(232,162,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#E8A23A", flexShrink: 0 }}>
            {getInitials(user.name)}
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>{user.role} · {user.department}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {hasBrief && (
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, background: "rgba(74,122,232,0.15)", color: "#6B9CE8" }}>Brief ready</span>
          )}
          <span style={{ fontSize: 9.5, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: st.bg, color: st.color }}>{st.label}</span>
        </div>
      </div>

      <StratumBar layers={strata} size="sm" showLabels animate />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
          {formed.length}/4 layers · {sheet?.goals.length ?? 0} goals
        </div>
        {latest && (
          <div style={{ fontSize: 13, fontWeight: 700, color: depthToHex(latest.depth) }}>
            Q{formed.length}: {Math.round(latest.averageScore)}%
          </div>
        )}
      </div>

      {sheet?.intentionStatement && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 11.5, fontFamily: "DM Serif Display", fontStyle: "italic", color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
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
          <div className="text-label" style={{ marginBottom: 6 }}>The Lens · Manager View</div>
          <h1 className="text-display-lg">Engineering Team</h1>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}>{team.length} direct reports · FY 2025–26</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/lens/check-in-room"><button className="btn-secondary" style={{ fontSize: 12 }}>Check-in Room</button></Link>
          <Link href="/lens/approvals"><button className="btn-primary">Approvals {pending.length > 0 && `(${pending.length})`}</button></Link>
        </div>
      </motion.div>

      {/* Alert banner */}
      {pending.length > 0 && (
        <motion.div {...s(1)} style={{ padding: "12px 16px", background: "rgba(232,162,58,0.07)", border: "1px solid rgba(232,162,58,0.2)", borderRadius: 8, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={15} style={{ color: "#E8A23A", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            <strong style={{ color: "#E8A23A" }}>{pending.length} canvas{pending.length > 1 ? "es" : ""}</strong> waiting for your review — each is someone's intention for the year.
          </span>
          <Link href="/lens/approvals" style={{ marginLeft: "auto" }}>
            <button className="btn-ghost" style={{ fontSize: 12, color: "#E8A23A" }}>Review now <ChevronRight size={11} /></button>
          </Link>
        </motion.div>
      )}

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Team Avg Score", value: "78%", note: "↑ 8pp from Q2", color: "#E8A23A" },
          { label: "Check-ins Submitted", value: "3/4", note: "Q3 — Meera pending", color: "#5B8C6E" },
          { label: "Canvases Approved", value: "2/4", note: "2 pending review", color: "#4A7A9B" },
          { label: "Briefs Ready", value: `${PRE_MEETING_BRIEFS.length}`, note: "Pre-meeting intel", color: "#9B7A5B" },
        ].map(({ label, value, note, color }, i) => (
          <motion.div key={label} {...s(i + 2)} className="metric-card">
            <span className="metric-label">{label}</span>
            <div className="metric-value" style={{ fontSize: "1.75rem", color }}>{value}</div>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{note}</span>
          </motion.div>
        ))}
      </div>

      {/* Team grid + radar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {team.map((member, i) => {
          const sheet = getUserGoalSheet(member.id);
          return <MemberCard key={member.id} user={member} sheet={sheet} idx={i + 6} />;
        })}
      </div>

      {/* Team radar comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
        <motion.div {...s(10)} className="chart-container">
          <div className="chart-title">Team Competency Comparison</div>
          <div className="chart-subtitle">Across 6 thrust areas — Q3 performance</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={teamRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10.5, fill: "rgba(255,255,255,0.4)", fontFamily: "DM Sans" }} />
              <Radar name="Aarav" dataKey="aarav" stroke="#E8A23A" fill="rgba(232,162,58,0.08)" strokeWidth={1.8} dot={false} />
              <Radar name="Deepa" dataKey="deepa" stroke="#5B8C6E" fill="rgba(91,140,110,0.06)" strokeWidth={1.8} dot={false} />
              <Radar name="Kiran" dataKey="kiran" stroke="#4A7A9B" fill="rgba(74,122,155,0.05)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              <Radar name="Meera" dataKey="meera" stroke="#9B7A5B" fill="rgba(155,122,91,0.05)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              <Tooltip contentStyle={{ background: "#242428", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            {[
              { name: "Aarav", color: "#E8A23A" }, { name: "Deepa", color: "#5B8C6E" },
              { name: "Kiran", color: "#4A7A9B" }, { name: "Meera", color: "#9B7A5B" },
            ].map(l => (
              <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{l.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pre-meeting briefs */}
        <motion.div {...s(11)} className="card card-md">
          <div className="card-header">
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Pre-Meeting Briefs</div>
            <Link href="/lens/check-in-room">
              <button className="btn-ghost" style={{ fontSize: 11 }}>Open room <ChevronRight size={10} /></button>
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PRE_MEETING_BRIEFS.map(brief => (
              <div key={brief.id} style={{ padding: "12px 14px", background: "var(--surface-3)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)" }}>{brief.employee?.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", background: "rgba(74,122,232,0.15)", color: "#6B9CE8", borderRadius: 3 }}>{brief.quarter}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{brief.whatChanged}</p>
                <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(232,162,58,0.06)", borderLeft: "2px solid rgba(232,162,58,0.4)", borderRadius: "0 4px 4px 0" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,162,58,0.7)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Focus: </span>
                  <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)" }}>{brief.suggestedFocus.slice(0, 90)}…</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
