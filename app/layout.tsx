import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "STRATA — A Record of Becoming",
    template: "%s | STRATA",
  },
  description:
    "Every layer of effort is the story of what you are becoming. STRATA is a goal and growth experience that records depth, not just distance.",
  keywords: ["performance", "goals", "growth", "strata", "record", "becoming"],
  openGraph: {
    title: "STRATA — A Record of Becoming",
    description:
      "Every layer of effort is the story of what you are becoming.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans bg-bone text-ink antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#2C2A26",
                color: "#F5F0E8",
                border: "1px solid rgba(201,169,122,0.2)",
                borderRadius: "2px",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
