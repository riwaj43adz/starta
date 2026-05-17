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
          className="fixed top-6 right-6 z-50 max-w-sm"
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
            className="flex items-start gap-3 p-4 cursor-pointer"
            style={{
              background: "#2C2A26",
              border: "1px solid rgba(201,169,122,0.2)",
              boxShadow: "0 8px 32px rgba(44,42,38,0.3)",
            }}
          >
            <div className="mt-0.5 flex-shrink-0">
              {hadChanges ? (
                <Edit3 size={14} style={{ color: "#D4913A" }} />
              ) : (
                <CheckCircle size={14} style={{ color: "#7A9170" }} />
              )}
            </div>

            <div>
              <p
                className="text-xs font-medium leading-relaxed"
                style={{ color: "#F5F0E8" }}
              >
                {hadChanges
                  ? `${managerName} shaped your canvas — ${changeCount} adjustment${changeCount !== 1 ? "s" : ""} made.`
                  : `${managerName} reviewed your goals and signed off without changes.`}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(201,169,122,0.5)" }}>
                {hadChanges ? "Tap to see what changed." : "You were read, not just processed."}
              </p>
            </div>
          </div>

          {/* Dismiss progress bar */}
          <motion.div
            className="h-px"
            style={{ background: "rgba(212,145,58,0.4)", transformOrigin: "left" }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
