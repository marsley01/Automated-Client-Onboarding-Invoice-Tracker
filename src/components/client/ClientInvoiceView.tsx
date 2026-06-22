"use client";

import { formatKES, formatDate, getInvoiceStatusColor } from "@/lib/utils";
import type { Invoice, InvoiceItem } from "@/types";
import PaystackButton from "./PaystackButton";

interface ClientInvoiceViewProps {
  invoice: Invoice;
  items: InvoiceItem[];
  businessName: string;
  businessLogo?: string | null;
  paystackPublicKey?: string | null;
  clientEmail: string;
}

export default function ClientInvoiceView({
  invoice, items, businessName, businessLogo, paystackPublicKey, clientEmail,
}: ClientInvoiceViewProps) {
  const canPay = ["sent", "partially_paid", "overdue"].includes(invoice.status) && invoice.balance_due > 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-surface-raised p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            {businessLogo && <img src={businessLogo} alt={businessName} className="h-10 mb-2" />}
            <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">{businessName}</h2>
          </div>
          <div className="text-right">
            <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">{invoice.invoice_number}</h1>
            <span className={getInvoiceStatusColor(invoice.status)}>
              {invoice.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Invoice Date</p>
            <p className="text-sm text-[var(--text-primary)]">{formatDate(invoice.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Due Date</p>
            <p className="text-sm text-[var(--text-primary)]">{formatDate(invoice.due_date)}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2">Description</th>
              <th className="text-right text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2">Qty</th>
              <th className="text-right text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2">Price</th>
              <th className="text-right text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[var(--border)]">
                <td className="py-3 text-sm text-[var(--text-primary)]">{item.description}</td>
                <td className="py-3 text-sm text-[var(--text-primary)] text-right">{item.quantity}</td>
                <td className="py-3 text-sm text-[var(--text-primary)] text-right">{formatKES(item.unit_price)}</td>
                <td className="py-3 text-sm text-[var(--text-primary)] text-right font-medium">{formatKES(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 ml-auto w-64">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Subtotal</span>
            <span>{formatKES(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Tax ({invoice.tax_rate}%)</span>
            <span>{formatKES(invoice.tax_amount)}</span>
          </div>
          {invoice.discount_amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Discount</span>
              <span className="text-[var(--error)]">-{formatKES(invoice.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-[var(--border)] pt-2">
            <span>Total</span>
            <span>{formatKES(invoice.total)}</span>
          </div>
          {invoice.amount_paid > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--success)]">Paid</span>
              <span className="text-[var(--success)]">{formatKES(invoice.amount_paid)}</span>
            </div>
          )}
          {invoice.balance_due > 0 && (
            <div className="flex justify-between font-semibold">
              <span className="text-[var(--warning)]">Balance Due</span>
              <span className="text-[var(--warning)]">{formatKES(invoice.balance_due)}</span>
            </div>
          )}
        </div>

        {invoice.notes && (
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-[var(--text-subtle)]">{invoice.notes}</p>
          </div>
        )}

        {canPay && (
          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Outstanding balance: <strong className="text-[var(--text-primary)]">{formatKES(invoice.balance_due)}</strong>
            </p>
            <PaystackButton
              amount={invoice.balance_due}
              email={clientEmail}
              publicKey={paystackPublicKey}
              invoiceId={invoice.id}
              businessId={invoice.business_id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
