"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getTeamForManager, GOAL_SHEETS, QUARTERLY_UPDATES,
  getUserUpdates, getUserGoalSheet, PRE_MEETING_BRIEFS,
} from "@/lib/data/seed";
import { buildStratumLayers } from "@/lib/utils/scoring";
import StratumBar from "@/components/strata/StratumBar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { Eye, FileText, ChevronRight, Clock } from "lucide-react";
import type { GoalSheet, User } from "@/lib/types";

function TeamMemberCard({ user, sheet, index }: { user: User; sheet?: GoalSheet; index: number }) {
  const updates = getUserUpdates(user.id);
  const strata = sheet ? buildStratumLayers(sheet.goals, updates) : [];

  const statusLabel = !sheet
    ? { label: "No canvas", color: "#E8E3D8", textColor: "#4A5568" }
    : sheet.status === "submitted"
    ? { label: "Needs your eye", color: "rgba(212,145,58,0.12)", textColor: "#D4913A" }
    : sheet.status === "approved" || sheet.status === "locked"
    ? { label: "Approved", color: "rgba(74,94,58,0.1)", textColor: "#4A5E3A" }
    : { label: "Draft", color: "rgba(74,85,104,0.08)", textColor: "#4A5568" };

  const hasBrief = PRE_MEETING_BRIEFS.some(b => b.employeeId === user.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="p-5 group cursor-pointer transition-all duration-300 hover:shadow-stratum"
      style={{
        background: "white",
        border: "1px solid rgba(122,92,62,0.12)",
        borderRadius: "2px",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{
              background: "#2C2A26",
              color: "#C9A97A",
              borderRadius: "2px",
              letterSpacing: "0.05em",
            }}
          >
            {getInitials(user.name)}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#2C2A26" }}>
              {user.name}
            </p>
            <p className="text-xs" style={{ color: "#7A5C3E" }}>
              {user.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasBrief && (
            <span
              className="text-xs px-2 py-0.5"
              style={{ background: "rgba(212,145,58,0.1)", color: "#D4913A", borderRadius: "1px" }}
            >
              Brief ready
            </span>
          )}
          <span
            className="text-xs px-2 py-0.5"
            style={{ background: statusLabel.color, color: statusLabel.textColor, borderRadius: "1px" }}
          >
            {statusLabel.label}
          </span>
        </div>
      </div>

      {/* Stratum */}
      <StratumBar layers={strata} size="sm" showLabels animate />

      {/* Intention statement preview */}
      {sheet?.intentionStatement && (
        <p
          className="text-xs font-serif italic mt-3 leading-relaxed line-clamp-1"
          style={{ color: "rgba(122,92,62,0.6)" }}
        >
          "{sheet.intentionStatement}"
        </p>
      )}
    </motion.div>
  );
}

export default function LensPage() {
  const { currentUser } = useUserStore();
  if (!currentUser) return null;

  const team = getTeamForManager(currentUser.id);
  const pendingApprovals = GOAL_SHEETS.filter(
    s => team.some(m => m.id === s.userId) && s.status === "submitted"
  );

  return (
    <div className="min-h-screen px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          <Eye size={12} className="inline mr-1.5" />
          The Lens
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          Your team.
        </h1>
        <p className="text-sm" style={{ color: "#7A5C3E" }}>
          {team.length} people. Strata that tell their year.
        </p>
      </motion.div>

      {/* Pending approvals counter */}
      {pendingApprovals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Link href="/lens/approvals">
            <div
              className="flex items-center justify-between p-4 group cursor-pointer transition-all duration-300"
              style={{
                background: "rgba(212,145,58,0.06)",
                border: "1px solid rgba(212,145,58,0.25)",
                borderRadius: "2px",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xl font-serif font-bold"
                  style={{ color: "#D4913A" }}
                >
                  {pendingApprovals.length}
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#2C2A26" }}>
                    {pendingApprovals.length === 1
                      ? "canvas waiting for your eye."
                      : "canvases waiting for your eye."}
                  </p>
                  <p className="text-xs font-serif italic" style={{ color: "#7A5C3E" }}>
                    Each one is a person's intention for the year.
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "#D4913A" }}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        </motion.div>
      )}

      {/* Team grid */}
      <div className="grid grid-cols-2 gap-4">
        {team.map((member, i) => {
          const sheet = getUserGoalSheet(member.id);
          return (
            <TeamMemberCard key={member.id} user={member} sheet={sheet} index={i} />
          );
        })}
      </div>

      {/* Pre-meeting briefs section */}
      {PRE_MEETING_BRIEFS.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold" style={{ color: "#2C2A26" }}>
              Pre-meeting briefs
            </h2>
            <span className="text-xs" style={{ color: "#C9A97A" }}>
              Ready for your check-ins
            </span>
          </div>
          <Link href="/lens/check-in-room">
            <div
              className="p-4 flex items-center justify-between cursor-pointer group"
              style={{
                background: "white",
                border: "1px solid rgba(122,92,62,0.12)",
                borderRadius: "2px",
              }}
            >
              <div className="flex items-center gap-3">
                <FileText size={16} style={{ color: "#C9A97A" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#2C2A26" }}>
                    {PRE_MEETING_BRIEFS.length} briefs ready for Q3 check-ins
                  </p>
                  <p className="text-xs font-serif italic" style={{ color: "#7A5C3E" }}>
                    "Has a goal tool ever prepared you for a conversation before?"
                  </p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "#C9A97A" }} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
