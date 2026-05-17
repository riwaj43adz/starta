"use client";

import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, BarChart, Bar, Cell,
  AreaChart, Area,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Star, Award, Target, Users, Clock } from "lucide-react";

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
  { name: "Product Excellence", value: 40, color: "#E8A23A" },
  { name: "Team Leadership",    value: 30, color: "#9B7A5B" },
  { name: "Process",            value: 20, color: "#5B8C6E" },
  { name: "Compliance",         value: 10, color: "#4A7A9B" },
];

const teamHeatmap = [
  { name: "Aarav M.",  q1: 44, q2: 60, q3: 81, q4: 0,  dept: "Engineering" },
  { name: "Deepa K.",  q1: 98, q2: 97, q3: 96, q4: 0,  dept: "Engineering" },
  { name: "Kiran R.",  q1: 72, q2: 68, q3: 0,  q4: 0,  dept: "Engineering" },
  { name: "Meera P.",  q1: 65, q2: 0,  q3: 0,  q4: 0,  dept: "Engineering" },
];

function heatColor(v: number) {
  if (v === 0)   return "#1C1C1F";
  if (v >= 90)   return "rgba(232,162,58,0.85)";
  if (v >= 70)   return "rgba(155,122,91,0.75)";
  if (v >= 50)   return "rgba(91,140,110,0.7)";
  if (v >= 30)   return "rgba(74,122,155,0.7)";
  return "rgba(107,107,123,0.6)";
}

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#242428", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "10px 14px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>
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
    <div style={{ background: "#242428", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{label}</p>
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
  const currentScore = 81;
  const prevScore = 60;
  const delta = currentScore - prevScore;

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div {...stagger(0)} className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="text-label" style={{ marginBottom: 6 }}>Performance Analytics · FY 2025–26</div>
            <h1 className="text-display-lg">Aarav Mehta</h1>
            <p className="text-body" style={{ marginTop: 4 }}>Product Manager · Engineering · 3 quarters reported</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost">Export PDF</button>
            <button className="btn-secondary" style={{ fontSize: 12 }}>Share with manager</button>
          </div>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Current Score", value: `${currentScore}%`, delta: `+${delta}pp vs Q2`, dir: "up", icon: TrendingUp, color: "#E8A23A" },
          { label: "Goal Completion", value: "3 / 4", delta: "75% on track", dir: "flat", icon: Target, color: "#5B8C6E" },
          { label: "Context Notes", value: "7", delta: "Rich qualitative record", dir: "up", icon: Star, color: "#4A7A9B" },
          { label: "Team Rank", value: "#2 / 4", delta: "Up from #3 in Q2", dir: "up", icon: Award, color: "#9B7A5B" },
        ].map(({ label, value, delta, dir, icon: Icon, color }, i) => (
          <motion.div key={label} {...stagger(i + 1)} className="metric-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="metric-label">{label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 10.5, fill: "rgba(255,255,255,0.45)", fontFamily: "DM Sans" }}
              />
              <Radar
                name="team"
                dataKey="team"
                stroke="rgba(107,107,123,0.6)"
                fill="rgba(107,107,123,0.08)"
                strokeWidth={1.5}
              />
              <Radar
                name="aarav"
                dataKey="aarav"
                stroke="#E8A23A"
                fill="rgba(232,162,58,0.12)"
                strokeWidth={2}
                dot={{ fill: "#E8A23A", r: 3 }}
              />
              <Tooltip content={<CustomRadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            {[{ color: "#E8A23A", label: "You" }, { color: "rgba(107,107,123,0.6)", label: "Team avg" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{l.label}</span>
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
                  <stop offset="5%"  stopColor="#E8A23A" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#E8A23A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomLineTooltip />} />
              <Area type="monotone" dataKey="score" name="score" stroke="#E8A23A" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: "#E8A23A", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="target" name="target" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
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
                  <th style={{ textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", paddingBottom: 10, paddingRight: 12, width: 100 }}>Member</th>
                  {["Q1", "Q2", "Q3", "Q4"].map(q => (
                    <th key={q} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", paddingBottom: 10, width: 72 }}>{q}</th>
                  ))}
                  <th style={{ textAlign: "right", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", paddingBottom: 10 }}>Avg</th>
                </tr>
              </thead>
              <tbody>
                {teamHeatmap.map((row, i) => {
                  const vals = [row.q1, row.q2, row.q3, row.q4].filter(v => v > 0);
                  const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
                  const isYou = row.name.startsWith("Aarav");
                  return (
                    <tr key={row.name} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "10px 12px 10px 0", fontSize: 12.5, fontWeight: isYou ? 600 : 400, color: isYou ? "var(--brand-amber)" : "rgba(255,255,255,0.7)" }}>
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
                            color: v === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.9)",
                          }}>
                            {v === 0 ? "—" : `${v}%`}
                          </div>
                        </td>
                      ))}
                      <td style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: avg >= 80 ? "#E8A23A" : "rgba(255,255,255,0.55)", paddingLeft: 8 }}>
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
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Score depth:</span>
            {[
              { color: "rgba(107,107,123,0.6)", label: "<50%" },
              { color: "rgba(74,122,155,0.7)", label: "50–69%" },
              { color: "rgba(91,140,110,0.7)", label: "70–79%" },
              { color: "rgba(155,122,91,0.75)", label: "80–89%" },
              { color: "rgba(232,162,58,0.85)", label: "≥90%" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 14, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weightage bar + goal breakdown */}
        <motion.div {...stagger(8)} className="chart-container">
          <div className="chart-title">Goal Weight Distribution</div>
          <div className="chart-subtitle">Canvas allocation for FY 2025–26</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weightageData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)", fontFamily: "DM Sans" }} width={110} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{ background: "#242428", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                itemStyle={{ color: "#E8A23A" }}
              />
              <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                {weightageData.map((d, i) => <Cell key={i} fill={d.color} opacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Per-goal score stars */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>
              Goal Performance Ratings
            </div>
            {[
              { title: "Ship Analytics Dashboard", score: 87, stars: 4.5 },
              { title: "OKR Alignment (80%)", score: 92, stars: 5 },
              { title: "Stakeholder Framework", score: 75, stars: 4 },
              { title: "Security Compliance", score: 65, stars: 3 },
            ].map(({ title, score, stars }) => (
              <div key={title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", maxWidth: 180 }}>{title}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={11} fill={n <= Math.floor(stars) ? "#E8A23A" : n - 0.5 <= stars ? "#E8A23A" : "transparent"} stroke="#E8A23A" strokeWidth={1.5} style={{ opacity: n <= Math.ceil(stars) ? 1 : 0.25 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: score >= 80 ? "#E8A23A" : "rgba(255,255,255,0.5)", minWidth: 32, textAlign: "right" }}>{score}%</span>
                </div>
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
            <div key={q} style={{ background: "var(--surface-3)", borderRadius: 8, padding: "14px 16px", borderLeft: `2px solid ${depth === "deep" ? "#E8A23A" : "rgba(107,107,123,0.5)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{q} — Your words</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: depth === "deep" ? "#E8A23A" : "rgba(255,255,255,0.4)" }}>{score}%</span>
              </div>
              <p style={{ fontSize: 13, fontFamily: "DM Serif Display, serif", fontStyle: "italic", color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>"{note}"</p>
            </div>
          ))}
          <div style={{ background: "var(--surface-3)", borderRadius: 8, padding: "14px 16px", border: "1px dashed rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Clock size={20} style={{ color: "rgba(255,255,255,0.2)" }} />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>Q4 opens April 1, 2026</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
