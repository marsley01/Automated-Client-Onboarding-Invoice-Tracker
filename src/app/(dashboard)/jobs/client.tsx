"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import JobStatusBadge from "@/components/jobs/JobStatusBadge";
import { cn, formatDate, getPriorityColor, getCategoryLabel } from "@/lib/utils";
import type { Job, JobStatus, JobCategory, JobPriority } from "@/types";

interface JobsClientProps {
  jobs: (Job & { clients?: { name: string } | null })[];
}

export default function JobsClient({ jobs }: JobsClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<JobCategory | "all">("all");

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.job_number.toLowerCase().includes(search.toLowerCase()) || job.clients?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [jobs, search, statusFilter, categoryFilter]);

  return (
    <div>
      <Topbar />
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Jobs</h1>
          <Link href="/jobs/new"><Button>New Job</Button></Link>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by job #, title, or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "received", label: "Received" },
                { value: "diagnosed", label: "Diagnosed" },
                { value: "in_progress", label: "In Progress" },
                { value: "quality_check", label: "Quality Check" },
                { value: "ready", label: "Ready" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              className="w-40"
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              options={[
                { value: "all", label: "All Categories" },
                { value: "general", label: "General" },
                { value: "consulting", label: "Consulting" },
                { value: "design", label: "Design" },
                { value: "development", label: "Development" },
                { value: "marketing", label: "Marketing" },
                { value: "writing", label: "Writing" },
                { value: "financial", label: "Financial" },
                { value: "legal", label: "Legal" },
                { value: "repair", label: "Repair" },
                { value: "maintenance", label: "Maintenance" },
                { value: "cleaning", label: "Cleaning" },
                { value: "photography", label: "Photography" },
                { value: "education", label: "Education" },
                { value: "health", label: "Health" },
                { value: "logistics", label: "Logistics" },
                { value: "event", label: "Event" },
                { value: "other", label: "Other" },
              ]}
              className="w-40"
            />
          </div>
        </Card>

        {filtered.length === 0 ? (
          <Card className="p-6">
            <EmptyState
              title="No jobs found"
              description={jobs.length === 0 ? "Create your first job to get started." : "Try adjusting your filters."}
              action={jobs.length === 0 ? { label: "Create Job", onClick: () => window.location.href = "/jobs/new" } : undefined}
            />
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider p-4 font-medium">Job #</th>
                    <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider p-4 font-medium">Title</th>
                    <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider p-4 font-medium">Client</th>
                    <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider p-4 font-medium">Category</th>
                    <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider p-4 font-medium">Status</th>
                    <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider p-4 font-medium">Priority</th>
                    <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider p-4 font-medium">Due</th>
                    <th className="text-right text-xs text-[var(--text-muted)] uppercase tracking-wider p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((job) => (
                    <tr key={job.id} className="border-b border-[var(--border)] hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 text-sm text-[var(--text-primary)] font-mono">{job.job_number}</td>
                      <td className="p-4 text-sm text-[var(--text-primary)] font-medium">{job.title}</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{job.clients?.name || "—"}</td>
                      <td className="p-4 text-sm text-[var(--text-subtle)]">{getCategoryLabel(job.category)}</td>
                      <td className="p-4"><JobStatusBadge status={job.status} /></td>
                      <td className="p-4">
                        <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md", getPriorityColor(job.priority))}>
                          {job.priority}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{formatDate(job.due_date)}</td>
                      <td className="p-4 text-right">
                        <Link href={`/jobs/${job.id}`} className="text-[var(--primary)] hover:underline text-xs font-medium">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
