"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard, Target, Clock, Archive, TrendingUp,
  Users, FileCheck, MessageSquare, Share2,
  Map, Settings, FileText, BarChart3,
  Sun, Moon,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { GOAL_SHEETS } from "@/lib/data/seed";
import { getInitials } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, demoRole, switchDemoRole } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();

  // Apply theme to document on mount + change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (!currentUser) return null;

  const showManager = demoRole === "manager" || demoRole === "admin";
  const showAdmin   = demoRole === "admin";

  // Real pending count from seed
  const pendingCount = GOAL_SHEETS.filter(s => s.status === "submitted").length;

  const isActive = (href: string) =>
    pathname === href || (href !== "/my-strata" && pathname.startsWith(href));

  const NavLink = ({ href, label, icon: Icon, badge }: {
    href: string; label: string; icon: React.ElementType; badge?: number
  }) => (
    <Link href={href}>
      <div className={`nav-item ${isActive(href) ? "active" : ""}`}>
        <Icon size={14} strokeWidth={isActive(href) ? 2.2 : 1.8} />
        <span style={{ fontSize: 13 }}>{label}</span>
        {badge != null && badge > 0 && <span className="nav-badge">{badge}</span>}
      </div>
    </Link>
  );

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Link href="/my-strata">
          <div className="sidebar-brand">STRATA</div>
          <div className="sidebar-tagline">Performance Intelligence</div>
        </Link>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: "var(--surface-3)",
            border: "1px solid var(--surface-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0, marginTop: 2, transition: "all 200ms",
          }}
        >
          {theme === "dark"
            ? <Sun size={13} style={{ color: "var(--text-tertiary)" }} />
            : <Moon size={13} style={{ color: "var(--text-tertiary)" }} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        <div className="sidebar-section">
          <div className="sidebar-section-label">My Workspace</div>
          <NavLink href="/my-strata" label="Dashboard"   icon={LayoutDashboard} />
          <NavLink href="/canvas"    label="Goal Canvas"  icon={Target} />
          <NavLink href="/check-in"  label="This Quarter" icon={Clock} />
          <NavLink href="/layers"    label="My History"   icon={Archive} />
          <NavLink href="/analytics" label="Analytics"    icon={TrendingUp} />
        </div>

        {showManager && (
          <div className="sidebar-section" style={{ marginTop: 8 }}>
            <div className="sidebar-section-label">The Lens</div>
            <NavLink href="/lens"              label="Team Overview"  icon={Users} />
            <NavLink href="/lens/approvals"    label="Approvals"      icon={FileCheck} badge={pendingCount} />
            <NavLink href="/lens/check-in-room"label="Check-in Room"  icon={MessageSquare} />
            <NavLink href="/lens/shared-goals" label="Shared Goals"   icon={Share2} />
          </div>
        )}

        {showAdmin && (
          <div className="sidebar-section" style={{ marginTop: 8 }}>
            <div className="sidebar-section-label">Administration</div>
            <NavLink href="/map-room"          label="Map Room"       icon={Map} />
            <NavLink href="/map-room/cycles"   label="Cycle Config"   icon={Settings} />
            <NavLink href="/map-room/audit"    label="Audit Trail"    icon={FileText} />
            <NavLink href="/map-room/reports"  label="Reports"        icon={BarChart3} />
          </div>
        )}
      </nav>

      {/* Role switcher */}
      <div style={{ padding: "10px", borderTop: "1px solid var(--surface-border)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", paddingLeft: 4, marginBottom: 6 }}>
          Demo Mode
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--surface-3)", borderRadius: 6, padding: 3, border: "1px solid var(--surface-border)" }}>
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
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 6, flexShrink: 0,
          background: "var(--brand-amber-dim)",
          border: "1px solid rgba(232,162,58,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "var(--brand-amber)",
        }}>
          {getInitials(currentUser.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentUser.name}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", textTransform: "capitalize" }}>
            {currentUser.role} · {currentUser.department}
          </div>
        </div>
      </div>
    </aside>
  );
}
