"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">Check your email</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            We sent a password reset link. It may take a minute to arrive.
          </p>
          <Link href="/signin" className="text-sm text-[var(--primary)] font-medium hover:underline">Back to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Reset password</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            {error && <p className="text-sm text-[var(--error)]">{error}</p>}
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Send reset link
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          <Link href="/signin" className="text-[var(--primary)] font-medium hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
