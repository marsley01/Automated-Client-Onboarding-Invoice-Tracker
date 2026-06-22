"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SubmissionForm from "@/components/client/SubmissionForm";
import { useToast } from "@/components/ui/Toast";

export default function ClientSubmitPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { addToast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [jobNumber, setJobNumber] = useState("");

  useState(() => {
    fetch(`/api/client/${token}`)
      .then((r) => r.json())
      .then((data) => {
        setJobTitle(data.title);
        setJobNumber(data.job_number);
      })
      .catch(() => {});
  });

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/client/${token}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Submission failed");
    addToast("Details submitted successfully!", "success");
    router.push(`/c/${token}`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <SubmissionForm
        jobTitle={jobTitle || "Loading..."}
        jobNumber={jobNumber}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
