"use client";

import { motion } from "framer-motion";
import { PRE_MEETING_BRIEFS } from "@/lib/data/seed";
import PreMeetingBriefCard from "@/components/strata/PreMeetingBriefCard";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

export default function CheckInRoomPage() {
  const [managerComments, setManagerComments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string[]>([]);

  return (
    <div className="page-container" style={{ maxWidth: 860 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <MessageSquare size={12} />
          Check-in Room
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          Q3 check-ins.
        </h1>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, color: "var(--text-tertiary)" }}>
          Read the briefs. Then have the conversations.
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {PRE_MEETING_BRIEFS.map((brief, i) => {
          const isSubmitted = submitted.includes(brief.id);

          return (
            <motion.div
              key={brief.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <PreMeetingBriefCard brief={brief} />

              {/* Manager comment entry */}
              {!isSubmitted ? (
                <div className="card" style={{ marginTop: 12, padding: 20 }}>
                  <label className="text-label" style={{ display: "block", marginBottom: 8, color: "var(--brand-amber)" }}>
                    Your check-in note for {brief.employee?.name.split(" ")[0]}
                  </label>
                  <textarea
                    className="strata-input"
                    rows={3}
                    placeholder="A response to what they shared. What you noticed. What you want them to carry forward."
                    value={managerComments[brief.id] ?? ""}
                    onChange={e => setManagerComments(prev => ({ ...prev, [brief.id]: e.target.value }))}
                    style={{ resize: "vertical" }}
                  />
                  <button
                    className="btn-primary"
                    style={{ marginTop: 12 }}
                    onClick={() => {
                      if (!managerComments[brief.id]?.trim()) {
                        toast.error("Add a note before submitting the check-in.");
                        return;
                      }
                      setSubmitted(prev => [...prev, brief.id]);
                      toast.success(`Check-in note sent to ${brief.employee?.name}.`);
                    }}
                  >
                    Submit check-in note
                  </button>
                </div>
              ) : (
                <div
                  className="card"
                  style={{ marginTop: 12, padding: 20, borderLeft: "2px solid var(--status-success)", background: "var(--surface-3)" }}
                >
                  <p className="text-label" style={{ color: "var(--status-success)", marginBottom: 6 }}>
                    Your note · Sent
                  </p>
                  <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    "{managerComments[brief.id]}"
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
