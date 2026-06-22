"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupStep1Schema, signupStep2Schema, type SignupStep1Data, type SignupStep2Data } from "@/lib/validations";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const steps = ["Your account", "Your business"];

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const step1 = useForm<SignupStep1Data>({
    resolver: zodResolver(signupStep1Schema),
  });

  const step2 = useForm<SignupStep2Data>({
    resolver: zodResolver(signupStep2Schema),
    defaultValues: { city: "Nairobi", business_type: "repair_shop" },
  });

  const [step1Data, setStep1Data] = useState<SignupStep1Data | null>(null);

  const handleStep1 = async (data: SignupStep1Data) => {
    setStep1Data(data);
    setStep(1);
  };

  const handleSubmit = async (data: SignupStep2Data) => {
    if (!step1Data) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...step1Data, ...data }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">F</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Create your account</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Set up your Dicosis workspace</p>
        </div>

        <div className="flex items-center gap-2 mb-6 justify-center">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                i <= step ? "bg-[var(--primary-muted)] border-[var(--primary)] text-[var(--primary)]" : "bg-transparent border-[var(--border)] text-[var(--text-muted)]"
              )}>
                {i + 1}
              </div>
              <span className={cn("text-xs", i <= step ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>
                {s}
              </span>
              {i < steps.length - 1 && <div className={cn("w-8 h-0.5", i < step ? "bg-[var(--primary)]" : "bg-[var(--border)]")} />}
            </div>
          ))}
        </div>

        <div className="card-surface-raised p-6">
          {step === 0 && (
            <form onSubmit={step1.handleSubmit(handleStep1)} className="space-y-4">
              <Input label="Full name" placeholder="John Doe" error={step1.formState.errors.name?.message} {...step1.register("name")} />
              <Input label="Email" type="email" placeholder="you@example.com" error={step1.formState.errors.email?.message} {...step1.register("email")} />
              <Input label="Password" type="password" placeholder="Min. 8 characters" error={step1.formState.errors.password?.message} {...step1.register("password")} />
              <Button type="submit" className="w-full">Continue</Button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={step2.handleSubmit(handleSubmit)} className="space-y-4">
              <Input label="Business name" placeholder="My Agency" error={step2.formState.errors.business_name?.message} {...step2.register("business_name")} />
              <Select
                label="Business type"
                options={[
                  { value: "repair_shop", label: "Repair Shop" },
                  { value: "design_agency", label: "Design Agency" },
                  { value: "freelancer", label: "Freelancer" },
                  { value: "consulting_firm", label: "Consulting Firm" },
                  { value: "other", label: "Other" },
                ]}
                {...step2.register("business_type")}
              />
              <Input label="Phone (optional)" placeholder="+254 712 345 678" {...step2.register("phone")} />
              <Input label="City" placeholder="Nairobi" {...step2.register("city")} />
              {error && <p className="text-sm text-[var(--error)]">{error}</p>}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(0)} className="flex-1">Back</Button>
                <Button type="submit" className="flex-1" loading={loading}>Create account</Button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-[var(--primary)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
