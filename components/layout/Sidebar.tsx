"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Layers, Target, Clock, Archive, Eye, Users,
  MessageSquare, Share2, Map, Settings, FileText,
  BarChart3, User, ChevronRight,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const EMPLOYEE_NAV = [
  { label: "My Strata", href: "/my-strata", icon: Layers },
  { label: "Goal Canvas", href: "/canvas", icon: Target },
  { label: "This Quarter", href: "/check-in", icon: Clock },
  { label: "My Layers", href: "/layers", icon: Archive },
];

const MANAGER_NAV = [
  { label: "Team Lens", href: "/lens", icon: Eye },
  { label: "Approvals", href: "/lens/approvals", icon: FileText },
  { label: "Check-in Room", href: "/lens/check-in-room", icon: MessageSquare },
  { label: "Shared Goals", href: "/lens/shared-goals", icon: Share2 },
];

const ADMIN_NAV = [
  { label: "Map Room", href: "/map-room", icon: Map },
  { label: "Cycles", href: "/map-room/cycles", icon: Settings },
  { label: "Audit Trail", href: "/map-room/audit", icon: FileText },
  { label: "Reports", href: "/map-room/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, demoRole, switchDemoRole } = useUserStore();

  const showManagerNav = demoRole === "manager" || demoRole === "admin";
  const showAdminNav = demoRole === "admin";

  if (!currentUser) return null;

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-56 flex flex-col z-40"
      style={{
        background: "#2C2A26",
        borderRight: "1px solid rgba(201,169,122,0.08)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid rgba(201,169,122,0.08)" }}
      >
        <Link href="/my-strata" className="block">
          <span
            className="font-serif text-2xl font-bold tracking-tight"
            style={{ color: "#F5F0E8" }}
          >
            STRATA
          </span>
          <p
            className="text-xs mt-0.5 leading-snug italic"
            style={{ color: "rgba(201,169,122,0.5)", fontFamily: "Playfair Display, serif" }}
          >
            A record of becoming
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Employee section */}
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase px-2 mb-2"
            style={{ color: "rgba(201,169,122,0.35)" }}
          >
            My Work
          </p>
          {EMPLOYEE_NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} className="block">
                <div
                  className={cn(
                    "nav-item",
                    active && "active"
                  )}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                  {active && (
                    <motion.div
                      className="ml-auto w-1 h-1 rounded-full"
                      style={{ background: "#D4913A" }}
                      layoutId="nav-dot"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Manager section */}
        {showManagerNav && (
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase px-2 mb-2"
              style={{ color: "rgba(201,169,122,0.35)" }}
            >
              The Lens
            </p>
            {MANAGER_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link key={href} href={href} className="block">
                  <div className={cn("nav-item", active && "active")}>
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Admin section */}
        {showAdminNav && (
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase px-2 mb-2"
              style={{ color: "rgba(201,169,122,0.35)" }}
            >
              Map Room
            </p>
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link key={href} href={href} className="block">
                  <div className={cn("nav-item", active && "active")}>
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Role switcher (demo) */}
      <div
        className="px-3 py-3"
        style={{ borderTop: "1px solid rgba(201,169,122,0.08)" }}
      >
        <p
          className="text-xs tracking-widest uppercase px-2 mb-2"
          style={{ color: "rgba(201,169,122,0.3)" }}
        >
          Demo: Switch role
        </p>
        <div className="flex gap-1">
          {(["employee", "manager", "admin"] as const).map((role) => (
            <button
              key={role}
              onClick={() => switchDemoRole(role)}
              className="flex-1 py-1 text-xs font-medium tracking-wide capitalize transition-all duration-200"
              style={{
                borderRadius: "1px",
                background: demoRole === role ? "rgba(212,145,58,0.2)" : "transparent",
                color: demoRole === role ? "#D4913A" : "rgba(201,169,122,0.4)",
                border: demoRole === role ? "1px solid rgba(212,145,58,0.3)" : "1px solid transparent",
              }}
            >
              {role === "employee" ? "Aarav" : role === "manager" ? "Rajiv" : "Priya"}
            </button>
          ))}
        </div>
      </div>

      {/* User */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ borderTop: "1px solid rgba(201,169,122,0.08)" }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center text-xs font-semibold flex-shrink-0"
          style={{
            background: "rgba(201,169,122,0.15)",
            color: "#C9A97A",
            borderRadius: "2px",
          }}
        >
          {getInitials(currentUser.name)}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: "#F5F0E8" }}>
            {currentUser.name}
          </p>
          <p className="text-xs truncate capitalize" style={{ color: "rgba(201,169,122,0.5)" }}>
            {currentUser.role}
          </p>
        </div>
      </div>
    </aside>
  );
}
