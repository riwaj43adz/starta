"use client";

import { motion } from "framer-motion";
import { AUDIT_LOG, USERS } from "@/lib/data/seed";
import { formatDate } from "@/lib/utils";

export default function AuditPage() {
  return (
    <div className="page-container" style={{ maxWidth: 860 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ marginBottom: 8 }}>
          Audit Trail
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          The field journal.
        </h1>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, color: "var(--text-tertiary)" }}>
          Every post-lock change. Every hand that touched the record. Immutable.
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {AUDIT_LOG.map((entry, i) => {
          const actor = USERS.find(u => u.id === entry.actorId);

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ padding: 24 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p className="text-label" style={{ color: "var(--brand-amber)" }}>
                    {entry.entityType.replace(/_/g, " ")} · {entry.action.replace(/_/g, " ")}
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginTop: 4 }}>
                    {actor?.name ?? "System"}
                  </p>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  {formatDate(entry.createdAt)}
                </p>
              </div>

              {entry.fieldName && (
                <div style={{ marginTop: 12, display: "flex", gap: 24, fontSize: 13 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--status-danger)" }}>Before: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{entry.oldValue}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--status-success)" }}>After: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{entry.newValue}</span>
                  </div>
                </div>
              )}

              {entry.reason && (
                <div
                  style={{
                    marginTop: 16, padding: "12px 16px",
                    borderLeft: "2px solid var(--brand-amber)",
                    background: "var(--brand-amber-glow)",
                    borderRadius: "0 4px 4px 0"
                  }}
                >
                  <p className="text-label" style={{ color: "var(--brand-amber)", marginBottom: 4 }}>
                    Reason
                  </p>
                  <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6 }}>
                    {entry.reason}
                  </p>
                </div>
              )}

              <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 16 }}>
                Recorded {new Date(entry.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · Immutable
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Callout */}
      <div
        className="card"
        style={{ marginTop: 40, padding: 24, borderLeft: "3px solid var(--brand-amber)", background: "var(--surface-3)" }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
          Could you defend this decision in an appraisal dispute?
        </p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
          Yes. Confidently. That is Strata.
        </p>
      </div>
    </div>
  );
}
