"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Textarea from "@/components/ui/Textarea";
import JobStatusBadge from "@/components/jobs/JobStatusBadge";
import StatusStepper from "@/components/jobs/StatusStepper";
import StatusUpdateModal from "@/components/jobs/StatusUpdateModal";
import AttachmentGrid from "@/components/jobs/AttachmentGrid";
import ActivityLog from "@/components/jobs/ActivityLog";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatKES, getCategoryLabel, getInitials, getPriorityColor, getInvoiceStatusColor } from "@/lib/utils";
import type { Job, JobStatus, JobStatusHistory, JobAttachment, Invoice, InvoiceItem } from "@/types";

interface JobDetailClientProps {
  job: Job & { clients?: { id: string; name: string; email: string; phone: string | null; company: string | null } | null };
  history: JobStatusHistory[];
  attachments: JobAttachment[];
  invoices: (Invoice & { invoice_items?: InvoiceItem[] })[];
}

export default function JobDetailClient({ job, history, attachments, invoices }: JobDetailClientProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState(job.internal_notes || "");
  const [uploading, setUploading] = useState(false);
  const currentInvoice = invoices[0];

  const handleStatusUpdate = async (status: JobStatus, notes?: string) => {
    const res = await fetch(`/api/jobs/${job.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    addToast("Status updated", "success");
    router.refresh();
  };

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/jobs/${job.id}/attachments`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      addToast("File uploaded", "success");
      router.refresh();
    } else {
      addToast("Upload failed", "error");
    }
    setUploading(false);
  };

  const copyPortalLink = () => {
    const link = `${window.location.origin}/c/${job.client_token}`;
    navigator.clipboard.writeText(link);
    addToast("Portal link copied!", "success");
  };

  return (
    <div>
      <Topbar />
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <JobStatusBadge status={job.status} className="mb-2" />
                  <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">{job.title}</h1>
                  <p className="text-sm text-[var(--text-muted)] font-mono">{job.job_number}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryLabel(job.category) !== "General" && (
                    <Badge variant="info">{getCategoryLabel(job.category)}</Badge>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md ${getPriorityColor(job.priority)}`}>
                    {job.priority}
                  </span>
                </div>
              </div>

              {job.description && (
                <p className="text-sm text-[var(--text-subtle)] mb-4">{job.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                {job.due_date && (
                  <span>Due: <span className="text-[var(--text-primary)]">{formatDate(job.due_date)}</span></span>
                )}
                <span>Created: {formatDate(job.created_at)}</span>
              </div>

              <StatusStepper currentStatus={job.status} onUpdateClick={() => setStatusModalOpen(true)} />
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Client Portal</h2>
              {job.client_submission_done ? (
                <div className="flex items-center gap-2 text-sm text-[var(--success)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Client submitted their details
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[var(--text-muted)] mb-2">Share this link with your client:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-[var(--bg)] px-3 py-2 rounded-[8px] text-[var(--text-primary)] font-mono truncate">
                      {`${typeof window !== "undefined" ? window.location.origin : ""}/c/${job.client_token}`}
                    </code>
                    <Button size="sm" variant="secondary" onClick={copyPortalLink}>Copy</Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Attachments</h2>
                <label className="cursor-pointer">
                  <Button size="sm" variant="secondary" as-child>
                    <span>Upload</span>
                  </Button>
                  <input type="file" className="hidden" onChange={handleAttachmentUpload} />
                </label>
              </div>
              <AttachmentGrid attachments={attachments} uploading={uploading} />
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Activity Log</h2>
              <ActivityLog history={history} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Client</h2>
              {job.clients ? (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] font-bold text-sm flex-shrink-0">
                    {getInitials(job.clients.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{job.clients.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{job.clients.email}</p>
                    {job.clients.phone && <p className="text-xs text-[var(--text-muted)]">{job.clients.phone}</p>}
                    {job.clients.company && <p className="text-xs text-[var(--text-muted)]">{job.clients.company}</p>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">No client assigned</p>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Invoice</h2>
              {currentInvoice ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--text-muted)]">{currentInvoice.invoice_number}</span>
                    <span className={getInvoiceStatusColor(currentInvoice.status)}>
                      {currentInvoice.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">{formatKES(currentInvoice.total)}</p>
                  {currentInvoice.balance_due > 0 && (
                    <p className="text-sm text-[var(--warning)]">Balance: {formatKES(currentInvoice.balance_due)}</p>
                  )}
                  <Link href={`/jobs/${job.id}/invoice`}>
                    <Button variant="secondary" size="sm" className="w-full mt-3">View Invoice</Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[var(--text-muted)] mb-3">No invoice yet</p>
                  <Link href={`/jobs/${job.id}/invoice`}>
                    <Button size="sm" className="w-full">Generate Invoice</Button>
                  </Link>
                </div>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Internal Notes</h2>
              <Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
                placeholder="Add internal notes..."
              />
              <Button
                size="sm"
                variant="ghost"
                className="mt-2"
                onClick={async () => {
                  await fetch(`/api/jobs/${job.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ internal_notes: internalNotes }),
                  });
                  addToast("Notes saved", "success");
                }}
              >
                Save notes
              </Button>
            </Card>
          </div>
        </div>

        <StatusUpdateModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          currentStatus={job.status}
          onConfirm={handleStatusUpdate}
        />
      </main>
    </div>
  );
}
