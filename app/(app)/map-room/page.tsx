"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  USERS, GOAL_SHEETS, QUARTERLY_UPDATES, AUDIT_LOG, ACTIVE_CYCLE
} from "@/lib/data/seed";
import { getTeamForManager } from "@/lib/data/seed";
import { Map, Settings, FileText, BarChart3, ChevronRight, Users, CheckCircle } from "lucide-react";

export default function MapRoomPage() {
  // Compute stats
  const allEmployees = USERS.filter(u => u.role === "employee");
  const submittedSheets = GOAL_SHEETS.filter(s => s.status !== "draft");
  const approvedSheets = GOAL_SHEETS.filter(s => s.status === "locked" || s.status === "approved");
  const completionRate = Math.round((approvedSheets.length / allEmployees.length) * 100);

  const q3Updates = QUARTERLY_UPDATES.filter(u => u.quarter === "Q3");
  const q3CompletionRate = Math.round((q3Updates.length / (approvedSheets.length * 3)) * 100);

  const teams = [
    {
      name: "Engineering",
      manager: "Rajiv Sharma",
      total: 4,
      submitted: 2,
      checkinComplete: 3,
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Map size={12} />
          The Map Room
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          {ACTIVE_CYCLE.name} Overview
        </h1>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, color: "var(--text-tertiary)" }}>
          "The feeling of a cartographer who finally has an accurate map."
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Canvas Approved", value: `${approvedSheets.length}/${allEmployees.length}`, sub: `${completionRate}% complete` },
          { label: "Q3 Check-ins", value: `${q3Updates.length}`, sub: "updates recorded" },
          { label: "Audit Entries", value: AUDIT_LOG.length, sub: "post-lock changes" },
          { label: "Active Cycle", value: ACTIVE_CYCLE.name, sub: "FY 2025–26" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="metric-card"
          >
            <p className="metric-label">{stat.label}</p>
            <p className="metric-value">{stat.value}</p>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Org terrain */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)", marginBottom: 16 }}>
          Org Terrain
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {teams.map(team => (
            <div
              key={team.name}
              className="card card-md"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{team.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Manager: {team.manager}</p>
                </div>
                <div style={{ display: "flex", gap: 24, textAlign: "right" }}>
                  <div>
                    <p className="text-label">Canvas</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                      {team.submitted}/{team.total}
                    </p>
                  </div>
                  <div>
                    <p className="text-label">Q3 Check-ins</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: team.checkinComplete === team.total ? "var(--status-success)" : "var(--brand-amber)" }}>
                      {team.checkinComplete}/{team.total}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini stratum for team */}
              <div style={{ display: "flex", gap: 3, height: 8 }}>
                {Array(team.total).fill(null).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: i < team.checkinComplete ? "var(--brand-amber)" : "var(--surface-border-strong)",
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Cycle Management", desc: "Open/close windows", href: "/map-room/cycles", icon: Settings },
          { label: "Audit Trail", desc: "Field journal format", href: "/map-room/audit", icon: FileText },
          { label: "Achievement Report", desc: "Export with context", href: "/map-room/reports", icon: BarChart3 },
        ].map(({ label, desc, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className="card card-hover" style={{ padding: 20 }}>
              <Icon size={18} style={{ color: "var(--brand-amber)", marginBottom: 12 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{label}</p>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{desc}</p>
              <ChevronRight size={14} style={{ color: "var(--brand-amber)", marginTop: 12 }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
