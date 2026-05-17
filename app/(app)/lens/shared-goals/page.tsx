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
    <div className="min-h-screen max-w-2xl px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A97A" }}>
          <Share2 size={12} className="inline mr-1.5" />
          Shared Goal Studio
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2C2A26" }}>
          Create team-wide goals.
        </h1>
        <p className="text-sm" style={{ color: "#7A5C3E" }}>
          A shared goal arrives like a letter, not a mandate. Your team sees it in context — why it matters, who it came from.
        </p>
      </motion.div>

      {/* Existing shared goals */}
      {sharedGoals.length > 0 && (
        <div className="mb-8 space-y-3">
          {sharedGoals.map(goal => (
            <div key={goal.id} className="p-4" style={{ background: "white", border: "1px solid rgba(122,92,62,0.12)", borderLeft: "3px solid #D4913A", borderRadius: "2px" }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#D4913A" }}>shared · {goal.thrustArea}</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "#2C2A26" }}>{goal.title}</p>
                </div>
                <p className="text-xs" style={{ color: "#C9A97A" }}>Target: {goal.targetValue}</p>
              </div>
              <p className="text-xs mt-2" style={{ color: "#7A5C3E" }}>
                Assigned to: {goal.recipients.map(id => USERS.find(u => u.id === id)?.name.split(" ")[0]).join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create button / form */}
      {!creating ? (
        <button className="btn-secondary flex items-center gap-2" onClick={() => setCreating(true)}>
          <Plus size={14} /> Create a shared goal
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5"
          style={{ border: "1px solid rgba(122,92,62,0.2)", borderRadius: "2px", background: "white" }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "#2C2A26" }}>New Shared Goal</p>

          <div className="mb-3">
            <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Thrust Area</label>
            <div className="grid grid-cols-2 gap-2">
              {THRUST_AREAS.slice(0, 6).map(area => (
                <button key={area} onClick={() => setForm(f => ({ ...f, thrustArea: area }))} className={`thrust-tile ${form.thrustArea === area ? "selected" : ""}`}>
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Title</label>
            <input className="strata-input" placeholder="What is the team working toward?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div className="mb-3">
            <label className="text-xs font-semibold tracking-wide uppercase block mb-1" style={{ color: "#C9A97A" }}>Target Value</label>
            <input type="number" className="strata-input" value={form.targetValue} onChange={e => setForm(f => ({ ...f, targetValue: parseFloat(e.target.value) || 0 }))} />
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold tracking-wide uppercase block mb-2" style={{ color: "#C9A97A" }}>Assign to</label>
            <div className="space-y-2">
              {team.map(member => (
                <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.recipients.includes(member.id)}
                    onChange={e => setForm(f => ({
                      ...f,
                      recipients: e.target.checked
                        ? [...f.recipients, member.id]
                        : f.recipients.filter(id => id !== member.id)
                    }))}
                    className="accent-amber-500"
                  />
                  <span className="text-sm" style={{ color: "#2C2A26" }}>{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-amber" onClick={handleCreate}>Deliver shared goal</button>
            <button className="btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
