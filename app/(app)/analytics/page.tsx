"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, BarChart, Bar, Cell,
  AreaChart, Area,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Star, Award, Target, Users, Clock, Sparkles } from "lucide-react";
import { useDataStore } from "@/lib/store/useDataStore";
import { useUserStore } from "@/lib/store/useUserStore";

/* ─── DATA ─── */
const radarData = [
  { axis: "Product", aarav: 87, team: 72 },
  { axis: "Leadership", axis2: "Leadership", aarav: 77, team: 65 },
  { axis: "Process", aarav: 75, team: 70 },
  { axis: "Learning", aarav: 60, team: 68 },
  { axis: "Compliance", aarav: 65, team: 80 },
  { axis: "Innovation", aarav: 82, team: 74 },
];

const trendData = [
  { quarter: "Q1 FY25", score: 34, target: 60 },
  { quarter: "Q2 FY25", score: 51, target: 65 },
  { quarter: "Q3 FY25", score: 63, target: 70 },
  { quarter: "Q4 FY25", score: 71, target: 72 },
  { quarter: "Q1 FY26", score: 44, target: 75 },
  { quarter: "Q2 FY26", score: 60, target: 78 },
  { quarter: "Q3 FY26", score: 81, target: 80 },
];

const weightageData = [
  { name: "Product Excellence", value: 40, color: "var(--brand-amber)" },
  { name: "Team Leadership",    value: 30, color: "var(--layer-solid)" },
  { name: "Process",            value: 20, color: "var(--layer-growing)" },
  { name: "Compliance",         value: 10, color: "var(--layer-light)" },
];

const teamHeatmap = [
  { name: "Aarav M.",  q1: 44, q2: 60, q3: 81, q4: 0,  dept: "Engineering" },
  { name: "Deepa K.",  q1: 98, q2: 97, q3: 96, q4: 0,  dept: "Engineering" },
  { name: "Kiran R.",  q1: 72, q2: 68, q3: 0,  q4: 0,  dept: "Engineering" },
  { name: "Meera P.",  q1: 65, q2: 0,  q3: 0,  q4: 0,  dept: "Engineering" },
];

function heatColor(v: number) {
  if (v === 0)   return "var(--surface-3)";
  if (v >= 90)   return "var(--brand-amber)";
  if (v >= 70)   return "var(--layer-solid)";
  if (v >= 50)   return "var(--layer-growing)";
  if (v >= 30)   return "var(--layer-light)";
  return "var(--layer-thin)";
}

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface-3)", border: "1px solid var(--surface-border)", borderRadius: 6, padding: "10px 14px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
        {payload[0]?.payload?.axis}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, margin: "2px 0" }}>
          {p.name === "aarav" ? "You" : "Team avg"}: <strong>{p.value}%</strong>
        </p>
      ))}
    </div>
  );
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface-3)", border: "1px solid var(--surface-border)", borderRadius: 6, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, margin: "2px 0" }}>
          {p.name === "score" ? "Your score" : "Target"}: <strong>{p.value}%</strong>
        </p>
      ))}
    </div>
  );
};

const stagger = (i: number) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.07 } });

