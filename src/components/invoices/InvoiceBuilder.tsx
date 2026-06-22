"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import LineItemRow from "./LineItemRow";
import InvoiceSummary from "./InvoiceSummary";
import { formatKES } from "@/lib/utils";
import type { InvoiceItem } from "@/types";

interface InvoiceBuilderProps {
  invoiceNumber: string;
  defaultItems?: InvoiceItem[];
  defaultDueDate?: string;
  defaultNotes?: string;
  defaultTerms?: string;
  onSave: (data: { items: { description: string; quantity: number; unit_price: number }[]; due_date?: string; notes?: string; terms?: string }) => Promise<void>;
  onSend?: () => Promise<void>;
  onRecordPayment?: () => void;
  onPrint?: () => void;
  loading?: boolean;
}

export default function InvoiceBuilder({
  invoiceNumber, defaultItems, defaultDueDate, defaultNotes, defaultTerms,
  onSave, onSend, onRecordPayment, onPrint, loading,
}: InvoiceBuilderProps) {
  const [items, setItems] = useState<{ id: string; description: string; quantity: number; unit_price: number; total: number }[]>(
    defaultItems?.map((i) => ({ ...i })) || [{ id: "1", description: "", quantity: 1, unit_price: 0, total: 0 }]
  );
  const [dueDate, setDueDate] = useState(defaultDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);
  const [notes, setNotes] = useState(defaultNotes || "");
  const [terms, setTerms] = useState(defaultTerms || "Payment is due within 7 days of invoice date.");

  const handleItemChange = useCallback((index: number, field: string, value: string | number) => {
    setItems((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      const updated = { ...item, [field]: value };
      updated.total = updated.quantity * updated.unit_price;
      return updated;
    }));
  }, []);

  const addItem = useCallback(() => {
    const newId = (Math.max(...items.map((i) => parseInt(i.id)), 0) + 1).toString();
    setItems((prev) => [...prev, { id: newId, description: "", quantity: 1, unit_price: 0, total: 0 }]);
  }, [items]);

  const removeItem = useCallback((index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, [items]);

  const { subtotal, taxAmount, total } = useMemo(() => {
    const sub = items.reduce((sum, item) => sum + item.total, 0);
    const tax = sub * 0.16;
    return { subtotal: sub, taxAmount: tax, total: sub + tax };
  }, [items]);

  const handleSave = () => {
    onSave({
      items: items.map(({ description, quantity, unit_price }) => ({ description, quantity, unit_price })),
      due_date: dueDate,
      notes: notes || undefined,
      terms: terms || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">{invoiceNumber}</h2>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <label className="text-xs text-[var(--text-muted)]">Invoice Date</label>
              <p className="text-sm text-[var(--text-primary)]">{new Date().toLocaleDateString("en-KE")}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent text-sm text-[var(--text-primary)] border-b border-[var(--border)] focus:border-[var(--primary)] outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {onPrint && <Button variant="secondary" size="sm" onClick={onPrint}>Print</Button>}
          {onSend && <Button size="sm" onClick={onSend} loading={loading}>Send to Client</Button>}
          <Button variant="secondary" size="sm" onClick={handleSave} loading={loading}>Save Draft</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card-surface p-5">
            <div className="grid grid-cols-12 gap-3 mb-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-3">Unit Price</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1" />
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  index={i}
                  onChange={handleItemChange}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={addItem} className="mt-3">
              + Add Line Item
            </Button>
          </div>

          <div className="card-surface p-5 space-y-4">
            <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
            <Textarea label="Terms" value={terms} onChange={(e) => setTerms(e.target.value)} />
          </div>
        </div>

        <div className="space-y-4">
          <InvoiceSummary
            subtotal={subtotal}
            taxRate={16}
            taxAmount={taxAmount}
            discountAmount={0}
            total={total}
            amountPaid={0}
            balanceDue={total}
          />
          {onRecordPayment && (
            <Button variant="secondary" className="w-full" onClick={onRecordPayment}>
              Record Payment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
