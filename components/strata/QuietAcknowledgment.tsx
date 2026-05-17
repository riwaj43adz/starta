"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, Edit3 } from "lucide-react";

interface QuietAcknowledgmentProps {
  managerName: string;
  hadChanges: boolean;
  changeCount?: number;
  onDismiss?: () => void;
}

export default function QuietAcknowledgment({
  managerName,
  hadChanges,
  changeCount = 0,
  onDismiss,
}: QuietAcknowledgmentProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{ position: "fixed", top: 24, right: 24, zIndex: 50, maxWidth: 384, width: "100%" }}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
        >
          <div
            className="card"
            style={{
              display: "flex", alignItems: "flex-start", gap: 12, padding: 16, cursor: "pointer",
              background: "var(--surface-3)",
              boxShadow: "var(--shadow-elevated)",
            }}
          >
            <div style={{ marginTop: 2, flexShrink: 0 }}>
              {hadChanges ? (
                <Edit3 size={14} style={{ color: "var(--brand-amber)" }} />
              ) : (
                <CheckCircle size={14} style={{ color: "var(--status-success)" }} />
              )}
            </div>

            <div>
              <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5, color: "var(--text-primary)" }}>
                {hadChanges
                  ? `${managerName} shaped your canvas — ${changeCount} adjustment${changeCount !== 1 ? "s" : ""} made.`
                  : `${managerName} reviewed your goals and signed off without changes.`}
              </p>
              <p style={{ fontSize: 12, marginTop: 4, color: "var(--text-tertiary)" }}>
                {hadChanges ? "Tap to see what changed." : "You were read, not just processed."}
              </p>
            </div>
          </div>

          {/* Dismiss progress bar */}
          <motion.div
            style={{ height: 2, background: "var(--brand-amber)", transformOrigin: "left", opacity: 0.5 }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
