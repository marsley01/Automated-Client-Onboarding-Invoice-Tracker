"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { getInitials, formatDate } from "@/lib/utils";
import type { Client } from "@/types";

export default function ClientsClient({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return clients;
    const q = search.toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q));
  }, [clients, search]);

  return (
    <div>
      <Topbar />
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Clients</h1>
        </div>

        <Card className="p-4">
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          />
        </Card>

        {filtered.length === 0 ? (
          <EmptyState
            title="No clients found"
            description={clients.length === 0 ? "Clients will appear here once you create jobs." : "Try a different search."}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <Card className="p-5 hover:border-[var(--border-active)] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                      {getInitials(client.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{client.name}</p>
                      {client.company && <p className="text-xs text-[var(--text-muted)]">{client.company}</p>}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-[var(--text-muted)]">
                    <p>{client.email}</p>
                    {client.phone && <p>{client.phone}</p>}
                    <p>Added {formatDate(client.created_at)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
