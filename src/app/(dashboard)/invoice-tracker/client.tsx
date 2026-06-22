"use client";

import { useState } from "react";
import Topbar from "@/components/dashboard/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBar,
  ChartLine,
  TextT,
  GridFour,
  SquaresFour,
  ImageSquare,
  Plus,
  CaretDown,
  ArrowRight,
  FileText,
  Robot,
  CalendarDots,
  ArrowDownRight,
  ArrowUpRight,
} from "@phosphor-icons/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatKES, formatDate } from "@/lib/utils";

/* ─── Props type ─── */

interface KpiItem {
  label: string;
  value: string;
  change: string;
  sub: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
}

interface PieItem {
  name: string;
  value: number;
  color: string;
}

interface PendingRow {
  id: string;
  date: string;
  total: number;
  amount_paid: number;
  client: string;
  status: string;
}

interface MonthlyAmount {
  month: string;
  amount: number;
}

interface MonthlyStatus {
  month: string;
  sent: number;
  paid: number;
  overdue: number;
}

interface GalleryItem {
  id: string;
  date: string;
  client: string;
  amount: number;
}

interface InvoiceTrackerClientProps {
  kpi: KpiItem[];
  pieData: PieItem[];
  pendingRows: PendingRow[];
  monthlyPayments: MonthlyAmount[];
  paymentChangeText: string;
  monthlyInvoiceStatus: MonthlyStatus[];
  galleryInvoices: GalleryItem[];
}

/* ─────────── Visual helpers ─────────── */

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease, delay: i * 0.08 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}

function BezelCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="p-[1px] rounded-[20px] bg-zinc-100/80">
      <div className={`rounded-[19px] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] ${className}`}>
        {children}
      </div>
    </div>
  );
}

/* ─────────── Sub-Header ─────────── */

