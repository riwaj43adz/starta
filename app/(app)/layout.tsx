import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-0)" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 220, minHeight: "100vh", overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
