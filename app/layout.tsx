import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: { default: "STRATA — Performance Intelligence", template: "%s | STRATA" },
  description: "Enterprise goal and growth intelligence. Every layer of effort, permanently recorded.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "DM Sans, system-ui, sans-serif", background: "#0D0D0E", color: "rgba(255,255,255,0.92)" }}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1C1C1F",
                color: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "13px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
