import { NextResponse } from "next/server";
import { createCookieClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler.
 * Supabase redirects here after a successful OAuth sign-in.
 * Exchanges the one-time code for a session and redirects the user.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createCookieClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // On failure redirect to login with an error hint.
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
