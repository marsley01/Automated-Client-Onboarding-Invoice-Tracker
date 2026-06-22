"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import InvoiceBuilder from "@/components/invoices/InvoiceBuilder";
import RecordPaymentModal from "@/components/invoices/RecordPaymentModal";
import { useToast } from "@/components/ui/Toast";
import { generateInvoiceNumber } from "@/lib/utils";
import type { Job, Client, Invoice, InvoiceItem, Business } from "@/types";
import type { RecordPaymentData } from "@/lib/validations";

interface InvoicePageClientProps {
  job: Job & { clients?: Client | null; businesses?: Partial<Business> | null };
  invoice: (Invoice & { invoice_items?: InvoiceItem[] }) | null;
}

export default function InvoicePageClient({ job, invoice }: InvoicePageClientProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);

  const nextInvoiceNumber = invoice?.invoice_number || generateInvoiceNumber(
    job.businesses?.invoice_prefix || "INV",
    (job.businesses?.invoice_counter || 1000) + 1
  );

  const handleSave = async (data: { items: { description: string; quantity: number; unit_price: number }[]; due_date?: string; notes?: string; terms?: string }) => {
    setLoading(true);
    try {
      const method = invoice ? "PATCH" : "POST";
      const url = invoice ? `/api/invoices/${invoice.id}` : "/api/invoices";

      const body = {
        ...data,
        job_id: job.id,
        client_id: job.client_id,
        business_id: job.business_id,
        ...(invoice ? {} : { invoice_number: nextInvoiceNumber }),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save invoice");
      addToast(invoice ? "Invoice updated" : "Invoice created", "success");
      router.refresh();
    } catch (err: any) {
      addToast(err.message || "Failed to save", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!invoice && !confirm("Save draft first?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${invoice!.id}/send`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to send");
      addToast("Invoice sent to client", "success");
      router.refresh();
    } catch (err: any) {
      addToast(err.message || "Failed to send", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (data: RecordPaymentData) => {
    if (!invoice) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/record-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to record payment");
      addToast("Payment recorded", "success");
      setPayModalOpen(false);
      router.refresh();
    } catch (err: any) {
      addToast(err.message || "Failed to record payment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <Topbar />
      <main className="p-6">
        <div className="invoice-print-view">
          <InvoiceBuilder
            invoiceNumber={nextInvoiceNumber}
            defaultItems={invoice?.invoice_items}
            defaultDueDate={invoice?.due_date || undefined}
            defaultNotes={invoice?.notes || undefined}
            defaultTerms={invoice?.terms || undefined}
            onSave={handleSave}
            onSend={invoice && ["draft", "sent"].includes(invoice.status) ? handleSend : undefined}
            onRecordPayment={invoice && invoice.balance_due > 0 ? () => setPayModalOpen(true) : undefined}
            onPrint={handlePrint}
            loading={loading}
          />
        </div>
      </main>

      {invoice && (
        <RecordPaymentModal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          invoiceId={invoice.id}
          balanceDue={invoice.balance_due}
          onRecord={handleRecordPayment}
        />
      )}
    </div>
  );
}
