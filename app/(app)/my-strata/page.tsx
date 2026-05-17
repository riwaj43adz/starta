"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import { getUserGoalSheet, getUserUpdates, ACTIVE_CYCLE, getCheckInComments } from "@/lib/data/seed";
import { buildStratumLayers, depthToHex, scoreToDepth } from "@/lib/utils/scoring";
import StratumBar from "@/components/strata/StratumBar";
import Link from "next/link";
import { ChevronRight, Clock, TrendingUp, AlertCircle, CheckCircle, Star } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const sparkData = [
  { v: 34 }, { v: 51 }, { v: 63 }, { v: 71 },
  { v: 44 }, { v: 60 }, { v: 81 },
];

const s = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.06 },
});

export default function MyStrataPage() {
  const { currentUser } = useUserStore();
  if (!currentUser) return null;

  const sheet = getUserGoalSheet(currentUser.id);
  const updates = getUserUpdates(currentUser.id);
  const comments = sheet ? getCheckInComments(sheet.id) : [];
  const strata = sheet ? buildStratumLayers(sheet.goals, updates) : [];
  const formedLayers = strata.filter(l => l.isComplete);
  const latestLayer = formedLayers[formedLayers.length - 1];
  const currentScore = latestLayer?.averageScore ?? 0;

  return (
    <div className="page-container">
      {/* Header row */}
      <motion.div {...s(0)} className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="text-label" style={{ marginBottom: 6 }}>{ACTIVE_CYCLE.name} · Goal Dashboard</div>
          <h1 className="text-display-lg">{currentUser.name}</h1>
          {sheet?.intentionStatement && (
            <p style={{ fontFamily: "DM Serif Display, serif", fontStyle: "italic", fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 6, maxWidth: 520 }}>
              "{sheet.intentionStatement}"
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Link href="/analytics"><button className="btn-secondary" style={{ fontSize: 12 }}>View Analytics</button></Link>
          <Link href="/check-in"><button className="btn-primary">Q3 Check-in</button></Link>
        </div>
      </motion.div>

      {/* Top KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Q3 Score", value: `${Math.round(currentScore)}%`, note: "↑ 21pp from Q2", ok: true },
          { label: "Goals Active", value: `${sheet?.goals.length ?? 0}`, note: "4 of 4 on canvas", ok: true },
          { label: "Layers Formed", value: `${formedLayers.length} / 4`, note: "Q4 opens Apr 2026", ok: null },
          { label: "Status", value: sheet?.status ?? "No canvas", note: sheet?.isFirstSubmission ? "First-year employee" : "Annual cycle", ok: null },
        ].map(({ label, value, note, ok }, i) => (
          <motion.div key={label} {...s(i + 1)} className="metric-card">
            <span className="metric-label">{label}</span>
            <div className="metric-value" style={{ fontSize: "1.75rem" }}>{value}</div>
            <span style={{ fontSize: 11, color: ok === true ? "#4A9B6E" : ok === false ? "#C4503A" : "rgba(255,255,255,0.35)" }}>{note}</span>
          </motion.div>
        ))}
      </div>

      {/* Main 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, alignItems: "start" }}>
        {/* Left — Stratum + goals */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Stratum visualization */}
          {sheet && (
            <motion.div {...s(5)} className="card card-lg">
              <div className="card-header">
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Your Year's Depth</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 2 }}>{formedLayers.length} of 4 strata formed</div>
                </div>
                <Link href="/layers">
                  <button className="btn-ghost" style={{ fontSize: 11 }}>Full history <ChevronRight size={11} /></button>
                </Link>
              </div>

              {/* The stratum */}
              <div style={{ marginBottom: 16 }}>
                <StratumBar layers={strata} size="lg" showLabels animate />
              </div>

              {/* Quarter detail row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {(["Q1","Q2","Q3","Q4"] as const).map((q) => {
                  const layer = strata.find(l => l.quarter === q);
                  return (
                    <div key={q} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{q}</div>
                      {layer?.isComplete ? (
                        <>
                          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "DM Serif Display", color: depthToHex(layer.depth) }}>
                            {Math.round(layer.averageScore)}%
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "capitalize", marginTop: 1 }}>{layer.depth}</div>
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.15)", marginTop: 4 }}>—</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sparkline trend */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>Score trend (7 quarters)</div>
                <ResponsiveContainer width="100%" height={48}>
                  <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E8A23A" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#E8A23A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#E8A23A" strokeWidth={1.5} fill="url(#sg2)" dot={false} />
                    <Tooltip contentStyle={{ display: "none" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Goals */}
          {sheet && (
            <motion.div {...s(6)} className="card card-md">
              <div className="card-header">
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  Goal Canvas <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-tertiary)" }}>{sheet.goals.length} goals · {sheet.status}</span>
                </div>
                <Link href="/canvas"><button className="btn-ghost" style={{ fontSize: 11 }}>View canvas</button></Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sheet.goals.map((goal, i) => {
                  const latest = updates.filter(u => u.goalId === goal.id).sort((a,b) => b.submittedAt.localeCompare(a.submittedAt))[0];
                  const score = latest?.computedScore ?? 0;
                  const barColor = depthToHex(scoreToDepth(score));
                  const COLORS: Record<string, string> = {
                    "Product Excellence": "#E8A23A", "Technical Innovation": "#5B8C6E",
                    "Customer Success": "#4A7A9B", "Team Leadership": "#9B7A5B",
                    "Process Improvement": "#6B6B7B", "Compliance & Risk": "#C4503A",
                    "Learning & Development": "#7A6B9B",
                  };
                  const thrustColor = COLORS[goal.thrustArea] ?? "#9B7A5B";
                  return (
                    <div key={goal.id} style={{ padding: "13px 16px", background: "var(--surface-3)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: thrustColor, background: `${thrustColor}18`, padding: "2px 7px", borderRadius: 3 }}>
                              {goal.thrustArea}
                            </span>
                            {goal.isShared && <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)" }}>Shared</span>}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)", lineHeight: 1.3 }}>{goal.title}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "DM Serif Display", color: score > 0 ? barColor : "rgba(255,255,255,0.2)" }}>
                            {score > 0 ? `${Math.round(score)}%` : "—"}
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{goal.weightage}% weight</div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                        <motion.div
                          style={{ height: "100%", background: barColor, borderRadius: 2 }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(score, 100)}%` }}
                          transition={{ duration: 0.7, delay: 0.3 + i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                      </div>
                      {latest?.contextNote && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 12, fontFamily: "DM Serif Display, serif", fontStyle: "italic", color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>
                          "{latest.contextNote.slice(0, 120)}{latest.contextNote.length > 120 ? "…" : ""}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right — actions + manager comments */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Check-in CTA */}
          <motion.div {...s(7)}>
            <Link href="/check-in">
              <div style={{ padding: "16px 18px", background: "rgba(232,162,58,0.06)", border: "1px solid rgba(232,162,58,0.2)", borderRadius: 10, cursor: "pointer", transition: "all 250ms" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(232,162,58,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(232,162,58,0.06)")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(232,162,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock size={15} style={{ color: "#E8A23A" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.92)" }}>Q3 check-in is open</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Closes January 31</div>
                  </div>
                  <ChevronRight size={14} style={{ marginLeft: "auto", color: "#E8A23A" }} />
                </div>
                <div style={{ fontSize: 12, fontFamily: "DM Serif Display", fontStyle: "italic", color: "rgba(232,162,58,0.7)" }}>
                  Tell us what happened. Your words are the record.
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Quick actions */}
          <motion.div {...s(8)} className="card card-md">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "View performance analytics", href: "/analytics", icon: TrendingUp },
                { label: "See full layer history", href: "/layers", icon: CheckCircle },
                { label: "Edit goal canvas", href: "/canvas", icon: Star },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--surface-3)", borderRadius: 7, cursor: "pointer", transition: "background 200ms", fontSize: 12.5, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-4)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "var(--surface-3)")}
                  >
                    <Icon size={13} style={{ color: "rgba(255,255,255,0.35)" }} />
                    {label}
                    <ChevronRight size={11} style={{ marginLeft: "auto", color: "rgba(255,255,255,0.25)" }} />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Manager comments */}
          {comments.length > 0 && (
            <motion.div {...s(9)} className="card card-md">
              <div className="card-header">
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Manager Notes</div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Rajiv Sharma</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {comments.slice(-2).map(c => (
                  <div key={c.id} style={{ padding: "12px 14px", background: "var(--surface-3)", borderRadius: 8, borderLeft: "2px solid rgba(232,162,58,0.4)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(232,162,58,0.6)", marginBottom: 6 }}>{c.quarter}</div>
                    <p style={{ fontSize: 13, fontFamily: "DM Serif Display, serif", fontStyle: "italic", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                      "{c.commentText}"
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
