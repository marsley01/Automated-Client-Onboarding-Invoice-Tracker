import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { formatKES } from "@/lib/utils";
import TrackingTimeline from "@/components/client/TrackingTimeline";
import ClientInvoiceView from "@/components/client/ClientInvoiceView";
import Button from "@/components/ui/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientPortalPage({ params }: { params: { token: string } }) {
  const supabase = createAdminClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*, clients(*), businesses(*), job_status_history(*)")
    .eq("client_token", params.token)
    .single();

  if (!job) notFound();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("job_id", job.id)
    .order("created_at", { ascending: false });

  const invoice = invoices?.[0] || null;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-medium text-[var(--text-primary)]">{job.businesses?.name || "Dicosis"}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--text-primary)]">{job.title}</h1>
          <p className="text-sm text-[var(--text-muted)] font-mono mt-1">{job.job_number}</p>
        </div>

        {!job.client_submission_done && (
          <div className="card-surface-raised p-6 text-center">
            <p className="text-[var(--text-muted)] mb-4">
              Please submit your details so we can get started on your project.
            </p>
            <Link href={`/c/${params.token}/submit`}>
              <Button size="lg">Submit Your Details</Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-surface p-6">
            <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)] mb-4">Status</h2>
            <TrackingTimeline
              currentStatus={job.status}
              history={job.job_status_history || []}
            />
          </div>

          {invoice && (
            <div>
              <ClientInvoiceView
                invoice={invoice}
                items={invoice.invoice_items || []}
                businessName={job.businesses?.name || ""}
                businessLogo={job.businesses?.logo_url}
                paystackPublicKey={job.businesses?.paystack_public_key}
                clientEmail={job.clients?.email || ""}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
