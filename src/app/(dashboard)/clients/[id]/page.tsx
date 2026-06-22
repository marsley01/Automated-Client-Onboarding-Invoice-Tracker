import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate, formatKES, getInitials, getCategoryLabel } from "@/lib/utils";
import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import type { Job, Invoice, JobStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: client } = await supabase.from("clients").select("*").eq("id", params.id).single();
  if (!client) redirect("/clients");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, invoices(*)")
    .eq("client_id", params.id)
    .order("created_at", { ascending: false });

  const totalInvoiced = (jobs || []).reduce((sum, j: any) => {
    return sum + (j.invoices || []).reduce((s: number, inv: any) => s + (inv.total || 0), 0);
  }, 0);
  const totalPaid = (jobs || []).reduce((sum, j: any) => {
    return sum + (j.invoices || []).reduce((s: number, inv: any) => s + (inv.amount_paid || 0), 0);
  }, 0);

  return (
    <div>
      <Topbar />
      <main className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] font-bold text-xl flex-shrink-0">
            {getInitials(client.name)}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">{client.name}</h1>
            <p className="text-sm text-[var(--text-muted)]">{client.email}</p>
            {client.phone && <p className="text-sm text-[var(--text-muted)]">{client.phone}</p>}
            {client.company && <p className="text-sm text-[var(--text-muted)]">{client.company}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-[var(--text-muted)]">Total Jobs</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{(jobs || []).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-[var(--text-muted)]">Total Invoiced</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{formatKES(totalInvoiced)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-[var(--text-muted)]">Total Paid</p>
            <p className="text-2xl font-bold text-[var(--success)]">{formatKES(totalPaid)}</p>
          </Card>
        </div>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Job History</h2>
          {(jobs || []).length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No jobs for this client yet</p>
          ) : (
            <div className="space-y-3">
              {(jobs || []).map((job: any) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="flex items-center justify-between p-3 card-surface-raised rounded-[8px] hover:border-[var(--border-active)] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{job.title}</p>
                      <p className="text-xs text-[var(--text-muted)] font-mono">{job.job_number}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={job.status === "delivered" ? "success" : job.status === "cancelled" ? "error" : "info"}>
                        {job.status.replace("_", " ")}
                      </Badge>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{formatDate(job.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
