import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#FAF7F2" }}>
      <Sidebar />
      <main
        className="flex-1 ml-56 min-h-screen"
        style={{ background: "#FAF7F2" }}
      >
        {children}
      </main>
    </div>
  );
}
