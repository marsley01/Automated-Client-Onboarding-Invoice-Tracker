"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { signinSchema, type SigninData } from "@/lib/validations";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SigninData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninData) => {
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Welcome back</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Sign in to your Mash account</p>
        </div>

        <div className="card-surface-raised p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            {error && <p className="text-sm text-[var(--error)]">{error}</p>}
            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[var(--primary)] hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
