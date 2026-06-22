"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { FileText, Lightning, CurrencyCircleDollar, WarningCircle } from "@phosphor-icons/react";
import Topbar from "@/components/dashboard/Topbar";
import StatsCard from "@/components/dashboard/StatsCard";
import JobStatusBadge from "@/components/jobs/JobStatusBadge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn, formatKES, formatDate, getPriorityColor } from "@/lib/utils";
import type { DailyRevenue, JobStatus, JobPriority } from "@/types";

const RevenueChart = dynamic(() => import("@/components/dashboard/RevenueChart"), { ssr: false });

interface RecentJob {
  id: string;
  job_number: string;
  title: string;
  client_name: string;
  status: JobStatus;
  priority: JobPriority;
  due_date: string | null;
}

interface DashboardClientProps {
  totalJobs: number;
  activeJobs: number;
  revenueThisMonth: number;
  outstandingBalance: number;
  recentJobs: RecentJob[];
  revenueData: DailyRevenue[];
}

export default function DashboardClient({
  totalJobs, activeJobs, revenueThisMonth, outstandingBalance, recentJobs, revenueData,
}: DashboardClientProps) {
  return (
    <div>
      <Topbar />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Jobs"
            value={totalJobs.toString()}
            icon={<FileText weight="duotone" className="text-lg" />}
          />
          <StatsCard
            title="Active Jobs"
            value={activeJobs.toString()}
            icon={<Lightning weight="duotone" className="text-lg" />}
          />
          <StatsCard
            title="Revenue This Month"
            value={formatKES(revenueThisMonth)}
            icon={<CurrencyCircleDollar weight="duotone" className="text-lg" />}
          />
          <StatsCard
            title="Outstanding Balance"
            value={formatKES(outstandingBalance)}
            icon={<WarningCircle weight="duotone" className="text-lg" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Jobs</h2>
              {recentJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[var(--text-muted)] mb-4">No jobs yet</p>
                  <Link href="/jobs/new"><Button size="sm">Create your first job</Button></Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2 font-medium">Job #</th>
                        <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2 font-medium">Title</th>
                        <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2 font-medium">Client</th>
                        <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2 font-medium">Status</th>
                        <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2 font-medium">Priority</th>
                        <th className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2 font-medium">Due</th>
                        <th className="text-right text-xs text-[var(--text-muted)] uppercase tracking-wider pb-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentJobs.map((job) => (
                        <tr key={job.id} className="border-b border-[var(--border)] hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-sm text-[var(--text-primary)] font-mono">{job.job_number}</td>
                          <td className="py-3 text-sm text-[var(--text-primary)]">{job.title}</td>
                          <td className="py-3 text-sm text-[var(--text-muted)]">{job.client_name}</td>
                          <td className="py-3 text-sm"><JobStatusBadge status={job.status} /></td>
                          <td className="py-3 text-sm">
                            <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full", getPriorityColor(job.priority))}>
                              {job.priority}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-[var(--text-muted)]">{formatDate(job.due_date)}</td>
                          <td className="py-3 text-sm text-right">
                            <Link href={`/jobs/${job.id}`} className="text-[var(--primary)] hover:underline text-xs">View</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Revenue (7 days)</h2>
              <RevenueChart data={revenueData} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
