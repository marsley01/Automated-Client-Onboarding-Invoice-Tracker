import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatKES, formatDate, cn, getStatusColor, getPriorityColor, getCategoryLabel } from "@/lib/utils";
import DashboardClient from "./client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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

  const [jobsResult, paymentsResult, invoicesResult] = await Promise.all([
    supabase.from("jobs").select("id, status, title, job_number, priority, due_date, created_at, client_id, clients(name)").eq("business_id", businessId).order("created_at", { ascending: false }).limit(10),
    supabase.from("payments").select("amount, paid_at").gte("paid_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from("invoices").select("balance_due, status").eq("business_id", businessId).in("status", ["sent", "partially_paid", "overdue"]),
  ]);

  const totalJobs = jobsResult.data?.length || 0;
  const activeJobs = jobsResult.data?.filter((j) => !["delivered", "cancelled"].includes(j.status)).length || 0;
  const revenueThisMonth = paymentsResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const outstandingBalance = invoicesResult.data?.reduce((sum, i) => sum + (i.balance_due || 0), 0) || 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const revenueByDay = last7Days.map((date) => ({
    date,
    total: paymentsResult.data?.filter((p) => p.paid_at?.startsWith(date)).reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
  }));

  return (
    <DashboardClient
      totalJobs={totalJobs}
      activeJobs={activeJobs}
      revenueThisMonth={revenueThisMonth}
      outstandingBalance={outstandingBalance}
      recentJobs={(jobsResult.data || []).map((j: any) => ({
        id: j.id,
        job_number: j.job_number,
        title: j.title,
        client_name: j.clients?.name || "—",
        status: j.status,
        priority: j.priority,
        due_date: j.due_date,
      }))}
      revenueData={revenueByDay}
    />
  );
}
