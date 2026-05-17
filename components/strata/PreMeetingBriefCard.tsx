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
      className="border overflow-hidden"
      style={{
        borderColor: "rgba(122,92,62,0.2)",
        background: "#FAF7F2",
        borderRadius: "2px",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(122,92,62,0.12)", background: "#F5F0E8" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center text-xs font-semibold"
            style={{
              background: "#2C2A26",
              color: "#C9A97A",
              borderRadius: "2px",
              letterSpacing: "0.05em",
            }}
          >
            {employee ? getInitials(employee.name) : "?"}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#2C2A26" }}>
              {employee?.name ?? "Team Member"}
            </p>
            <p className="text-xs" style={{ color: "#7A5C3E" }}>
              Pre-meeting brief · {brief.quarter}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} style={{ color: "#C9A97A" }} />
          <span
            className="text-xs font-medium tracking-wide uppercase"
            style={{ color: "#C9A97A" }}
          >
            Brief
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* What changed */}
        <div className="flex gap-3">
          <TrendingUp size={14} className="mt-1 flex-shrink-0" style={{ color: "#D4913A" }} />
          <div>
            <p
              className="text-xs font-semibold tracking-wide uppercase mb-1"
              style={{ color: "#7A5C3E" }}
            >
              What changed
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>
              {brief.whatChanged}
            </p>
          </div>
        </div>

        <div
          style={{ height: "1px", background: "rgba(122,92,62,0.1)" }}
        />

        {/* Context summary */}
        <div className="flex gap-3">
          <MessageCircle size={14} className="mt-1 flex-shrink-0" style={{ color: "#7A9170" }} />
          <div>
            <p
              className="text-xs font-semibold tracking-wide uppercase mb-1"
              style={{ color: "#7A5C3E" }}
            >
              Their words
            </p>
            <p
              className="text-sm leading-relaxed font-serif italic"
              style={{ color: "#4A5568" }}
            >
              {brief.contextSummary}
            </p>
          </div>
        </div>

        <div
          style={{ height: "1px", background: "rgba(122,92,62,0.1)" }}
        />

        {/* Suggested focus */}
        <div
          className="px-4 py-3"
          style={{
            borderLeft: "2px solid #D4913A",
            background: "rgba(212,145,58,0.04)",
          }}
        >
          <p
            className="text-xs font-semibold tracking-wide uppercase mb-1"
            style={{ color: "#D4913A" }}
          >
            Suggested focus
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#2C2A26" }}>
            {brief.suggestedFocus}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