function SubHeader({ activeTab, onTabChange }: { activeTab: string; onTabChange: (t: string) => void }) {
  const tabs = [
    { id: "clients", label: "Clients" },
    { id: "invoices", label: "Invoices" },
  ];
  return (
    <div className="sticky top-14 z-40 border-b border-zinc-200/50 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative rounded-lg px-5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                activeTab === t.id
                  ? "bg-white text-[#2563EB] shadow-[0_1px_3px_rgba(37,99,235,0.08)]"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm text-zinc-500 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30">
            <FileText size={15} weight="light" />
            <span className="hidden sm:inline">Log</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm text-zinc-500 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30">
            <Robot size={15} weight="light" />
            <span className="hidden sm:inline">Automation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Tool Sidebar ─────────── */

const tools = [
  { id: "kpi", icon: ChartBar, label: "KPI" },
  { id: "chart", icon: ChartLine, label: "Chart" },
  { id: "text", icon: TextT, label: "Text" },
  { id: "grid", icon: GridFour, label: "Grid" },
];

function ToolSidebar({ activeTool, onToolChange }: { activeTool: string; onToolChange: (t: string) => void }) {
  return (
    <div className="hidden w-16 flex-col items-center gap-2 pt-2 lg:flex">
      <BezelCard>
        <div className="flex flex-col items-center gap-1 py-3 px-1.5">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onToolChange(t.id)}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                  isActive
                    ? "bg-blue-50 text-[#2563EB]"
                    : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                }`}
              >
                <Icon size={18} weight={isActive ? "regular" : "light"} />
                {t.label}
              </button>
            );
          })}
        </div>
      </BezelCard>
    </div>
  );
}

/* ─────────── KPI Cards ─────────── */

function KPISection({ data }: { data: KpiItem[] }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {data.map((kpi, i) => (
        <motion.div key={kpi.label} variants={fadeUp} custom={i}>
          <div className={`rounded-[20px] border ${kpi.cardBorder} ${kpi.cardBg} p-[1px]`}>
            <div className="rounded-[19px] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
              <div className="flex flex-col gap-2 p-5">
                <p className="text-xs font-medium tracking-wide text-zinc-500">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-zinc-900 [font-variant-numeric:tabular-nums]">{kpi.value}</span>
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.accent}`}>
                    {Number(kpi.change) >= 0 ? <ArrowUpRight size={11} weight="bold" /> : <ArrowDownRight size={11} weight="bold" />}
                    {Math.abs(Number(kpi.change)).toFixed(1)}%
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{kpi.sub}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────────── Pie Chart ─────────── */

function PieChartBlock({ data }: { data: PieItem[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <BezelCard>
      <div className="flex h-full flex-col gap-4 p-5">
        <h3 className="text-sm font-semibold text-zinc-800 text-balance">Invoice Stages</h3>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={34} outerRadius={60} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {data.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #e4e4e7", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2.5">
              {data.map((e) => (
                <div key={e.name} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: e.color }} />
                  <span className="text-xs text-zinc-600">{e.name}</span>
                  <span className="ml-auto min-w-[2ch] text-right text-xs font-semibold text-zinc-800 [font-variant-numeric:tabular-nums]">
                    {total > 0 ? e.value : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BezelCard>
  );
}

/* ─────────── Table ─────────── */

function PendingTable({ data }: { data: PendingRow[] }) {
  const statusStyle = (status: string) => {
    switch (status) {
      case "paid": return "bg-emerald-50 text-emerald-600";
      case "partially_paid": return "bg-blue-50 text-blue-600";
      case "sent": return "bg-amber-50 text-amber-600";
      case "overdue": return "bg-red-50 text-red-600";
      default: return "bg-zinc-50 text-zinc-600";
    }
  };
  const statusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Paid";
      case "partially_paid": return "Partial";
      case "overdue": return "Overdue";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  return (
    <BezelCard>
      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-sm font-semibold text-zinc-800 text-balance">Pending Invoices</h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400">
                <th className="pb-3 pr-3 font-medium [font-variant-numeric:tabular-nums]">#</th>
                <th className="pb-3 pr-3 font-medium [font-variant-numeric:tabular-nums]">Invoice</th>
                <th className="pb-3 pr-3 font-medium">Issue Date</th>
                <th className="pb-3 pr-3 text-right font-medium [font-variant-numeric:tabular-nums]">Total</th>
                <th className="pb-3 pr-3 text-right font-medium [font-variant-numeric:tabular-nums]">Paid</th>
                <th className="pb-3 pr-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">No pending invoices</td>
                </tr>
              ) : data.map((row, i) => (
                <tr key={row.id} className="border-b border-zinc-50 transition-colors duration-300 hover:bg-zinc-50/60">
                  <td className="py-3 pr-3 text-zinc-400 [font-variant-numeric:tabular-nums]">{i + 1}</td>
                  <td className="py-3 pr-3 font-medium text-zinc-800 [font-variant-numeric:tabular-nums]">{row.id}</td>
                  <td className="py-3 pr-3 text-zinc-500">{formatDate(row.date)}</td>
                  <td className="py-3 pr-3 text-right text-zinc-700 [font-variant-numeric:tabular-nums]">{formatKES(row.total)}</td>
                  <td className="py-3 pr-3 text-right text-zinc-700 [font-variant-numeric:tabular-nums]">{formatKES(row.amount_paid)}</td>
                  <td className="py-3 pr-3 text-zinc-600">{row.client}</td>
                  <td className="py-3">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${statusStyle(row.status)}`}>
                      {statusLabel(row.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BezelCard>
  );
}

/* ─────────── Trends ─────────── */

function LineChartBlock({ data, changeText }: { data: MonthlyAmount[]; changeText: string }) {
  return (
    <BezelCard>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-800 text-balance">Payments Received</h3>
          {changeText && (
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">{changeText}</span>
          )}
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e4e4e7", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", fontSize: 12 }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                formatter={(value: any) => [formatKES(Number(value)), "Amount"]}
              />
              <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2.5} fill="url(#blueFill)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: "#2563EB" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </BezelCard>
  );
}

function BarChartBlock({ data }: { data: MonthlyStatus[] }) {
  return (
    <BezelCard>
      <div className="flex flex-col gap-4 p-5">
        <h3 className="text-sm font-semibold text-zinc-800 text-balance">Invoice Status</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e4e4e7", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", fontSize: 12 }}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Bar dataKey="sent" fill="#3B82F6" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="paid" fill="#10B981" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="overdue" fill="#F59E0B" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-5 text-xs text-zinc-500">
          {[
            { label: "Sent", color: "bg-blue-500" },
            { label: "Paid", color: "bg-emerald-500" },
            { label: "Overdue", color: "bg-amber-500" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-sm ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </BezelCard>
  );
}

/* ─────────── Analytics View ─────────── */

function AnalyticsView({ kpi, pieData, pendingRows, monthlyPayments, paymentChangeText, monthlyInvoiceStatus }: {
  kpi: KpiItem[];
  pieData: PieItem[];
  pendingRows: PendingRow[];
  monthlyPayments: MonthlyAmount[];
  paymentChangeText: string;
  monthlyInvoiceStatus: MonthlyStatus[];
}) {
  const [activeTool, setActiveTool] = useState("kpi");
  return (
    <div className="flex gap-5">
      <ToolSidebar activeTool={activeTool} onToolChange={setActiveTool} />
      <motion.div
        key="analytics"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-1 flex-col gap-5"
      >
        <KPISection data={kpi} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <PieChartBlock data={pieData} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <PendingTable data={pendingRows} />
          </motion.div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <LineChartBlock data={monthlyPayments} changeText={paymentChangeText} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <BarChartBlock data={monthlyInvoiceStatus} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────── Gallery View ─────────── */

function GalleryView({ data }: { data: GalleryItem[] }) {
  const [galleryTab, setGalleryTab] = useState("gallery");

  const fadedSkeleton = (i: number) => (
    <div key={`skel-${i}`}>
      <BezelCard>
        <div className="flex flex-col">
          <div className="flex flex-col gap-1.5 border-b border-zinc-100 px-5 pb-4 pt-5">
            <div className="flex items-center justify-between">
              <div className="h-2 w-16 rounded bg-zinc-200" />
              <div className="h-2 w-10 rounded bg-blue-100" />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <div className="h-1.5 rounded bg-zinc-100" />
              <div className="h-1.5 rounded bg-zinc-100" />
              <div className="h-1.5 rounded bg-zinc-100" />
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <div className="h-1.5 rounded bg-zinc-50" />
              <div className="h-1.5 rounded bg-zinc-50" />
              <div className="h-1.5 rounded bg-zinc-100" />
              <div className="h-1.5 rounded bg-zinc-50" />
            </div>
            <div className="mt-1 h-8 w-3/4 rounded-md bg-blue-50/50" />
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-1.5 rounded bg-zinc-100" />
              <div className="h-1.5 rounded bg-zinc-100" />
            </div>
            <div className="mt-0.5 flex justify-end">
              <div className="h-3 w-16 rounded-md bg-blue-100/60" />
            </div>
          </div>
          <div className="flex flex-col gap-1 px-5 pb-5 pt-3.5">
            <div className="h-4 w-24 rounded bg-zinc-200" />
            <div className="h-3 w-32 rounded bg-zinc-100" />
            <div className="mt-0.5 h-3 w-20 rounded bg-zinc-100" />
          </div>
        </div>
      </BezelCard>
    </div>
  );

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col gap-6"
    >
      <BezelCard>
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
            {[
              { id: "views", label: "Views", icon: SquaresFour },
              { id: "gallery", label: "Invoice gallery", icon: ImageSquare },
            ].map((v) => {
              const Icon = v.icon;
              const isActive = galleryTab === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setGalleryTab(v.id)}
                  className={`flex items-center gap-1.5 rounded-[7px] px-3.5 py-1.5 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                    isActive
                      ? "bg-white text-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  <Icon size={13} weight={isActive ? "regular" : "light"} />
                  {v.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            {["Sort", "Filter", "Color"].map((action) => (
              <button
                key={action}
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              >
                {action}
                <CaretDown size={10} weight="bold" />
              </button>
            ))}
            <div className="hidden items-center sm:flex">
              {[
                { c: "#6366F1", n: "Indigo" },
                { c: "#3B82F6", n: "Blue" },
                { c: "#10B981", n: "Emerald" },
                { c: "#8B5CF6", n: "Purple" },
              ].map((a, i) => (
                <div
                  key={a.c}
                  className="-ml-1.5 h-7 w-7 rounded-lg border-2 border-white transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: a.c, zIndex: 4 - i }}
                  title={a.n}
                />
              ))}
            </div>
            <button className="group flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-xs font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#1D4ED8] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
              <Plus size={14} weight="bold" />
              <span>Add Record</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowRight size={10} weight="bold" />
              </span>
            </button>
          </div>
        </div>
      </BezelCard>

      {galleryTab === "gallery" ? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {data.length === 0 ? (
            Array.from({ length: 8 }, (_, i) => fadedSkeleton(i))
          ) : data.map((inv, i) => (
            <motion.div key={inv.id} variants={fadeUp} custom={i}>
              <BezelCard>
                <div className="flex flex-col">
                  <div className="flex flex-col gap-1.5 border-b border-zinc-100 px-5 pb-4 pt-5">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-16 rounded bg-zinc-200" />
                      <div className="h-2 w-10 rounded bg-blue-100" />
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      <div className="h-1.5 rounded bg-zinc-100" />
                      <div className="h-1.5 rounded bg-zinc-100" />
                      <div className="h-1.5 rounded bg-zinc-100" />
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="h-1.5 rounded bg-zinc-50" />
                      <div className="h-1.5 rounded bg-zinc-50" />
                      <div className="h-1.5 rounded bg-zinc-100" />
                      <div className="h-1.5 rounded bg-zinc-50" />
                    </div>
                    <div className="mt-1 h-8 w-3/4 rounded-md bg-blue-50/50" />
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-1.5 rounded bg-zinc-100" />
                      <div className="h-1.5 rounded bg-zinc-100" />
                    </div>
                    <div className="mt-0.5 flex justify-end">
                      <div className="h-3 w-16 rounded-md bg-blue-100/60" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-5 pb-5 pt-3.5">
                    <p className="text-sm font-bold tracking-tight text-zinc-800 [font-variant-numeric:tabular-nums]">{inv.id}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <CalendarDots size={11} weight="light" />
                      {formatDate(inv.date)}
                    </div>
                    <p className="mt-0.5 text-[11px] font-medium text-zinc-500">{inv.client}</p>
                    <p className="text-[11px] font-semibold text-zinc-700 [font-variant-numeric:tabular-nums]">{formatKES(inv.amount)}</p>
                  </div>
                </div>
              </BezelCard>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-32 text-center text-sm text-zinc-400">Select a view to preview</div>
      )}
    </motion.div>
  );
}

/* ─────────── Main Page ─────────── */

export default function InvoiceTrackerClient(props: InvoiceTrackerClientProps) {
  const [activeTab, setActiveTab] = useState("invoices");
  const [viewMode, setViewMode] = useState<"analytics" | "gallery">("analytics");

  return (
    <div className="min-h-[100dvh]">
      <Grain />
      <Topbar />
      <SubHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-[1440px] px-4 py-8 lg:px-10 lg:py-10">
        {activeTab === "clients" ? (
          <div className="flex items-center justify-center py-32 text-zinc-400">
            <p className="text-sm">Clients workspace</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => setViewMode("analytics")}
                className={`rounded-lg px-5 py-2 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  viewMode === "analytics"
                    ? "bg-[#2563EB] text-white shadow-[0_2px_8px_rgba(37,99,235,0.25)]"
                    : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-800"
                }`}
              >
                Analytical Report
              </button>
              <button
                onClick={() => setViewMode("gallery")}
                className={`rounded-lg px-5 py-2 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  viewMode === "gallery"
                    ? "bg-[#2563EB] text-white shadow-[0_2px_8px_rgba(37,99,235,0.25)]"
                    : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-800"
                }`}
              >
                Invoice Gallery
              </button>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "analytics" ? (
                <AnalyticsView
                  kpi={props.kpi}
                  pieData={props.pieData}
                  pendingRows={props.pendingRows}
                  monthlyPayments={props.monthlyPayments}
                  paymentChangeText={props.paymentChangeText}
                  monthlyInvoiceStatus={props.monthlyInvoiceStatus}
                />
              ) : (
                <GalleryView data={props.galleryInvoices} />
              )}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}
