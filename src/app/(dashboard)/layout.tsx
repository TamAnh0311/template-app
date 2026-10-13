import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard" },
};

/**
 * Dashboard shell layout with a minimal sidebar placeholder.
 * Replace the sidebar items with your app's navigation.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-app-cream">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-app-border bg-app-card flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-app-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-app-accent" />
            <span className="text-sm font-semibold text-app-text">App</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          <SidebarLink href="/dashboard" label="Home" />
          {/* Add more navigation links here */}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-app-border">
          <form action="/auth/callback" method="post">
            <button
              type="button"
              className="text-xs text-app-text-muted hover:text-app-text transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-app-text-secondary hover:bg-app-cream hover:text-app-text transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-app-border" />
      {label}
    </Link>
  );
}
