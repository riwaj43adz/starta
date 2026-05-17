"use client";

import { motion } from "framer-motion";
import { BookOpen, TrendingUp, MessageCircle } from "lucide-react";
import type { PreMeetingBrief } from "@/lib/types";
import { getInitials } from "@/lib/utils";

interface PreMeetingBriefCardProps {
  brief: PreMeetingBrief;
}

export default function PreMeetingBriefCard({ brief }: PreMeetingBriefCardProps) {
  const employee = brief.employee;

  return (
    <motion.div
      className="card"
      style={{ overflow: "hidden" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div
        style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-3)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600,
              background: "var(--surface-2)", border: "1px solid var(--surface-border)",
              color: "var(--text-primary)", borderRadius: 4, letterSpacing: "0.05em",
            }}
          >
            {employee ? getInitials(employee.name) : "?"}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              {employee?.name ?? "Team Member"}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Pre-meeting brief · {brief.quarter}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <BookOpen size={13} style={{ color: "var(--text-tertiary)" }} />
          <span className="text-label" style={{ color: "var(--text-tertiary)" }}>
            Brief
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* What changed */}
        <div style={{ display: "flex", gap: 12 }}>
          <TrendingUp size={14} style={{ marginTop: 4, flexShrink: 0, color: "var(--brand-amber)" }} />
          <div>
            <p className="text-label" style={{ marginBottom: 4 }}>
              What changed
            </p>
            <p className="text-body">
              {brief.whatChanged}
            </p>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--surface-border)" }} />

        {/* Context summary */}
        <div style={{ display: "flex", gap: 12 }}>
          <MessageCircle size={14} style={{ marginTop: 4, flexShrink: 0, color: "var(--status-success)" }} />
          <div>
            <p className="text-label" style={{ marginBottom: 4 }}>
              Their words
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--text-secondary)" }}>
              {brief.contextSummary}
            </p>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--surface-border)" }} />

        {/* Suggested focus */}
        <div
          style={{
            padding: "12px 16px",
            borderLeft: "2px solid var(--brand-amber)",
            background: "var(--brand-amber-glow)",
          }}
        >
          <p className="text-label" style={{ color: "var(--brand-amber)", marginBottom: 4 }}>
            Suggested focus
          </p>
          <p className="text-body" style={{ color: "var(--text-primary)" }}>
            {brief.suggestedFocus}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
