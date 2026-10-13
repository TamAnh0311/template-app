import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// Opt every route into dynamic rendering so Supabase env vars
// are always available at request time (not at build time).
export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "App", template: "%s | App" },
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body bg-app-cream text-app-text antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
