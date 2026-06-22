import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobDetailClient from "./client";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: job } = await supabase
    .from("jobs")
    .select("*, clients(*)")
    .eq("id", params.id)
    .single();

  if (!job) redirect("/jobs");

  const { data: history } = await supabase
    .from("job_status_history")
    .select("*")
    .eq("job_id", params.id)
    .order("created_at", { ascending: true });

  const { data: attachments } = await supabase
    .from("job_attachments")
    .select("*")
    .eq("job_id", params.id)
    .order("created_at", { ascending: false });

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("job_id", params.id)
    .order("created_at", { ascending: false });

  return (
    <JobDetailClient
      job={job}
      history={history || []}
      attachments={attachments || []}
      invoices={invoices || []}
    />
  );
}
