"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoalStore } from "@/lib/store/useGoalStore";
import { useUserStore } from "@/lib/store/useUserStore";
import { THRUST_AREAS } from "@/lib/types";
import type { UoMType } from "@/lib/types";
import { validateWeightage } from "@/lib/utils/scoring";
import WeightageAllocator from "@/components/strata/WeightageAllocator";
import LayerCeremony from "@/components/strata/LayerCeremony";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const UOM_OPTIONS: { value: UoMType; label: string; desc: string }[] = [
  { value: "numeric_max", label: "↑ Higher is better", desc: "Revenue, users, completion rate" },
  { value: "numeric_min", label: "↓ Lower is better", desc: "Defects, incidents, wait time" },
  { value: "timeline", label: "⌛ Milestone-based", desc: "Complete by a date or phase" },
  { value: "zero_based", label: "◎ Target zero", desc: "Safety incidents, critical bugs" },
];

export default function CanvasPage() {
  const { currentUser } = useUserStore();
  const { draft, setDraft, addGoalToDraft, removeGoalFromDraft, updateWeightage, saveDraft, clearDraft, isFirstLayerCeremonyDone, markFirstLayerCeremonyDone } = useGoalStore();
  const [step, setStep] = useState<"intention" | "goals" | "review">("intention");
  const [showCeremony, setShowCeremony] = useState(false);
  const [lastSavedText, setLastSavedText] = useState("");
  const [newGoal, setNewGoal] = useState({ thrustArea: "", title: "", description: "", uomType: "numeric_max" as UoMType, targetValue: 0, weightage: 20 });

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
    <div className="page-container" style={{ maxWidth: 860 }}>
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ marginBottom: 8 }}>
          Goal Canvas
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          {step === "intention" ? "What do you want to be known for this year?" : step === "goals" ? "Build your canvas." : "Review before submitting."}
        </h1>
        {lastSavedText && (
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8 }}>
            {lastSavedText}
          </p>
        )}
      </motion.div>

      {/* Step indicators */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
        {(["intention", "goals", "review"] as const).map((s, i) => (
          <div key={s} style={{
            flex: 1, height: 2, borderRadius: 1,
            background: step === s ? "var(--brand-amber)" : ["intention", "goals", "review"].indexOf(step) > i ? "var(--surface-border-strong)" : "var(--surface-2)"
          }} />
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === "intention" && (
          <motion.div key="intention" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <p className="text-body" style={{ marginBottom: 24 }}>
              This is not mandatory. But what you write here will appear at the top of your canvas — visible to your manager. It primes the conversation before the metrics begin.
            </p>
            <textarea
              className="context-field"
              rows={4}
              placeholder="I want to be known as the person who…"
              value={draft.intentionStatement}
              onChange={(e) => setDraft({ intentionStatement: e.target.value })}
            />
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-primary" onClick={() => setStep("goals")}>
                Continue to goals <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === "goals" && (
          <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Existing goals */}
            {draft.goals.map((goal, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 20, position: "relative" }}>
                <button onClick={() => removeGoalFromDraft(i)} style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}>
                  <Trash2 size={14} />
                </button>
                <p className="text-label" style={{ marginBottom: 6 }}>{goal.thrustArea}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{goal.title}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Weight: {goal.weightage}%</span>
                  <input type="range" min={10} max={60} value={goal.weightage} onChange={e => updateWeightage(i, parseInt(e.target.value))} style={{ flex: 1, accentColor: "var(--brand-amber)" }} />
                </div>
              </motion.div>
            ))}

            {/* Add goal form */}
            {draft.goals.length < 8 && (
              <div className="card" style={{ padding: 24, border: "1px dashed var(--surface-border-strong)", background: "var(--surface-1)" }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Add a goal</p>

                <p className="text-label" style={{ marginBottom: 8 }}>Thrust Area</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {THRUST_AREAS.map((area) => (
                    <button key={area} onClick={() => setNewGoal(g => ({ ...g, thrustArea: area }))} className={`thrust-tile ${newGoal.thrustArea === area ? "selected" : ""}`}>
                      {area}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="text-label" style={{ display: "block", marginBottom: 6 }}>Goal Title</label>
                  <input className="strata-input" placeholder="What will you achieve?" value={newGoal.title} onChange={e => setNewGoal(g => ({ ...g, title: e.target.value }))} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="text-label" style={{ display: "block", marginBottom: 6 }}>Description</label>
                  <textarea className="strata-input" rows={2} placeholder="Context, scope, and how you'll measure success…" value={newGoal.description} onChange={e => setNewGoal(g => ({ ...g, description: e.target.value }))} style={{ resize: "vertical" }} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="text-label" style={{ display: "block", marginBottom: 6 }}>Measurement Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {UOM_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => setNewGoal(g => ({ ...g, uomType: opt.value }))} className={`thrust-tile ${newGoal.uomType === opt.value ? "selected" : ""}`} style={{ padding: "12px 14px", height: "auto" }}>
                        <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{opt.label}</p>
                        <p style={{ fontSize: 11, color: "inherit", opacity: 0.7 }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label className="text-label" style={{ display: "block", marginBottom: 6 }}>Target Value</label>
                    <input type="number" className="strata-input" value={newGoal.targetValue} onChange={e => setNewGoal(g => ({ ...g, targetValue: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className="text-label" style={{ display: "block", marginBottom: 6 }}>Weight (%)</label>
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
              <div className="card" style={{ padding: 16, background: "var(--surface-3)" }}>
                <WeightageAllocator goals={draft.goals.map(g => ({ id: g.id!, title: g.title!, weightage: g.weightage! }))} />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
              <button className="btn-secondary" onClick={() => setStep("intention")}>Back</button>
              <button className="btn-primary" onClick={() => setStep("review")} disabled={draft.goals.length === 0}>
                Review canvas <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="card" style={{ padding: 24, marginBottom: 24, background: "var(--surface-3)", borderLeft: "3px solid var(--brand-amber)" }}>
              <p className="text-label" style={{ color: "var(--brand-amber)", marginBottom: 8 }}>Your intention</p>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, color: "var(--text-primary)" }}>
                "{draft.intentionStatement || "No intention statement written."}"
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {draft.goals.map((goal, i) => (
                <div key={i} className="card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p className="text-label" style={{ marginBottom: 4 }}>{goal.thrustArea} · {goal.weightage}%</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{goal.title}</p>
                  </div>
                  <span className="badge badge-neutral">
                    Target: {goal.targetValue}
                  </span>
                </div>
              ))}
            </div>

            <WeightageAllocator readOnly goals={draft.goals.map(g => ({ id: g.id!, title: g.title!, weightage: g.weightage! }))} />

            {!weightageValidation.isValid && (
              <p style={{ fontSize: 12, color: "var(--status-danger)", fontStyle: "italic", marginTop: 12 }}>{weightageValidation.message}</p>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button className="btn-secondary" onClick={() => setStep("goals")}>Back</button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!weightageValidation.isValid}
                style={{ opacity: weightageValidation.isValid ? 1 : 0.5 }}
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
