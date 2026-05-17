"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Target, Clock, Archive,
  Users, FileCheck, MessageSquare, Share2,
  Map, Settings, FileText, BarChart3,
  TrendingUp, Bell,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import { getInitials } from "@/lib/utils";

const EMPLOYEE_NAV = [
  { label: "Dashboard", href: "/my-strata", icon: LayoutDashboard },
  { label: "Goal Canvas", href: "/canvas", icon: Target },
  { label: "This Quarter", href: "/check-in", icon: Clock },
  { label: "My History", href: "/layers", icon: Archive },
  { label: "Analytics", href: "/analytics", icon: TrendingUp },
];

const MANAGER_NAV = [
  { label: "Team Overview", href: "/lens", icon: Users },
  { label: "Approvals", href: "/lens/approvals", icon: FileCheck, badge: 2 },
  { label: "Check-in Room", href: "/lens/check-in-room", icon: MessageSquare },
  { label: "Shared Goals", href: "/lens/shared-goals", icon: Share2 },
];

const ADMIN_NAV = [
  { label: "Map Room", href: "/map-room", icon: Map },
  { label: "Cycle Config", href: "/map-room/cycles", icon: Settings },
  { label: "Audit Trail", href: "/map-room/audit", icon: FileText },
  { label: "Reports", href: "/map-room/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, demoRole, switchDemoRole } = useUserStore();

  const showManager = demoRole === "manager" || demoRole === "admin";
  const showAdmin = demoRole === "admin";

  if (!currentUser) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/my-strata" && pathname.startsWith(href));

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link href="/my-strata">
          <div className="sidebar-brand">STRATA</div>
          <div className="sidebar-tagline">Performance Intelligence</div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        {/* Employee */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">My Workspace</div>
          {EMPLOYEE_NAV.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <div className={`nav-item ${isActive(href) ? "active" : ""}`}>
                <Icon size={14} strokeWidth={isActive(href) ? 2.2 : 1.8} />
                <span>{label}</span>
              </div>
            </Link>
          ))}
        </div>

        {showManager && (
          <div className="sidebar-section" style={{ marginTop: 8 }}>
            <div className="sidebar-section-label">The Lens</div>
            {MANAGER_NAV.map(({ label, href, icon: Icon, badge }) => (
              <Link key={href} href={href}>
                <div className={`nav-item ${isActive(href) ? "active" : ""}`}>
                  <Icon size={14} strokeWidth={1.8} />
                  <span>{label}</span>
                  {badge && <span className="nav-badge">{badge}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {showAdmin && (
          <div className="sidebar-section" style={{ marginTop: 8 }}>
            <div className="sidebar-section-label">Administration</div>
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className={`nav-item ${isActive(href) ? "active" : ""}`}>
                  <Icon size={14} strokeWidth={1.8} />
                  <span>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Role switcher */}
      <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", paddingLeft: 4, marginBottom: 6 }}>
          Demo Mode
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: 3 }}>
          {(["employee", "manager", "admin"] as const).map((role) => (
            <button
              key={role}
              className={`role-pill ${demoRole === role ? "active" : ""}`}
              onClick={() => switchDemoRole(role)}
            >
              {role === "employee" ? "Aarav" : role === "manager" ? "Rajiv" : "Priya"}
            </button>
          ))}
        </div>
      </div>

      {/* User */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 6,
          background: "linear-gradient(135deg, rgba(232,162,58,0.3), rgba(232,162,58,0.1))",
          border: "1px solid rgba(232,162,58,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "var(--brand-amber)",
          flexShrink: 0,
        }}>
          {getInitials(currentUser.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {currentUser.name}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", textTransform: "capitalize" }}>
            {currentUser.role} · Engineering
          </div>
        </div>
      </div>
    </aside>
  );
}
