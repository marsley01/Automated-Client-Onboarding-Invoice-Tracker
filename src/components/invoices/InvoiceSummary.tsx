import { formatKES } from "@/lib/utils";
import Card from "@/components/ui/Card";

interface InvoiceSummaryProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  currency?: string;
}

export default function InvoiceSummary({
  subtotal, taxRate, taxAmount, discountAmount, total, amountPaid, balanceDue, currency = "KES",
}: InvoiceSummaryProps) {
  return (
    <Card className="p-5 space-y-3">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">Subtotal</span>
          <span className="text-[var(--text-primary)]">{formatKES(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Discount</span>
            <span className="text-[var(--error)]">-{formatKES(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">Tax ({taxRate}%)</span>
          <span className="text-[var(--text-primary)]">{formatKES(taxAmount)}</span>
        </div>
        <div className="border-t border-[var(--border)] pt-2 flex justify-between">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Total</span>
          <span className="text-lg font-bold text-[var(--text-primary)]">{formatKES(total)}</span>
        </div>
        {amountPaid > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Paid</span>
            <span className="text-[var(--success)]">{formatKES(amountPaid)}</span>
          </div>
        )}
        {balanceDue > 0 && (
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-[var(--warning)]">Balance Due</span>
            <span className="text-[var(--warning)]">{formatKES(balanceDue)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
