"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Link as LinkIcon, FileText, Clock, Bell, Cube } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";

const features = [
  {
    title: "Client Onboarding Link",
    desc: "Share a branded link. Clients submit their details and describe what they need — no back-and-forth.",
    icon: LinkIcon,
    color: "from-indigo-500/20 to-indigo-600/10",
    accent: "text-indigo-400",
  },
  {
    title: "Auto-generated Invoices",
    desc: "Build invoices in seconds. Automatic KES tax calculations, line items, and professional PDF output.",
    icon: FileText,
    color: "from-emerald-500/20 to-emerald-600/10",
    accent: "text-emerald-400",
  },
  {
    title: "Live Status Tracker",
    desc: "Clients see real-time progress from received to delivered. No more 'is it ready yet?' messages.",
    icon: Clock,
    color: "from-amber-500/20 to-amber-600/10",
    accent: "text-amber-400",
  },
  {
    title: "Automated Reminders",
    desc: "Overdue invoices trigger polite email reminders. Set it and forget it.",
    icon: Bell,
    color: "from-rose-500/20 to-rose-600/10",
    accent: "text-rose-400",
  },
];

const logos = [
  "Safaricom", "KCB Group", "Equity Bank", "Telkom Kenya",
  "Airtel Kenya", "NCBA Bank", "Co-op Bank", "Stanbic Bank",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function LandingPage() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[var(--primary)] flex items-center justify-center">
              <Cube weight="bold" className="text-white text-sm" />
            </div>
            <span className="font-display text-lg font-semibold text-[var(--text-primary)]">Dicosis</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/signin" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary-muted)] text-[var(--primary)] border border-[var(--border-active)] mb-6">
            Free during beta
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tighter text-[var(--text-primary)]">
            Get paid faster.
            <br />
            <span className="text-gradient">Track</span> every job.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-subtle)] leading-relaxed max-w-[65ch]">
            Dicosis gives your agency or repair shop a professional client portal,
            automated invoices, and real-time status tracking — all in one link.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="shadow-glow gap-2">
                Get started <ArrowRight weight="bold" className="text-lg" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="ghost" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-[var(--border)] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-[0.15em] mb-6 text-center font-medium">
            Trusted by businesses across Kenya
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {logos.map((name) => (
              <span key={name} className="text-sm text-[var(--text-muted)] font-medium opacity-50">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="card-surface p-6 hover:border-[var(--border-active)] transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feat.color} flex items-center justify-center ${feat.accent} mb-4`}>
                  <Icon weight="duotone" className="text-lg" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">{feat.title}</h3>
                <p className="text-sm text-[var(--text-subtle)] leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-3 tracking-tight">
            Simple pricing. Free during beta.
          </h2>
          <p className="text-[var(--text-subtle)] mb-8 max-w-xl mx-auto">
            No credit card required. All features included. Start today.
          </p>
          <Link href="/signup">
            <Button size="lg" className="shadow-glow gap-2">
              Get started <ArrowRight weight="bold" className="text-lg" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cube weight="bold" className="text-sm text-[var(--primary)]" />
            <span className="font-display text-sm text-[var(--text-muted)]">Dicosis</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">&copy; {new Date().getFullYear()} Dicosis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
