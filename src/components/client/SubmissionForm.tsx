"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { clientSubmissionSchema, type ClientSubmissionData } from "@/lib/validations";

interface SubmissionFormProps {
  jobTitle: string;
  jobNumber: string;
  onSubmit: (data: ClientSubmissionData) => Promise<void>;
}

export default function SubmissionForm({ jobTitle, jobNumber, onSubmit }: SubmissionFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClientSubmissionData>({
    resolver: zodResolver(clientSubmissionSchema),
  });

  return (
    <div className="max-w-lg mx-auto">
      <div className="card-surface-raised p-8">
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-1">{jobTitle}</h1>
          <p className="text-sm text-[var(--text-muted)]">{jobNumber}</p>
        </div>
        <p className="text-sm text-[var(--text-subtle)] mb-6 text-center">
          Please provide your details and describe what you need done.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Your Name"
            error={errors.client_name?.message}
            {...register("client_name")}
          />
          <Input
            label="Email"
            type="email"
            error={errors.client_email?.message}
            {...register("client_email")}
          />
          <Input
            label="Phone (optional)"
            {...register("client_phone")}
          />
          <Textarea
            label="What do you need done?"
            error={errors.description?.message}
            rows={5}
            {...register("description")}
          />
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
