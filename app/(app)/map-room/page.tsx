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
    <div className="min-h-screen px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          <Map size={12} className="inline mr-1.5" />
          The Map Room
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          {ACTIVE_CYCLE.name} Overview
        </h1>
        <p className="text-sm font-serif italic" style={{ color: "#7A5C3E" }}>
          "The feeling of a cartographer who finally has an accurate map."
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
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
            className="p-4"
            style={{ background: "white", border: "1px solid rgba(122,92,62,0.1)", borderRadius: "2px" }}
          >
            <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "#C9A97A" }}>
              {stat.label}
            </p>
            <p className="font-serif text-2xl font-bold" style={{ color: "#2C2A26" }}>
              {stat.value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#7A5C3E" }}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Org terrain */}
      <div className="mb-8">
        <h2 className="font-serif text-lg font-semibold mb-4" style={{ color: "#2C2A26" }}>
          Org Terrain
        </h2>
        <div className="space-y-3">
          {teams.map(team => (
            <div
              key={team.name}
              className="p-5"
              style={{ background: "white", border: "1px solid rgba(122,92,62,0.12)", borderRadius: "2px" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold" style={{ color: "#2C2A26" }}>{team.name}</p>
                  <p className="text-xs" style={{ color: "#7A5C3E" }}>Manager: {team.manager}</p>
                </div>
                <div className="flex gap-3 text-right">
                  <div>
                    <p className="text-xs" style={{ color: "#C9A97A" }}>Canvas</p>
                    <p className="text-sm font-semibold" style={{ color: "#2C2A26" }}>
                      {team.submitted}/{team.total}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "#C9A97A" }}>Q3 Check-ins</p>
                    <p className="text-sm font-semibold" style={{ color: team.checkinComplete === team.total ? "#7A9170" : "#D4913A" }}>
                      {team.checkinComplete}/{team.total}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini stratum for team */}
              <div className="flex gap-[2px] h-2">
                {Array(team.total).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{
                      background: i < team.checkinComplete ? "#D4913A" : "#E8E3D8",
                      borderRadius: "1px",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Cycle Management", desc: "Open/close windows", href: "/map-room/cycles", icon: Settings },
          { label: "Audit Trail", desc: "Field journal format", href: "/map-room/audit", icon: FileText },
          { label: "Achievement Report", desc: "Export with context", href: "/map-room/reports", icon: BarChart3 },
        ].map(({ label, desc, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className="p-4 group cursor-pointer transition-all duration-300 hover:shadow-stratum"
              style={{ background: "white", border: "1px solid rgba(122,92,62,0.12)", borderRadius: "2px" }}
            >
              <Icon size={18} style={{ color: "#C9A97A" }} className="mb-2" />
              <p className="text-sm font-semibold" style={{ color: "#2C2A26" }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#7A5C3E" }}>{desc}</p>
              <ChevronRight size={14} style={{ color: "#C9A97A" }} className="mt-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
