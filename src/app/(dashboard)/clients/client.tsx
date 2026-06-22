"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Topbar from "@/components/dashboard/Topbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { getInitials, formatDate, formatKES, getAvatarColor } from "@/lib/utils";
import { Plus, Funnel, CaretDown, DotsThreeVertical, PencilSimple, CurrencyCircleDollar, Briefcase, X } from "@phosphor-icons/react";
import type { Client } from "@/types";

interface EnrichedClient extends Client {
  active_jobs: number;
  outstanding_balance: number;
}

interface ClientsClientProps {
  clients: EnrichedClient[];
}

type FilterOption = "all" | "active" | "balance";
type SortOption = "recent" | "alpha";

export default function ClientsClient({ clients }: ClientsClientProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerForm, setDrawerForm] = useState({ name: "", contact: "", email: "", phone: "" });
  const [drawerLoading, setDrawerLoading] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSort(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    let result = [...clients];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q)
      );
    }

    if (filter === "active") result = result.filter((c) => c.active_jobs > 0);
    if (filter === "balance") result = result.filter((c) => c.outstanding_balance > 0);

    if (sort === "alpha") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [clients, search, filter, sort]);

  const handleAddClient = async () => {
    if (!drawerForm.name || !drawerForm.email) {
      addToast("Name and email are required", "error");
      return;
    }
    setDrawerLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drawerForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create client");
      addToast("Client added", "success");
      setShowDrawer(false);
      setDrawerForm({ name: "", contact: "", email: "", phone: "" });
      router.refresh();
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setDrawerLoading(false);
    }
  };

  const filterLabel = filter === "all" ? "All Clients" : filter === "active" ? "Active Projects" : "Outstanding Balance";
  const sortLabel = sort === "recent" ? "Recently Added" : "Alphabetical (A–Z)";

  return (
    <div>
      <Topbar />
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Clients</h1>
        </div>

        {/* Search + Filter + Sort + Add */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
          </div>

          {/* Filter */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => { setShowFilter(!showFilter); setShowSort(false); }}
              className="flex items-center gap-2 border border-zinc-200 text-sm text-zinc-600 px-3 py-2 rounded-lg bg-white hover:border-zinc-300 transition-colors"
            >
              <Funnel size={14} />
              {filterLabel}
              <CaretDown size={12} weight="bold" />
            </button>
            {showFilter && (
              <div className="absolute top-full mt-1 right-0 bg-white shadow-lg border border-zinc-100 rounded-lg py-1 text-sm w-48 text-zinc-700 z-20">
                {[
                  { value: "all", label: "All Clients" },
                  { value: "active", label: "Active Projects" },
                  { value: "balance", label: "Outstanding Balance" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setFilter(opt.value as FilterOption); setShowFilter(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-zinc-50 transition-colors ${filter === opt.value ? "text-[var(--primary)] font-medium" : ""}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => { setShowSort(!showSort); setShowFilter(false); }}
              className="flex items-center gap-2 border border-zinc-200 text-sm text-zinc-600 px-3 py-2 rounded-lg bg-white hover:border-zinc-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h6M3 12h10M3 17h14" /></svg>
              {sortLabel}
              <CaretDown size={12} weight="bold" />
            </button>
            {showSort && (
              <div className="absolute top-full mt-1 right-0 bg-white shadow-lg border border-zinc-100 rounded-lg py-1 text-sm w-48 text-zinc-700 z-20">
                {[
                  { value: "recent", label: "Recently Added" },
                  { value: "alpha", label: "Alphabetical (A–Z)" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value as SortOption); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-zinc-50 transition-colors ${sort === opt.value ? "text-[var(--primary)] font-medium" : ""}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button onClick={() => setShowDrawer(true)}>
            <Plus weight="bold" className="text-sm" />
            Add Client
          </Button>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No clients found"
            description={clients.length === 0 ? "Add your first client to get started." : "Try adjusting your filters."}
            action={clients.length === 0 ? { label: "Add Client", onClick: () => setShowDrawer(true) } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <div key={client.id} className="bg-white rounded-xl border border-zinc-100 p-5 shadow-sm hover:border-zinc-200 transition-colors relative group">
                {/* Context menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => { e.preventDefault(); setMenuOpen(menuOpen === client.id ? null : client.id); }}
                    className="text-zinc-400 hover:text-zinc-600 cursor-pointer p-0.5"
                  >
                    <DotsThreeVertical size={18} weight="bold" />
                  </button>
                  {menuOpen === client.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 top-6 bg-white shadow-lg border border-zinc-100 rounded-lg py-1 text-xs w-36 text-zinc-700 z-20">
                        <Link href={`/clients/${client.id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-50" onClick={() => setMenuOpen(null)}>
                          <PencilSimple size={13} /> Edit Details
                        </Link>
                        <Link href={`/jobs/new?client_id=${client.id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-50" onClick={() => setMenuOpen(null)}>
                          <Briefcase size={13} /> Log New Job
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                <Link href={`/clients/${client.id}`} className="block">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(client.name)}`}>
                      {getInitials(client.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{client.name}</p>
                      {client.company && <p className="text-xs text-[var(--text-muted)] truncate">{client.company}</p>}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[var(--text-muted)] mb-3">
                    <p className="truncate">{client.email}</p>
                    {client.phone && <p>{client.phone}</p>}
                  </div>

                  <div className="flex items-center flex-wrap gap-1.5 pt-3 border-t border-zinc-50">
                    {client.active_jobs > 0 && (
                      <span className="text-[11px] font-mono uppercase bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                        {client.active_jobs} Active {client.active_jobs === 1 ? "Job" : "Jobs"}
                      </span>
                    )}
                    {client.outstanding_balance > 0 && (
                      <span className="text-[11px] font-mono uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                        Owes {formatKES(client.outstanding_balance)}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Add Client Drawer */}
        {showDrawer && (
          <>
            <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowDrawer(false)} />
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Add Client</h2>
                <button onClick={() => setShowDrawer(false)} className="text-zinc-400 hover:text-zinc-600 p-1">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Client / Business Name</label>
                  <input
                    value={drawerForm.name}
                    onChange={(e) => setDrawerForm({ ...drawerForm, name: e.target.value })}
                    className="w-full border border-zinc-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm bg-zinc-50/50 outline-none transition-all"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Primary Contact Person</label>
                  <input
                    value={drawerForm.contact}
                    onChange={(e) => setDrawerForm({ ...drawerForm, contact: e.target.value })}
                    className="w-full border border-zinc-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm bg-zinc-50/50 outline-none transition-all"
                    placeholder="e.g. John Kamau"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email Address</label>
                  <input
                    value={drawerForm.email}
                    onChange={(e) => setDrawerForm({ ...drawerForm, email: e.target.value })}
                    className="w-full border border-zinc-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm bg-zinc-50/50 outline-none transition-all"
                    placeholder="e.g. john@acme.co.ke"
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Phone Number</label>
                  <input
                    value={drawerForm.phone}
                    onChange={(e) => setDrawerForm({ ...drawerForm, phone: e.target.value })}
                    className="w-full border border-zinc-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm bg-zinc-50/50 outline-none transition-all"
                    placeholder="e.g. +254 712 345 678"
                    type="tel"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-zinc-100">
                <Button className="w-full" loading={drawerLoading} onClick={handleAddClient}>
                  Add Client
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