export default function AnalyticsPage() {
  const { currentUser } = useUserStore();
  const { goalSheets, updates } = useDataStore();
  const [insightLoading, setInsightLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const currentScore = 81;
  const prevScore = 60;
  const delta = currentScore - prevScore;

  const generateAIInsight = () => {
    setInsightLoading(true);
    setTimeout(() => {
      setInsight("Gemini Analysis: Your Q3 Context Notes highlight a dramatic shift in focus towards rapid execution to accommodate the market pivot. This aligns with your 81% Product score, outperforming the team average. However, your Learning & Development score (60%) suggests this hyper-focus on execution has limited time for new skill acquisition. Suggestion for Q4: Reallocate 10% weight from Product Excellence into Learning to prevent long-term burnout and skill stagnation.");
      setInsightLoading(false);
    }, 1500);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div {...stagger(0)} className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="text-label" style={{ marginBottom: 6 }}>Performance Analytics · FY 2025–26</div>
            <h1 className="text-display-lg">{currentUser?.name ?? "Aarav Mehta"}</h1>
            <p className="text-body" style={{ marginTop: 4 }}>{currentUser?.role ?? "Product Manager"} · {currentUser?.department ?? "Engineering"} · 3 quarters reported</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost">Export PDF</button>
            <button className="btn-secondary" style={{ fontSize: 12 }}>Share with manager</button>
          </div>
        </div>
      </motion.div>

      {/* AI Insights Card */}
      <motion.div {...stagger(1)} className="card" style={{ marginBottom: 24, padding: 24, background: "var(--surface-2)", border: "1px solid var(--surface-border-strong)", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: insight ? 16 : 0 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--brand-amber-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={16} style={{ color: "var(--brand-amber)" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>Strata Intelligence</h3>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>AI-powered behavioral and performance synthesis</p>
            </div>
          </div>
          {!insight && !insightLoading && (
            <button className="btn-primary" onClick={generateAIInsight}>
              Generate Analysis
            </button>
          )}
          {insightLoading && (
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--brand-amber)", display: "flex", alignItems: "center", gap: 8 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Sparkles size={14} /></motion.div>
              Analyzing context record...
            </span>
          )}
        </div>
        {insight && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ borderTop: "1px dashed var(--surface-border)", paddingTop: 16 }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)" }}>
              {insight}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Current Score", value: `${currentScore}%`, delta: `+${delta}pp vs Q2`, dir: "up", icon: TrendingUp, color: "var(--brand-amber)" },
          { label: "Goal Completion", value: "3 / 4", delta: "75% on track", dir: "flat", icon: Target, color: "var(--status-success)" },
          { label: "Context Notes", value: "7", delta: "Rich qualitative record", dir: "up", icon: Star, color: "var(--status-info)" },
          { label: "Team Rank", value: "#2 / 4", delta: "Up from #3 in Q2", dir: "up", icon: Award, color: "var(--layer-solid)" },
        ].map(({ label, value, delta, dir, icon: Icon, color }, i) => (
          <motion.div key={label} {...stagger(i + 2)} className="metric-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="metric-label">{label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: `color-mix(in srgb, ${color} 15%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={13} style={{ color }} />
              </div>
            </div>
            <div className="metric-value">{value}</div>
            <div className={`metric-delta ${dir}`}>
              {dir === "up" ? "↑" : dir === "down" ? "↓" : "—"} {delta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14, marginBottom: 14 }}>
        {/* Radar / Spider chart */}
        <motion.div {...stagger(5)} className="chart-container">
          <div className="chart-title">Competency Radar</div>
          <div className="chart-subtitle">Your performance vs. team average across thrust areas</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} cx="50%" cy="50%">
              <PolarGrid stroke="var(--surface-border)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 10.5, fill: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}
              />
              <Radar
                name="team"
                dataKey="team"
                stroke="var(--layer-thin)"
                fill="var(--surface-3)"
                strokeWidth={1.5}
              />
              <Radar
                name="aarav"
                dataKey="aarav"
                stroke="var(--brand-amber)"
                fill="var(--brand-amber-dim)"
                strokeWidth={2}
                dot={{ fill: "var(--brand-amber)", r: 3 }}
              />
              <Tooltip content={<CustomRadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            {[{ color: "var(--brand-amber)", label: "You" }, { color: "var(--layer-thin)", label: "Team avg" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Score trend line */}
        <motion.div {...stagger(6)} className="chart-container">
          <div className="chart-title">Achievement Trajectory</div>
          <div className="chart-subtitle">Weighted score over 7 quarters with target benchmark</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--brand-amber)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--brand-amber)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--surface-border)" strokeDasharray="4 4" />
              <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "var(--text-tertiary)", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomLineTooltip />} />
              <Area type="monotone" dataKey="score" name="score" stroke="var(--brand-amber)" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: "var(--brand-amber)", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="target" name="target" stroke="var(--text-tertiary)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* Team Heatmap */}
        <motion.div {...stagger(7)} className="chart-container">
          <div className="chart-title">Team Performance Heatmap</div>
          <div className="chart-subtitle">Weighted quarterly scores — Engineering team</div>
          <div style={{ overflowX: "auto", marginTop: 4 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 380 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", paddingBottom: 10, paddingRight: 12, width: 100 }}>Member</th>
                  {["Q1", "Q2", "Q3", "Q4"].map(q => (
                    <th key={q} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", paddingBottom: 10, width: 72 }}>{q}</th>
                  ))}
                  <th style={{ textAlign: "right", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", paddingBottom: 10 }}>Avg</th>
                </tr>
              </thead>
              <tbody>
                {teamHeatmap.map((row, i) => {
                  const vals = [row.q1, row.q2, row.q3, row.q4].filter(v => v > 0);
                  const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
                  const isYou = row.name.startsWith("Aarav");
                  return (
                    <tr key={row.name} style={{ borderTop: "1px solid var(--surface-border)" }}>
                      <td style={{ padding: "10px 12px 10px 0", fontSize: 12.5, fontWeight: isYou ? 600 : 400, color: isYou ? "var(--brand-amber)" : "var(--text-secondary)" }}>
                        {row.name}{isYou ? " ★" : ""}
                      </td>
                      {[row.q1, row.q2, row.q3, row.q4].map((v, j) => (
                        <td key={j} style={{ textAlign: "center", padding: "8px 4px" }}>
                          <div style={{
                            margin: "0 auto", width: 52, height: 32,
                            borderRadius: 5,
                            background: heatColor(v),
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11.5, fontWeight: 600,
                            color: v === 0 ? "var(--text-tertiary)" : "var(--surface-0)",
                          }}>
                            {v === 0 ? "—" : `${v}%`}
                          </div>
                        </td>
                      ))}
                      <td style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: avg >= 80 ? "var(--brand-amber)" : "var(--text-secondary)", paddingLeft: 8 }}>
                        {avg > 0 ? `${avg}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Heatmap legend */}
          <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Score depth:</span>
            {[
              { color: "var(--layer-thin)", label: "<50%" },
              { color: "var(--layer-light)", label: "50–69%" },
              { color: "var(--layer-growing)", label: "70–79%" },
              { color: "var(--layer-solid)", label: "80–89%" },
              { color: "var(--brand-amber)", label: "≥90%" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 14, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Context archive strip */}
      <motion.div {...stagger(9)} className="chart-container" style={{ marginTop: 0 }}>
        <div className="chart-title">Qualitative Record — Context Notes Archive</div>
        <div className="chart-subtitle">Your words from each quarter, permanently filed. Not overwritten, not summarised away.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 4 }}>
          {[
            { q: "Q2", note: "Our main project pivoted in June after a market shift. I rebuilt the roadmap alone over two weekends. The metrics don't show that, but it was the hardest quarter of my career.", score: 44, depth: "thin" },
            { q: "Q3", note: "Finally shipped the dashboard. Got very little sleep but it's live. Users are logging in. Saw someone use it in a meeting last week and felt something I haven't felt since I started here.", score: 81, depth: "deep" },
          ].map(({ q, note, score, depth }) => (
            <div key={q} style={{ background: "var(--surface-3)", borderRadius: 8, padding: "14px 16px", borderLeft: `2px solid ${depth === "deep" ? "var(--brand-amber)" : "var(--layer-thin)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="text-label">{q} — Your words</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: depth === "deep" ? "var(--brand-amber)" : "var(--text-secondary)" }}>{score}%</span>
              </div>
              <p style={{ fontSize: 13, fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.65 }}>"{note}"</p>
            </div>
          ))}
          <div style={{ background: "var(--surface-3)", borderRadius: 8, padding: "14px 16px", border: "1px dashed var(--surface-border)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Clock size={20} style={{ color: "var(--text-tertiary)" }} />
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", textAlign: "center" }}>Q4 opens April 1, 2026</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
