"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatKES, formatDate } from "@/lib/utils";
import { Trash, Plus, X } from "@phosphor-icons/react";

interface AdminBusiness {
  id: string;
  name: string;
  email: string;
  city: string;
  created_at: string;
  user_count: number;
}

interface AdminClientProps {
  businesses: AdminBusiness[];
  totalBusinesses: number;
  totalUsers: number;
  totalInvoices: number;
  totalRevenue: number;
}

export default function AdminClient({
  businesses, totalBusinesses, totalUsers, totalInvoices, totalRevenue,
}: AdminClientProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newBiz, setNewBiz] = useState({ name: "", email: "", password: "", city: "Nairobi" });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = async () => {
    setAdding(true);
    try {
      const res = await fetch("/api/admin/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBiz),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      addToast("Business created", "success");
      setShowAdd(false);
      setNewBiz({ name: "", email: "", password: "", city: "Nairobi" });
      router.refresh();
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/admin/businesses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: id }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      addToast("Business removed", "success");
      setConfirmDelete(null);
      router.refresh();
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  return (
    <div>
      <Topbar />
      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Admin</h1>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus weight="bold" className="text-sm" />
            Add Business
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Businesses", value: totalBusinesses.toString() },
            { label: "Total Users", value: totalUsers.toString() },
            { label: "Total Invoices", value: totalInvoices.toString() },
            { label: "Total Revenue", value: formatKES(totalRevenue) },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm">
              <p className="text-xs text-[var(--text-muted)] font-medium">{s.label}</p>
              <p className="text-xl font-semibold text-[var(--text-primary)] mt-1 [font-variant-numeric:tabular-nums]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-white rounded-xl border border-zinc-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">New Business</h2>
              <button onClick={() => setShowAdd(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Business name" value={newBiz.name} onChange={(e) => setNewBiz({ ...newBiz, name: e.target.value })} />
              <Input label="Email" type="email" value={newBiz.email} onChange={(e) => setNewBiz({ ...newBiz, email: e.target.value })} />
              <Input label="Password" type="password" value={newBiz.password} onChange={(e) => setNewBiz({ ...newBiz, password: e.target.value })} placeholder="Min. 8 chars" />
              <Input label="City" value={newBiz.city} onChange={(e) => setNewBiz({ ...newBiz, city: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} loading={adding}>Create</Button>
            </div>
          </div>
        )}

        {/* Businesses table */}
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400">
                  <th className="pb-3 pt-4 px-5 font-medium">Business</th>
                  <th className="pb-3 pt-4 px-5 font-medium">Email</th>
                  <th className="pb-3 pt-4 px-5 font-medium">City</th>
                  <th className="pb-3 pt-4 px-5 font-medium">Users</th>
                  <th className="pb-3 pt-4 px-5 font-medium">Created</th>
                  <th className="pb-3 pt-4 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((b) => (
                  <tr key={b.id} className="border-b border-zinc-50 hover:bg-zinc-50/40 transition-colors">
                    <td className="py-3 px-5 font-medium text-zinc-800">{b.name}</td>
                    <td className="py-3 px-5 text-zinc-500">{b.email}</td>
                    <td className="py-3 px-5 text-zinc-500">{b.city}</td>
                    <td className="py-3 px-5 text-zinc-500">{b.user_count}</td>
                    <td className="py-3 px-5 text-zinc-500">{formatDate(b.created_at)}</td>
                    <td className="py-3 px-5 text-right">
                      {confirmDelete === b.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs text-zinc-400 hover:text-zinc-600 px-2 py-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1"
                          >
                            Confirm delete
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(b.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {businesses.length === 0 && (
            <p className="text-center text-sm text-zinc-400 py-8">No businesses yet</p>
          )}
        </div>
      </main>
    </div>
  );
}
