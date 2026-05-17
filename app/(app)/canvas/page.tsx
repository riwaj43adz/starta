"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoalStore } from "@/lib/store/useGoalStore";
import { useUserStore } from "@/lib/store/useUserStore";
import { THRUST_AREAS, UOM_LABELS } from "@/lib/types";
import type { UoMType, ThrustArea } from "@/lib/types";
import { validateWeightage } from "@/lib/utils/scoring";
import WeightageAllocator from "@/components/strata/WeightageAllocator";
import LayerCeremony from "@/components/strata/LayerCeremony";
import { Plus, Trash2, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";

const UOM_OPTIONS: { value: UoMType; label: string; desc: string }[] = [
  { value: "numeric_max", label: "↑ Higher is better", desc: "Revenue, users, completion rate" },
  { value: "numeric_min", label: "↓ Lower is better", desc: "Defects, incidents, wait time" },
  { value: "timeline", label: "⌛ Milestone-based", desc: "Complete by a date or phase" },
  { value: "zero_based", label: "◎ Target zero", desc: "Safety incidents, critical bugs" },
];

export default function CanvasPage() {
  const { currentUser } = useUserStore();
  const { draft, setDraft, addGoalToDraft, updateGoalInDraft, removeGoalFromDraft, updateWeightage, saveDraft, clearDraft, isFirstLayerCeremonyDone, markFirstLayerCeremonyDone } = useGoalStore();
  const [step, setStep] = useState<"intention" | "goals" | "review">("intention");
  const [showCeremony, setShowCeremony] = useState(false);
  const [lastSavedText, setLastSavedText] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newGoal, setNewGoal] = useState({ thrustArea: "", title: "", description: "", uomType: "numeric_max" as UoMType, targetValue: 0, weightage: 20 });

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
      setLastSavedText("Draft saved " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  const weightageValidation = validateWeightage(
    draft.goals.map((g) => ({ weightage: g.weightage ?? 0 }))
  );

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.thrustArea) {
      toast.error("Give this goal a title and thrust area before adding it.");
      return;
    }
    addGoalToDraft({
      id: `draft-goal-${Date.now()}`,
      ...newGoal,
      isShared: false,
      isLocked: false,
    });
    setNewGoal({ thrustArea: "", title: "", description: "", uomType: "numeric_max", targetValue: 0, weightage: 20 });
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (!weightageValidation.isValid) {
      toast.error(weightageValidation.message);
      return;
    }
    if (currentUser?.isFirstYear && !isFirstLayerCeremonyDone) {
      setShowCeremony(true);
    } else {
      toast.success("Canvas submitted. Your manager will review it.");
      clearDraft();
    }
  };

  return (
    <div className="min-h-screen max-w-2xl px-8 py-8">
      {showCeremony && (
        <LayerCeremony
          onComplete={() => {
            setShowCeremony(false);
            markFirstLayerCeremonyDone();
            toast.success("Canvas submitted for review.");
            clearDraft();
          }}
        />
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          Goal Canvas
        </p>
        <h1 className="font-serif text-3xl font-bold" style={{ color: "#2C2A26" }}>
          {step === "intention" ? "What do you want to be known for this year?" : step === "goals" ? "Build your canvas." : "Review before submitting."}
        </h1>
        {lastSavedText && (
          <p className="text-xs mt-2" style={{ color: "rgba(122,92,62,0.5)" }}>
            {lastSavedText}
          </p>
        )}
      </motion.div>

      {/* Step indicators */}
      <div className="flex gap-1 mb-8">
        {(["intention", "goals", "review"] as const).map((s, i) => (
          <div key={s} className="flex-1 h-0.5 rounded-none" style={{
            background: step === s ? "#D4913A" : ["intention", "goals", "review"].indexOf(step) > i ? "#7A5C3E" : "#E8E3D8"
          }} />
        ))}
      </div>

      {/* Step 1: Intention */}
      <AnimatePresence mode="wait">
        {step === "intention" && (
          <motion.div key="intention" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#7A5C3E" }}>
              This is not mandatory. But what you write here will appear at the top of your canvas — visible to your manager. It primes the conversation before the metrics begin.
            </p>
            <textarea
              className="context-field w-full"
              rows={4}
              placeholder="I want to be known as the person who…"
              value={draft.intentionStatement}
              onChange={(e) => setDraft({ intentionStatement: e.target.value })}
              style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: "16px" }}
            />
            <div className="mt-6 flex justify-end">
              <button className="btn-primary" onClick={() => setStep("goals")}>
                Continue to goals <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Goals */}
        {step === "goals" && (
          <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
            {/* Existing goals */}
            {draft.goals.map((goal, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-4 relative" style={{ background: "white", border: "1px solid rgba(122,92,62,0.12)", borderRadius: "2px" }}>
                <button onClick={() => removeGoalFromDraft(i)} className="absolute top-3 right-3 p-1 hover:opacity-70 transition-opacity" style={{ color: "#C9A97A" }}>
                  <Trash2 size={14} />
                </button>
                <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "#C9A97A" }}>{goal.thrustArea}</p>
                <p className="text-sm font-semibold mb-1" style={{ color: "#2C2A26" }}>{goal.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "#7A5C3E" }}>Weight: {goal.weightage}%</span>
                  <input type="range" min={10} max={60} value={goal.weightage} onChange={e => updateWeightage(i, parseInt(e.target.value))} className="flex-1 h-1 accent-amber-500" />
                </div>
              </motion.div>
            ))}

            {/* Add goal form */}
            {draft.goals.length < 8 && (
              <div className="p-5" style={{ border: "1px dashed rgba(122,92,62,0.3)", borderRadius: "2px" }}>
                <p className="text-sm font-semibold mb-4" style={{ color: "#2C2A26" }}>Add a goal</p>

                {/* Thrust area tiles */}
                <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: "#C9A97A" }}>Thrust Area</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {THRUST_AREAS.map((area) => (
                    <button key={area} onClick={() => setNewGoal(g => ({ ...g, thrustArea: area }))} className={`thrust-tile text-left ${newGoal.thrustArea === area ? "selected" : ""}`}>
                      {area}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div className="mb-3">
                  <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Goal Title</label>
                  <input className="strata-input" placeholder="What will you achieve?" value={newGoal.title} onChange={e => setNewGoal(g => ({ ...g, title: e.target.value }))} />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Description</label>
                  <textarea className="strata-input" rows={2} placeholder="Context, scope, and how you'll measure success…" value={newGoal.description} onChange={e => setNewGoal(g => ({ ...g, description: e.target.value }))} style={{ resize: "vertical" }} />
                </div>

                {/* UoM */}
                <div className="mb-3">
                  <label className="text-xs font-semibold tracking-wide uppercase block mb-2" style={{ color: "#C9A97A" }}>Measurement Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {UOM_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => setNewGoal(g => ({ ...g, uomType: opt.value }))} className="p-3 text-left transition-all duration-200" style={{ border: `1px solid ${newGoal.uomType === opt.value ? "#D4913A" : "rgba(122,92,62,0.2)"}`, background: newGoal.uomType === opt.value ? "rgba(212,145,58,0.06)" : "white", borderRadius: "2px" }}>
                        <p className="text-xs font-semibold" style={{ color: "#2C2A26" }}>{opt.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#7A5C3E", opacity: 0.7 }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target + Weight */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Target Value</label>
                    <input type="number" className="strata-input" value={newGoal.targetValue} onChange={e => setNewGoal(g => ({ ...g, targetValue: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Weight (%)</label>
                    <input type="number" min={10} max={60} className="strata-input" value={newGoal.weightage} onChange={e => setNewGoal(g => ({ ...g, weightage: parseInt(e.target.value) || 10 }))} />
                  </div>
                </div>

                <button onClick={handleAddGoal} className="btn-secondary flex items-center gap-2">
                  <Plus size={14} /> Add to canvas
                </button>
              </div>
            )}

            {/* Weightage bar */}
            {draft.goals.length > 0 && (
              <div className="p-4" style={{ background: "rgba(245,240,232,0.6)", border: "1px solid rgba(122,92,62,0.1)", borderRadius: "2px" }}>
                <WeightageAllocator goals={draft.goals.map(g => ({ id: g.id!, title: g.title!, weightage: g.weightage! }))} />
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button className="btn-secondary" onClick={() => setStep("intention")}>Back</button>
              <button className="btn-primary" onClick={() => setStep("review")} disabled={draft.goals.length === 0}>
                Review canvas <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === "review" && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="p-5 mb-6" style={{ background: "#2C2A26", borderRadius: "2px" }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(201,169,122,0.5)" }}>Your intention</p>
              <p className="font-serif italic text-base" style={{ color: "#F5F0E8" }}>
                "{draft.intentionStatement || "No intention statement written."}"
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {draft.goals.map((goal, i) => (
                <div key={i} className="p-4" style={{ background: "white", border: "1px solid rgba(122,92,62,0.1)", borderRadius: "2px" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs" style={{ color: "#C9A97A" }}>{goal.thrustArea} · {goal.weightage}%</p>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: "#2C2A26" }}>{goal.title}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5" style={{ background: "rgba(122,92,62,0.08)", color: "#7A5C3E", borderRadius: "1px" }}>
                      Target: {goal.targetValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <WeightageAllocator readOnly goals={draft.goals.map(g => ({ id: g.id!, title: g.title!, weightage: g.weightage! }))} />

            {!weightageValidation.isValid && (
              <p className="text-xs mt-3 italic" style={{ color: "#C4603A" }}>{weightageValidation.message}</p>
            )}

            <div className="flex justify-between mt-6">
              <button className="btn-secondary" onClick={() => setStep("goals")}>Back</button>
              <button
                className={weightageValidation.isValid ? "btn-amber" : "btn-secondary opacity-50 cursor-not-allowed"}
                onClick={handleSubmit}
                disabled={!weightageValidation.isValid}
              >
                {weightageValidation.isValid ? "Submit your canvas." : "Not quite yet"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
