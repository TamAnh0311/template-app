import Link from "next/link";

/**
 * Landing page placeholder.
 * Replace this with your project's actual landing page content.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-app-cream flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Logo / App name */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-app-accent mx-auto mb-4" />
          <h1 className="text-3xl font-display font-semibold text-app-text tracking-tight">
            App
          </h1>
          <p className="text-app-text-secondary text-base leading-relaxed">
            Your project description goes here.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-app-accent text-white text-sm font-medium transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-app-border bg-app-card text-app-text text-sm font-medium transition-colors hover:bg-app-cream"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
