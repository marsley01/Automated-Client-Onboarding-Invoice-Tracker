"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import type { Business } from "@/types";

export default function SettingsClient({ business }: { business: Business }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: business.name,
    email: business.email,
    phone: business.phone || "",
    address: business.address || "",
    city: business.city,
    tax_label: business.tax_label,
    tax_rate: business.tax_rate.toString(),
    invoice_prefix: business.invoice_prefix,

  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/business/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tax_rate: parseFloat(form.tax_rate),
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      addToast("Settings saved", "success");
      router.refresh();
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Topbar />
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Settings</h1>

        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Business Profile</h2>
          <Input label="Business Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Textarea label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Invoicing</h2>
          <Input label="Invoice Prefix" value={form.invoice_prefix} onChange={(e) => setForm({ ...form, invoice_prefix: e.target.value })} />
          <Input label="Tax Label (e.g. VAT)" value={form.tax_label} onChange={(e) => setForm({ ...form, tax_label: e.target.value })} />
          <Input label="Tax Rate (%)" type="number" step="0.01" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} />
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>Save Settings</Button>
        </div>
      </main>
    </div>
  );
}
