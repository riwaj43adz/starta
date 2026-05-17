"use client";

import { motion } from "framer-motion";
import { PRE_MEETING_BRIEFS, getCheckInComments, getUserGoalSheet, getUserUpdates } from "@/lib/data/seed";
import PreMeetingBriefCard from "@/components/strata/PreMeetingBriefCard";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckInRoomPage() {
  const [managerComments, setManagerComments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string[]>([]);

  return (
    <div className="min-h-screen max-w-2xl px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          Check-in Room
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          Q3 check-ins.
        </h1>
        <p className="font-serif italic text-sm" style={{ color: "#7A5C3E" }}>
          Read the briefs. Then have the conversations.
        </p>
      </motion.div>

      <div className="space-y-8">
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
                <div className="mt-3 p-4" style={{ border: "1px solid rgba(122,92,62,0.12)", borderRadius: "2px", background: "white" }}>
                  <label className="text-xs font-semibold tracking-wide uppercase block mb-2" style={{ color: "#C9A97A" }}>
                    Your check-in note for {brief.employee?.name.split(" ")[0]}
                  </label>
                  <textarea
                    className="strata-input w-full"
                    rows={3}
                    placeholder="A response to what they shared. What you noticed. What you want them to carry forward."
                    value={managerComments[brief.id] ?? ""}
                    onChange={e => setManagerComments(prev => ({ ...prev, [brief.id]: e.target.value }))}
                    style={{ resize: "vertical" }}
                  />
                  <button
                    className="btn-primary mt-3"
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
                  className="mt-3 p-4"
                  style={{ borderLeft: "2px solid #7A9170", background: "rgba(74,94,58,0.04)", borderRadius: "0 2px 2px 0" }}
                >
                  <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "#7A9170" }}>
                    Your note · Sent
                  </p>
                  <p className="text-sm font-serif italic leading-relaxed" style={{ color: "#4A5568" }}>
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
