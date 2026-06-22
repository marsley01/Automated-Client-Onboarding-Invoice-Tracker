"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { createJobSchema, type CreateJobData } from "@/lib/validations";
import { cn, getInitials } from "@/lib/utils";
import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";

interface ClientResult {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
}

export default function NewJobPage() {
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<ClientResult[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientResult | null>(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateJobData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: { category: "general", priority: "normal" },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  };

  const searchClients = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 1) {
      setClients([]);
      setShowDropdown(false);
      return;
    }

    const sb = getSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    const { data: bu } = await sb.from("business_users").select("business_id").eq("user_id", user.id).single();
    if (!bu) return;

    const { data } = await sb
      .from("clients")
      .select("id, name, email, phone, company")
      .eq("business_id", bu.business_id)
      .or(`name.ilike.%${term}%,email.ilike.%${term}%`)
      .limit(5);

    setClients(data || []);
    setShowDropdown(true);
  };

  const selectClient = (client: ClientResult) => {
    setSelectedClient(client);
    setSearchTerm(client.name);
    setShowDropdown(false);
    setShowNewClient(false);
  };

  const onSubmit = async (data: CreateJobData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, client_id: selectedClient?.id }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      addToast(
        `Job created! Client portal: ${window.location.origin}/c/${result.client_token}`,
        "success"
      );
      router.push(`/jobs/${result.id}`);
    } catch (err: any) {
      addToast(err.message || "Failed to create job", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Topbar />
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-6">New Job</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="p-5">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Client</h2>
                {selectedClient ? (
                  <div className="flex items-center justify-between p-3 card-surface-raised rounded-[8px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                        {getInitials(selectedClient.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{selectedClient.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{selectedClient.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedClient(null); setSearchTerm(""); }}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <Input
                      placeholder="Search existing clients..."
                      value={searchTerm}
                      onChange={(e) => searchClients(e.target.value)}
                      onFocus={() => clients.length > 0 && setShowDropdown(true)}
                    />
                    {showDropdown && clients.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 card-surface-raised border border-[var(--border)] rounded-[8px] overflow-hidden z-10">
                        {clients.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-blue-50/50 transition-colors flex items-center gap-3"
                            onClick={() => selectClient(c)}
                          >
                            <div className="w-8 h-8 rounded-full bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] font-bold text-xs">
                              {getInitials(c.name)}
                            </div>
                            <div>
                              <p className="font-medium">{c.name}</p>
                              <p className="text-xs text-[var(--text-muted)]">{c.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      className="text-xs text-[var(--primary)] hover:underline mt-2"
                      onClick={() => setShowNewClient(!showNewClient)}
                    >
                      {showNewClient ? "Cancel" : "+ Create new client"}
                    </button>
                    {showNewClient && (
                      <div className="mt-3 space-y-3 pt-3 border-t border-[var(--border)]">
                        <Input label="Full Name" {...register("client_name")} error={errors.client_name?.message} />
                        <Input label="Email" type="email" {...register("client_email")} error={errors.client_email?.message} />
                        <Input label="Phone" {...register("client_phone")} />
                        <Input label="Company" {...register("client_company")} />
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-5 space-y-4">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Job Details</h2>
                <Input label="Title *" {...register("title")} error={errors.title?.message} />
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Category"
                    options={[
                      { value: "general", label: "General" },
                      { value: "consulting", label: "Consulting" },
                      { value: "design", label: "Design" },
                      { value: "development", label: "Development" },
                      { value: "marketing", label: "Marketing" },
                      { value: "writing", label: "Writing" },
                      { value: "financial", label: "Financial" },
                      { value: "legal", label: "Legal" },
                      { value: "repair", label: "Repair" },
                      { value: "maintenance", label: "Maintenance" },
                      { value: "cleaning", label: "Cleaning" },
                      { value: "photography", label: "Photography" },
                      { value: "education", label: "Education" },
                      { value: "health", label: "Health" },
                      { value: "logistics", label: "Logistics" },
                      { value: "event", label: "Event" },
                      { value: "other", label: "Other" },
                    ]}
                    {...register("category")}
                  />
                  <Select
                    label="Priority"
                    options={[
                      { value: "low", label: "Low" },
                      { value: "normal", label: "Normal" },
                      { value: "high", label: "High" },
                      { value: "urgent", label: "Urgent" },
                    ]}
                    {...register("priority")}
                  />
                </div>
                <Textarea label="Description" rows={4} {...register("description")} />
                <Input label="Due Date" type="date" {...register("due_date")} />
                <details className="group">
                  <summary className="text-sm text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                    Internal notes
                  </summary>
                  <div className="mt-2">
                    <Textarea rows={3} {...register("internal_notes")} />
                  </div>
                </details>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" loading={loading}>Create Job</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
