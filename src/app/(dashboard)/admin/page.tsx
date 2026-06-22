import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AdminClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: businessUser } = await supabase
    .from("business_users")
    .select("business_id, role")
    .eq("user_id", user.id)
    .single();

  if (!businessUser || businessUser.role !== "owner") redirect("/dashboard");

  const admin = createAdminClient();

  const { data: businesses } = await admin
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: userCounts } = await admin
    .from("business_users")
    .select("business_id");

  const userCountMap = new Map<string, number>();
  userCounts?.forEach((bu) => {
    userCountMap.set(bu.business_id, (userCountMap.get(bu.business_id) || 0) + 1);
  });

  const { count: totalUsers } = await admin
    .from("business_users")
    .select("*", { count: "exact", head: true });

  const { count: totalInvoices } = await admin
    .from("invoices")
    .select("*", { count: "exact", head: true });

  const { data: allPayments } = await admin
    .from("payments")
    .select("amount")
    .eq("status", "successful");

  const totalRevenue = allPayments?.reduce((s, p) => s + Number(p.amount), 0) || 0;

  const enriched = (businesses || []).map((b) => ({
    ...b,
    user_count: userCountMap.get(b.id) || 0,
  }));

  return (
    <AdminClient
      businesses={enriched}
      totalBusinesses={businesses?.length || 0}
      totalUsers={totalUsers || 0}
      totalInvoices={totalInvoices || 0}
      totalRevenue={totalRevenue}
    />
  );
}
