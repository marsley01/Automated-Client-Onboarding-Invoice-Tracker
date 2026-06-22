"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const schema = z.object({
  password: z.string().min(8, "At least 8 characters"),
});
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    setTimeout(() => setReady(true), 1000);
  }, []);

  const onSubmit = async (data: FormData) => {
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: data.password });
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Set new password</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Choose a new password for your account.</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm">
          {!ready ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">Verifying...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New password"
                type="password"
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                {...register("password")}
              />
              {error && <p className="text-sm text-[var(--error)]">{error}</p>}
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Update password
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          <Link href="/signin" className="text-[var(--primary)] font-medium hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
