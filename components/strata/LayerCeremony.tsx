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
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(44,42,38,0.92)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => {
          setPhase("done");
          onComplete?.();
        }}
      >
        <div className="flex flex-col items-center gap-8 px-8 text-center">
          {/* Stratum forming */}
          <div className="w-48 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-none"
                style={{
                  height: "8px",
                  backgroundColor: i === 0 ? "#D4913A" : "#E8E3D8",
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
            className="w-2 h-2 rounded-full"
            style={{ background: "#D4913A" }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(212,145,58,0)",
                "0 0 0 16px rgba(212,145,58,0.15)",
                "0 0 0 0 rgba(212,145,58,0)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Text */}
          <AnimatePresence>
            {phase === "text" && (
              <motion.p
                className="font-serif italic text-xl"
                style={{ color: "#C9A97A" }}
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
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(201,169,122,0.35)" }}
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
