"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { USERS } from "@/lib/data/seed";
import { ArrowRight, BarChart3, Target, Users, Shield } from "lucide-react";

const PERSONAS = [
  { id: "user-aarav",  name: "Aarav Mehta",    role: "Product Manager",        dept: "Engineering",    tag: "Employee view",   tagColor: "#5B8C6E",   desc: "Setting goals for the first time. Building something real." },
  { id: "user-deepa",  name: "Deepa Krishnan",  role: "Senior Engineer",         dept: "Engineering",    tag: "Employee view",   tagColor: "#5B8C6E",   desc: "7 years in. Tired of invisible work." },
  { id: "user-rajiv",  name: "Rajiv Sharma",    role: "Engineering Manager",     dept: "Engineering",    tag: "Manager view",    tagColor: "#4A7A9B",   desc: "12 direct reports. Needs the full picture." },
  { id: "user-priya",  name: "Priya Nair",      role: "HR Business Partner",     dept: "Human Resources",tag: "Admin view",      tagColor: "#9B7A5B",   desc: "Owns the cycle. Builds the audit record." },
];

const FEATURES = [
  { icon: Target,   label: "Goal Canvas",         desc: "Structured goal-setting with weightage allocation" },
  { icon: BarChart3,label: "Performance Analytics",desc: "Radar charts, heatmaps, trend lines" },
  { icon: Users,    label: "Team Intelligence",    desc: "Manager lens with pre-meeting briefs" },
  { icon: Shield,   label: "Immutable Audit Trail",desc: "Every change logged and defensible" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, switchDemoRole } = useUserStore();

  const handleLogin = (userId: string) => {
    const user = USERS.find(u => u.id === userId);
    if (!user) return;
    setCurrentUser(user);
    switchDemoRole(user.role as any);
    router.push(user.role === "manager" ? "/lens" : user.role === "admin" ? "/map-room" : "/my-strata");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-0)", display: "flex", overflow: "hidden" }}>
      {/* Left panel */}
      <div style={{ flex: "0 0 420px", background: "var(--surface-1)", borderRight: "1px solid var(--surface-border)", display: "flex", flexDirection: "column", padding: "48px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--text-primary)", letterSpacing: "0.02em", lineHeight: 1 }}>
            STRATA
          </div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", letterSpacing: "0.05em", marginTop: 4, textTransform: "uppercase", fontWeight: 600 }}>
            Performance Intelligence Platform
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginTop: 40, marginBottom: 36 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--text-primary)", lineHeight: 1.3, fontStyle: "italic" }}>
            "A record of becoming, not a tracker of tasks."
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 12, lineHeight: 1.7 }}>
            STRATA replaces annual performance review chaos with a living, layered record that captures achievement AND context.
          </p>
        </motion.div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: "auto" }}>
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div key={label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
              style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--brand-amber-dim)", border: "1px solid rgba(232,162,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={14} style={{ color: "var(--brand-amber)" }} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 1 }}>{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--surface-border)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 6 }}>
            Acme Corporation · FY 2025–26
          </div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", opacity: 0.7 }}>Confidential · Internal Use Only</div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 8 }}>Demo — Select a user to continue</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--text-primary)" }}>Who are you today?</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PERSONAS.map(({ id, name, role, dept, tag, tagColor, desc }, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                onClick={() => handleLogin(id)}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "16px 18px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: 10, cursor: "pointer",
                  transition: "all 200ms",
                  display: "flex", alignItems: "center", gap: 14,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--surface-border-strong)";
                  e.currentTarget.style.background = "var(--surface-3)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--surface-border)";
                  e.currentTarget.style.background = "var(--surface-2)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${tagColor}20`, border: `1px solid ${tagColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: tagColor, flexShrink: 0, letterSpacing: "0.04em" }}>
                  {name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{name}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 3, background: `${tagColor}18`, color: tagColor, letterSpacing: "0.03em" }}>{tag}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 1 }}>{role} · {dept}</div>
                  <div style={{ fontSize: 11.5, fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--text-secondary)", opacity: 0.8, marginTop: 3 }}>{desc}</div>
                </div>
                <ArrowRight size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
              </motion.button>
            ))}
          </div>

          <p style={{ fontSize: 11, color: "var(--text-tertiary)", textAlign: "center", marginTop: 28, fontStyle: "italic" }}>
            Each persona has live data, pre-seeded goals, and 3 quarters of history.
          </p>
        </motion.div>
      </div>

      {/* Bottom strata bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 3, display: "flex" }}>
        {["var(--status-danger)","var(--brand-amber)","var(--status-success)","var(--layer-growing)","var(--layer-solid)","var(--status-info)"].map((c, i) => (
          <motion.div key={i} style={{ flex: 1, background: c }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.7 + i * 0.07, ease: [0.25,0.46,0.45,0.94] }}
          />
        ))}
      </div>
    </div>
  );
}
