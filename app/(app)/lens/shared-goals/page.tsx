"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { THRUST_AREAS } from "@/lib/types";
import type { UoMType } from "@/lib/types";
import { USERS, getTeamForManager } from "@/lib/data/seed";
import { useUserStore } from "@/lib/store/useUserStore";
import { toast } from "sonner";
import { Share2, Plus } from "lucide-react";

export default function SharedGoalsPage() {
  const { currentUser } = useUserStore();
  const [sharedGoals, setSharedGoals] = useState<Array<{
    id: string; title: string; thrustArea: string; targetValue: number;
    uomType: UoMType; recipients: string[];
  }>>([]);
  const [form, setForm] = useState({ title: "", thrustArea: "", targetValue: 0, uomType: "numeric_max" as UoMType, recipients: [] as string[] });
  const [creating, setCreating] = useState(false);

  if (!currentUser) return null;
  const team = getTeamForManager(currentUser.id);

  const handleCreate = () => {
    if (!form.title || !form.thrustArea || form.recipients.length === 0) {
      toast.error("Fill in the goal and select at least one team member.");
      return;
    }
    setSharedGoals(prev => [...prev, { ...form, id: `shared-${Date.now()}` }]);
    setForm({ title: "", thrustArea: "", targetValue: 0, uomType: "numeric_max", recipients: [] });
    setCreating(false);
    toast.success("Shared goal delivered to the team.");
  };

  return (
    <div className="page-container" style={{ maxWidth: 860 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <p className="text-label" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Share2 size={12} />
          Shared Goal Studio
        </p>
        <h1 className="text-display-lg" style={{ marginBottom: 8 }}>
          Create team-wide goals.
        </h1>
        <p className="text-body">
          A shared goal arrives like a letter, not a mandate. Your team sees it in context — why it matters, who it came from.
        </p>
      </motion.div>

      {/* Existing shared goals */}
      {sharedGoals.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {sharedGoals.map(goal => (
            <div key={goal.id} className="card" style={{ padding: 20, borderLeft: "3px solid var(--brand-amber)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <p className="text-label" style={{ color: "var(--brand-amber)", marginBottom: 4 }}>shared · {goal.thrustArea}</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{goal.title}</p>
                </div>
                <p className="badge badge-neutral">Target: {goal.targetValue}</p>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                Assigned to: {goal.recipients.map(id => USERS.find(u => u.id === id)?.name.split(" ")[0]).join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create button / form */}
      {!creating ? (
        <button className="btn-secondary" onClick={() => setCreating(true)}>
          <Plus size={14} /> Create a shared goal
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: 24 }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 20 }}>New Shared Goal</p>

          <div style={{ marginBottom: 16 }}>
            <label className="text-label" style={{ display: "block", marginBottom: 8 }}>Thrust Area</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {THRUST_AREAS.slice(0, 6).map(area => (
                <button key={area} onClick={() => setForm(f => ({ ...f, thrustArea: area }))} className={`thrust-tile ${form.thrustArea === area ? "selected" : ""}`}>
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="text-label" style={{ display: "block", marginBottom: 8 }}>Title</label>
            <input className="strata-input" placeholder="What is the team working toward?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="text-label" style={{ display: "block", marginBottom: 8 }}>Target Value</label>
            <input type="number" className="strata-input" value={form.targetValue} onChange={e => setForm(f => ({ ...f, targetValue: parseFloat(e.target.value) || 0 }))} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="text-label" style={{ display: "block", marginBottom: 8 }}>Assign to</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {team.map(member => (
                <label key={member.id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.recipients.includes(member.id)}
                    onChange={e => setForm(f => ({
                      ...f,
                      recipients: e.target.checked
                        ? [...f.recipients, member.id]
                        : f.recipients.filter(id => id !== member.id)
                    }))}
                    style={{ accentColor: "var(--brand-amber)" }}
                  />
                  <span style={{ fontSize: 14, color: "var(--text-primary)" }}>{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary" onClick={handleCreate}>Deliver shared goal</button>
            <button className="btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
