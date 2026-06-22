"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ClientInvoiceView from "@/components/client/ClientInvoiceView";
import Spinner from "@/components/ui/Spinner";
import type { Invoice, InvoiceItem } from "@/types";

export default function ClientPayPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<{
    invoice: Invoice;
    items: InvoiceItem[];
    businessName: string;
    businessLogo?: string;
    clientEmail: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/client/${token}`)
      .then((r) => r.json())
      .then((d) => {
        const invoice = d.invoices?.[0];
        if (invoice) {
          setData({
            invoice,
            items: invoice.invoice_items || [],
            businessName: d.businesses?.name || "",
            businessLogo: d.businesses?.logo_url,
            clientEmail: d.clients?.email || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">No invoice found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-medium text-[var(--text-primary)]">{data.businessName}</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <ClientInvoiceView
          invoice={data.invoice}
          items={data.items}
          businessName={data.businessName}
          businessLogo={data.businessLogo}
          clientEmail={data.clientEmail}
        />
      </main>
    </div>
  );
}
