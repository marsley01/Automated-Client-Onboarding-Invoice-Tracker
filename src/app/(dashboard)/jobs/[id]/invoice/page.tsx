import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InvoicePageClient from "./client";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: job } = await supabase
    .from("jobs")
    .select("*, clients(*), businesses(id, invoice_prefix, invoice_counter)")
    .eq("id", params.id)
    .single();

  if (!job) redirect("/jobs");

  const { data: existingInvoices } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("job_id", params.id)
    .order("created_at", { ascending: false });

  const invoice = existingInvoices?.[0] || null;

  return <InvoicePageClient job={job} invoice={invoice} />;
}
