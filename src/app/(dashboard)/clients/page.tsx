import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import ClientsClient from "./client";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: businessUser } = await supabase
    .from("business_users")
    .select("business_id")
    .eq("user_id", user.id)
    .single();

  if (!businessUser) redirect("/signin");

  const businessId = businessUser.business_id;

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const admin = createAdminClient();

  const { data: jobs } = await admin
    .from("jobs")
    .select("client_id, status")
    .eq("business_id", businessId);

  const { data: invoices } = await admin
    .from("invoices")
    .select("client_id, balance_due")
    .eq("business_id", businessId)
    .in("status", ["sent", "partially_paid", "overdue"]);

  const jobCounts = new Map<string, number>();
  jobs?.forEach((j) => {
    if (j.client_id && !["delivered", "cancelled"].includes(j.status)) {
      jobCounts.set(j.client_id, (jobCounts.get(j.client_id) || 0) + 1);
    }
  });

  const balances = new Map<string, number>();
  invoices?.forEach((inv) => {
    if (inv.client_id) {
      balances.set(inv.client_id, (balances.get(inv.client_id) || 0) + Number(inv.balance_due));
    }
  });

  const enriched = (clients || []).map((c) => ({
    ...c,
    active_jobs: jobCounts.get(c.id) || 0,
    outstanding_balance: balances.get(c.id) || 0,
  }));

  return <ClientsClient clients={enriched} />;
}
