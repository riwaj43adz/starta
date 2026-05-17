"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { USERS } from "@/lib/data/seed";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useUserStore();

  const handleLogin = (userId: string) => {
    const user = USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      router.push("/my-strata");
    }
  };

  const demoUsers = [
    { id: "user-aarav", label: "Aarav Mehta", role: "Product Manager", color: "#C4603A", desc: "First full year. Anxious, ambitious." },
    { id: "user-deepa", label: "Deepa Krishnan", role: "Senior Engineer", color: "#4A5E3A", desc: "7 years. Tired of invisible work." },
    { id: "user-rajiv", label: "Rajiv Sharma", role: "Engineering Manager", color: "#D4913A", desc: "12 reports. Needs to remember." },
    { id: "user-priya", label: "Priya Nair", role: "HR Business Partner", color: "#7A5C3E", desc: "Holds it together. Every March." },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#2C2A26" }}
    >
      {/* Geological strata background lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((opacity, i) => (
          <div
            key={i}
            className="absolute w-full"
            style={{
              top: `${15 + i * 12}%`,
              height: "1px",
              background: `rgba(201,169,122,${opacity * 0.06})`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="text-center mb-12 relative z-10"
      >
        {/* Wordmark */}
        <h1
          className="font-serif font-bold tracking-tight mb-3"
          style={{ fontSize: "clamp(72px, 12vw, 120px)", color: "#F5F0E8", letterSpacing: "-3px", lineHeight: "0.9" }}
        >
          STRATA
        </h1>
        <p
          className="font-serif italic text-lg"
          style={{ color: "#C9A97A" }}
        >
          Every layer of effort is the story of what you are becoming.
        </p>
      </motion.div>

      {/* Demo user selection */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <p
          className="text-center text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: "rgba(201,169,122,0.4)" }}
        >
          Enter as
        </p>

        <div className="space-y-3">
          {demoUsers.map((user, i) => (
            <motion.button
              key={user.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              onClick={() => handleLogin(user.id)}
              className="w-full text-left p-4 group transition-all duration-300"
              style={{
                background: "rgba(245,240,232,0.04)",
                border: "1px solid rgba(201,169,122,0.12)",
                borderLeft: `3px solid ${user.color}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F5F0E8" }}>
                    {user.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: user.color }}>
                    {user.role}
                  </p>
                  <p className="text-xs mt-1 font-serif italic" style={{ color: "rgba(245,240,232,0.35)" }}>
                    {user.desc}
                  </p>
                </div>
                <div
                  className="w-7 h-7 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "rgba(201,169,122,0.3)" }}
                >
                  →
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <p
          className="text-center text-xs mt-8 font-serif italic"
          style={{ color: "rgba(201,169,122,0.25)" }}
        >
          "We do not measure performance. We witness it."
        </p>
      </motion.div>

      {/* Layers bar at bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 flex h-1.5"
      >
        {["#C4603A", "#D4913A", "#7A9170", "#4A5E3A", "#7A5C3E", "#4A5568"].map((color, i) => (
          <motion.div
            key={i}
            className="flex-1"
            style={{ background: color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </div>
    </div>
  );
}
