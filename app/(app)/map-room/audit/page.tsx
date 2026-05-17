"use client";

import { motion } from "framer-motion";
import { AUDIT_LOG, USERS } from "@/lib/data/seed";
import { formatDate } from "@/lib/utils";

export default function AuditPage() {
  return (
    <div className="min-h-screen max-w-3xl px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          Audit Trail
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          The field journal.
        </h1>
        <p className="text-sm font-serif italic" style={{ color: "#7A5C3E" }}>
          Every post-lock change. Every hand that touched the record. Immutable.
        </p>
      </motion.div>

      <div className="space-y-6">
        {AUDIT_LOG.map((entry, i) => {
          const actor = USERS.find(u => u.id === entry.actorId);

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="journal-entry"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#C9A97A" }}>
                    {entry.entityType.replace(/_/g, " ")} · {entry.action.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "#2C2A26" }}>
                    {actor?.name ?? "System"}
                  </p>
                </div>
                <p className="text-xs" style={{ color: "#C9A97A" }}>
                  {formatDate(entry.createdAt)}
                </p>
              </div>

              {entry.fieldName && (
                <div className="mt-2 flex gap-4 text-xs">
                  <div>
                    <span className="font-semibold" style={{ color: "#9E4A2A" }}>Before: </span>
                    <span style={{ color: "#4A5568" }}>{entry.oldValue}</span>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: "#4A5E3A" }}>After: </span>
                    <span style={{ color: "#4A5568" }}>{entry.newValue}</span>
                  </div>
                </div>
              )}

              {entry.reason && (
                <div
                  className="mt-3 px-3 py-2"
                  style={{
                    borderLeft: "2px solid #C9A97A",
                    background: "rgba(201,169,122,0.04)",
                  }}
                >
                  <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "#C9A97A" }}>
                    Reason
                  </p>
                  <p className="text-sm font-serif italic leading-relaxed" style={{ color: "#4A5568" }}>
                    {entry.reason}
                  </p>
                </div>
              )}

              <p className="text-xs mt-2" style={{ color: "rgba(122,92,62,0.4)" }}>
                Recorded {new Date(entry.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · Immutable
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Callout */}
      <div
        className="mt-10 p-4"
        style={{ borderLeft: "3px solid #D4913A", background: "rgba(212,145,58,0.04)" }}
      >
        <p className="text-sm" style={{ color: "#2C2A26" }}>
          <strong>Could you defend this decision in an appraisal dispute?</strong>
        </p>
        <p className="text-sm mt-1" style={{ color: "#7A5C3E" }}>
          Yes. Confidently. That is Strata.
        </p>
      </div>
    </div>
  );
}
