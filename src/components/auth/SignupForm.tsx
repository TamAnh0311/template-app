"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Email + password registration form.
 * On success shows a "check your email" message.
 */
export function SignupForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    try {
      await signUp(values.email, values.password);
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Sign up failed. Please try again.";
      setServerError(message);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-2 py-4">
        <p className="text-app-text font-medium">Check your email</p>
        <p className="text-sm text-app-text-secondary">
          We sent you a confirmation link. Click it to activate your account.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-4 text-sm text-app-accent hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
      noValidate
    >
      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-app-text">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 rounded-xl border border-app-border bg-app-card text-app-text placeholder:text-app-text-muted text-sm outline-none focus:ring-2 focus:ring-app-accent/30 focus:border-app-accent transition-colors"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-app-text">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 rounded-xl border border-app-border bg-app-card text-app-text placeholder:text-app-text-muted text-sm outline-none focus:ring-2 focus:ring-app-accent/30 focus:border-app-accent transition-colors"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-app-text"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 rounded-xl border border-app-border bg-app-card text-app-text placeholder:text-app-text-muted text-sm outline-none focus:ring-2 focus:ring-app-accent/30 focus:border-app-accent transition-colors"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Server error */}
      {serverError && (
        <p className="text-xs text-red-500 text-center">{serverError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-app-accent text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
