"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LayerCeremonyProps {
  onComplete?: () => void;
}

export default function LayerCeremony({ onComplete }: LayerCeremonyProps) {
  const [phase, setPhase] = useState<"forming" | "text" | "done">("forming");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1200);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-0)", opacity: 0.96 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => {
          setPhase("done");
          onComplete?.();
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: "0 32px", textAlign: "center" }}>
          {/* Stratum forming */}
          <div style={{ width: 192, display: "flex", gap: 4 }}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                style={{
                  flex: 1,
                  height: 8,
                  backgroundColor: i === 0 ? "var(--brand-amber)" : "var(--surface-border-strong)",
                  transformOrigin: "left center",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: i === 0 ? 1.0 : 0.01,
                  delay: i === 0 ? 0.3 : 0,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            ))}
          </div>

          {/* Amber glow */}
          <motion.div
            style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand-amber)" }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(232,162,58,0)",
                "0 0 0 16px rgba(232,162,58,0.15)",
                "0 0 0 0 rgba(232,162,58,0)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Text */}
          <AnimatePresence>
            {phase === "text" && (
              <motion.p
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.25rem", color: "var(--text-primary)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Your story begins here.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.p
            className="text-label"
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            tap anywhere to continue
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
