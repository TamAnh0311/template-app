import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

/**
 * Dashboard home placeholder.
 * Replace this with your app's actual dashboard content.
 */
export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-3xl space-y-6">
        {/* Heading */}
        <div>
          <h1 className="text-2xl font-display font-semibold text-app-text">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-app-text-secondary">
            Welcome! Build something great.
          </p>
        </div>

        {/* Placeholder card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["Feature A", "Feature B", "Feature C"].map((label) => (
            <div
              key={label}
              className="bg-app-card border border-app-border rounded-2xl p-5 shadow-card"
            >
              <div className="w-8 h-8 rounded-lg bg-app-accent-soft mb-3" />
              <p className="text-sm font-medium text-app-text">{label}</p>
              <p className="text-xs text-app-text-muted mt-1">
                Replace with real content
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
