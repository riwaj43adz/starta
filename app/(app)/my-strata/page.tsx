"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getUserGoalSheet,
  getUserUpdates,
  ACTIVE_CYCLE,
  getCheckInComments,
} from "@/lib/data/seed";
import { buildStratumLayers } from "@/lib/utils/scoring";
import StratumBar from "@/components/strata/StratumBar";
import GoalCard from "@/components/strata/GoalCard";
import Link from "next/link";
import { Target, ChevronRight, Clock, FileText } from "lucide-react";

export default function MyStrataPage() {
  const { currentUser } = useUserStore();
  if (!currentUser) return null;

  const sheet = getUserGoalSheet(currentUser.id);
  const updates = getUserUpdates(currentUser.id);
  const comments = sheet ? getCheckInComments(sheet.id) : [];
  const strata = sheet
    ? buildStratumLayers(sheet.goals, updates)
    : [];

  const currentQuarter = "Q3";
  const isCheckInOpen = true; // For demo

  return (
    <div className="min-h-screen px-8 py-8 max-w-3xl">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "#C9A97A" }}
        >
          {ACTIVE_CYCLE.name}
        </p>
        <h1
          className="font-serif text-3xl font-bold leading-tight mb-1"
          style={{ color: "#2C2A26" }}
        >
          {currentUser.name.split(" ")[0]}'s Strata
        </h1>
        {sheet?.intentionStatement && (
          <p
            className="font-serif italic text-base leading-relaxed mt-3"
            style={{ color: "#7A5C3E" }}
          >
            "{sheet.intentionStatement}"
          </p>
        )}
      </motion.div>

      {/* Stratum bar — the primary visual */}
      {sheet && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 p-5"
          style={{
            background: "#2C2A26",
            borderRadius: "2px",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(201,169,122,0.5)" }}
            >
              Your year's depth
            </p>
            <span
              className="text-xs"
              style={{ color: "rgba(201,169,122,0.4)" }}
            >
              {strata.filter((l) => l.isComplete).length} of 4 layers formed
            </span>
          </div>

          <StratumBar layers={strata} size="lg" showLabels animate />

          {/* Quarter legend */}
          <div className="mt-4 flex gap-4">
            {strata.map((layer) => (
              <div key={layer.quarter} className="flex-1">
                <p
                  className="text-xs font-medium"
                  style={{ color: "rgba(201,169,122,0.6)" }}
                >
                  {layer.quarter}
                </p>
                {layer.isComplete ? (
                  <p
                    className="text-xs mt-0.5 capitalize"
                    style={{ color: "rgba(201,169,122,0.4)" }}
                  >
                    {layer.depth}
                  </p>
                ) : (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(201,169,122,0.25)" }}
                  >
                    Pending
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Check-in CTA */}
      {isCheckInOpen && sheet && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Link href="/check-in">
            <div
              className="flex items-center justify-between p-4 group cursor-pointer transition-all duration-300"
              style={{
                background: "rgba(212,145,58,0.06)",
                border: "1px solid rgba(212,145,58,0.2)",
                borderRadius: "2px",
              }}
            >
              <div className="flex items-center gap-3">
                <Clock size={16} style={{ color: "#D4913A" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#2C2A26" }}>
                    {currentQuarter} is open.
                  </p>
                  <p
                    className="text-xs font-serif italic"
                    style={{ color: "#7A5C3E" }}
                  >
                    Tell us what happened.
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "#D4913A" }}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </div>
          </Link>
        </motion.div>
      )}

      {/* No sheet state */}
      {!sheet && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Link href="/canvas">
            <div
              className="flex items-center justify-between p-5 group cursor-pointer transition-all duration-300"
              style={{
                border: "1px dashed rgba(122,92,62,0.3)",
                borderRadius: "2px",
              }}
            >
              <div className="flex items-center gap-3">
                <Target size={16} style={{ color: "#C9A97A" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#2C2A26" }}>
                    Add a goal to your canvas.
                  </p>
                  <p
                    className="text-xs font-serif italic"
                    style={{ color: "#7A5C3E" }}
                  >
                    What do you want to be known for this year?
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "#C9A97A" }}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </div>
          </Link>
        </motion.div>
      )}

      {/* Goal cards */}
      {sheet && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-serif text-lg font-semibold"
              style={{ color: "#2C2A26" }}
            >
              Your Canvas
            </h2>
            <span
              className="text-xs"
              style={{ color: "#C9A97A" }}
            >
              {sheet.goals.length} goals · {sheet.status}
            </span>
          </div>

          <div className="space-y-3">
            {sheet.goals.map((goal, i) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                updates={updates}
                index={i}
                showProgress
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent manager comments */}
      {comments.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <h2
            className="font-serif text-lg font-semibold mb-4"
            style={{ color: "#2C2A26" }}
          >
            From your manager
          </h2>
          <div className="space-y-4">
            {comments.slice(-2).map((comment) => (
              <div
                key={comment.id}
                className="p-4"
                style={{
                  background: "white",
                  border: "1px solid rgba(122,92,62,0.1)",
                  borderRadius: "2px",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-semibold tracking-wide uppercase"
                    style={{ color: "#C9A97A" }}
                  >
                    {comment.quarter}
                  </span>
                  <span className="text-xs" style={{ color: "#C9A97A" }}>
                    Rajiv Sharma
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed font-serif italic"
                  style={{ color: "#4A5568" }}
                >
                  "{comment.commentText}"
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
