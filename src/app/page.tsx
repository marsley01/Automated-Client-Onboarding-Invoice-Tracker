"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Link as LinkIcon, FileText, Clock, Bell, User, CreditCard, CheckCircle, Eye } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";

const features = [
  {
    title: "Share a client link",
    desc: "Each job gets its own branded link. Send it via WhatsApp, email, or SMS. Clients open it, see what you're working on, and submit their details — no app download needed.",
    icon: LinkIcon,
  },
  {
    title: "Clients tell you what they need",
    desc: "The client fills a simple form: describe the job, set a budget, pick a deadline. Their submission lands straight in your dashboard — no more endless back-and-forth.",
    icon: User,
  },
  {
    title: "Track progress together",
    desc: "Clients see real-time status updates: Received → In Progress → Ready. No more 'is it done yet?' messages. You update once, they see it instantly.",
    icon: Eye,
  },
  {
    title: "Invoice & get paid",
    desc: "Generate invoices in seconds. Clients view, download, and pay directly through the portal. M-Pesa, bank transfer — whatever works for them.",
    icon: CreditCard,
  },
];

const howItWorks = [
  { step: "1", title: "Create a job", desc: "Enter what the client needs, set a price and deadline. Mash generates a unique link." },
  { step: "2", title: "Share the link", desc: "Send it to your client. They open it, submit their details, and acknowledge the scope." },
  { step: "3", title: "Work & update", desc: "You update the status as you go. Client sees progress live. No chasing, no confusion." },
  { step: "4", title: "Invoice & get paid", desc: "When the job is ready, send an invoice. Client pays through the portal. You get notified." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function LandingPage() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* ─── Nav ─── */}
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-display text-lg font-semibold text-[var(--text-primary)]">Mash</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/signin" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-100">
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tighter text-[var(--text-primary)] text-balance">
            The link your clients use to hire you, track progress, and pay.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-subtle)] leading-relaxed max-w-[65ch]">
            Mash connects you and your clients in one place. Share a job link, receive their details,
            update them on progress, and get paid — without apps, passwords, or confusion.
          </p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Built for Kenyan agencies, freelancers, and repair shops.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start using Mash <ArrowRight weight="bold" className="text-lg" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="ghost" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Free during beta. No credit card required.
          </p>
        </motion.div>
      </section>

      {/* ─── Stats ─── */}
      <section className="border-t border-[var(--border)] py-14 bg-white/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: "100+", l: "Businesses onboarded" },
              { n: "KES 2M+", l: "Invoiced this month" },
              { n: "4.9★", l: "Client satisfaction" },
              { n: "98%", l: "On-time delivery" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-bold text-[var(--text-primary)] [font-variant-numeric:tabular-nums]">{s.n}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] tracking-tight text-balance">
            How Mash works
          </h2>
          <p className="mt-3 text-sm text-[var(--text-subtle)] max-w-lg mx-auto">
            Four steps from creating a job to getting paid. No back-and-forth, no confusion.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-muted)] flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-[var(--primary)]">{item.step}</span>
                </div>
                <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-1">{item.title}</h3>
                <p className="text-xs text-[var(--text-subtle)] leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="border-t border-[var(--border)] py-20 bg-white/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] tracking-tight text-balance">
              What you get
            </h2>
            <p className="mt-3 text-sm text-[var(--text-subtle)] max-w-lg mx-auto">
              Everything you need to manage clients, jobs, and payments in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm hover:border-zinc-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--primary)] mb-4">
                    <Icon weight="duotone" className="text-lg" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-1">{feat.title}</h3>
                  <p className="text-sm text-[var(--text-subtle)] leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Who is this for ─── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] tracking-tight text-balance">
            Who is Mash for?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Freelancers",
              desc: "Graphic designers, writers, photographers, consultants. Share a link, get briefs in your inbox, invoice when done.",
            },
            {
              title: "Repair shops",
              desc: "Phone & laptop repair, auto mechanics, electronics. Log the job, update the customer, collect payment at pickup.",
            },
            {
              title: "Agencies",
              desc: "Design, marketing, software agencies. Manage multiple clients, track project stages, send invoices in bulk.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm"
            >
              <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-subtle)] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-[var(--border)] py-20 bg-white/40">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-3 tracking-tight text-balance">
            Start using Mash today
          </h2>
          <p className="text-[var(--text-subtle)] mb-8 max-w-xl mx-auto text-sm">
            Free during beta. No credit card. All features included.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Create your account <ArrowRight weight="bold" className="text-lg" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold text-[var(--text-primary)]">Mash</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">&copy; {new Date().getFullYear()} Mash. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
