"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  BarChart3,
  Leaf,
  Sparkles,
  Handshake,
  Globe2,
  Target,
  CheckCircle2,
  HeartHandshake,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Farmers Empowered", value: "50K+", description: "Verified profiles actively using GreenPact" },
  { label: "Contracts Secured", value: "10K+", description: "Digitally executed agreements protected by escrow" },
  { label: "Value Protected", value: "₹500Cr+", description: "Assured payouts secured for both parties" },
];

const strengths = [
  {
    icon: ShieldCheck,
    title: "Contract Assurance",
    description: "Transparent, milestone-based escrow keeps every engagement honest and timely.",
  },
  {
    icon: Users,
    title: "Verified Community",
    description: "Biometric checks, land records, and compliance reviews certify every participant before they transact.",
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description: "AI powered insights surface fair pricing, demand signals, and negotiated outcomes in real time.",
  },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainable Growth",
    description: "We champion climate-smart practices and long-term partnerships over short-term gains.",
  },
  {
    icon: Sparkles,
    title: "Innovation First",
    description: "Spatial dashboards, predictive analytics, and automation streamline everyday decisions.",
  },
  {
    icon: Handshake,
    title: "Trust & Transparency",
    description: "Every clause, payment, and delivery milestone is visible, auditable, and secure for all stakeholders.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "The Idea Takes Root",
    description: "Frustrations with opaque middlemen inspired a contract-first marketplace for agriculture.",
  },
  {
    year: "2024",
    title: "GreenPact Platform Launch",
    description: "We released the end-to-end contract builder with escrow, verification, and live crop insights.",
  },
  {
    year: "2025",
    title: "Spatial Workflows",
    description: "Immersive dashboards, AI negotiators, and logistics coordination rolled out across India.",
  },
];

const impactPillars = [
  {
    icon: Globe2,
    title: "Pan-India Reach",
    description: "Active farmer and contractor clusters across 18 states and counting.",
  },
  {
    icon: Target,
    title: "Outcome Guarantee",
    description: "Milestone-linked payouts safeguard the interest of both growers and buyers.",
  },
  {
    icon: CheckCircle2,
    title: "Compliance Ready",
    description: "Digital audit trails make regulatory reporting painless for every transaction.",
  },
];

const commitments = [
  {
    icon: HeartHandshake,
    heading: "Community Partnerships",
    bullets: [
      "Regional agronomists supporting onboarding and training",
      "Local language support across product and help desk",
      "Seasonal programs that reward reliable performance",
    ],
  },
  {
    icon: BadgeCheck,
    heading: "Continuous Assurance",
    bullets: [
      "Escrow governance council reviewing platform SLAs",
      "24/7 monitoring for fraud and payment risks",
      "Independent audits validating contract workflows",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function AboutPage() {
  return (
    <section className="bg-white text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_65%)]" />
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-16">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-2 text-xs uppercase tracking-wide text-emerald-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> About GreenPact
            </div>
            <h1 className="mx-auto mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Trusted contracts for resilient agriculture
            </h1>
            <p className="mx-auto mt-5 text-base text-slate-600 sm:text-lg">
              GreenPact unites verified farmers, FPOs, and buyers through escrow-backed agreements, transparent pricing, and coordinated logistics so every harvest reaches the market with confidence.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto grid w-full max-w-7xl gap-4 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={containerVariants}
                className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_18px_46px_rgba(16,185,129,0.12)]"
              >
                <div className="text-emerald-600 text-sm font-semibold uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className="mt-2 text-sm text-slate-500">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <motion.div
          className="grid gap-10 lg:grid-cols-[1.4fr_1fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={containerVariants}>
            <h2 className="text-3xl font-semibold sm:text-4xl">Why we exist</h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              We started GreenPact to remove opacity, delayed payments, and broken promises from agricultural contracts. By digitising every touchpoint, we enable farmers to negotiate with confidence, contractors to plan with certainty, and buyers to meet sustainability commitments.
            </p>
            <div className="mt-8 space-y-6">
              {strengths.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="relative overflow-hidden rounded-[36px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-white p-8 shadow-[0_30px_90px_rgba(148,163,184,0.25)]"
          >
            <div className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Mission</div>
            <p className="mt-4 text-base text-slate-700 sm:text-lg">
              To guarantee predictable incomes for growers while assuring buyers of quality, traceability, and on-time delivery through transparent, technology-led contracts.
            </p>
            <div className="mt-10 rounded-3xl bg-white/70 p-6 shadow-inner">
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Vision 2030</div>
              <p className="mt-3 text-sm text-slate-600">
                Enable one million farmers to access global demand with zero payment delays and measurable sustainability outcomes.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50 to-white">
        <div className="absolute inset-x-0 -top-20 h-32 bg-gradient-to-b from-emerald-200/60 to-transparent blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-3xl font-semibold sm:text-4xl">Our journey so far</h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              From a small founding squad to a nationwide network, every milestone reflects the resilience of the agricultural community we serve.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-6 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {milestones.map(({ year, title, description }) => (
              <motion.div
                key={year}
                variants={containerVariants}
                className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_rgba(34,197,94,0.12)]"
              >
                <div className="text-sm font-semibold uppercase tracking-wider text-emerald-600">{year}</div>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm text-slate-600">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <motion.div
          className="grid gap-10 lg:grid-cols-[1.2fr_1fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={containerVariants}>
            <h2 className="text-3xl font-semibold sm:text-4xl">Impact pillars</h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              We combine on-ground expertise with real-time technology to make every contract accountable and every harvest successful.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {impactPillars.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <Icon className="h-6 w-6 text-emerald-600" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="rounded-[36px] border border-emerald-100 bg-white p-8 shadow-[0_25px_70px_rgba(16,185,129,0.18)]"
          >
            <h3 className="text-lg font-semibold text-slate-900">What partners receive</h3>
            <p className="mt-3 text-sm text-slate-600">
              Dedicated success teams, agronomy advisors, and data-backed dashboards ensure every stakeholder stays aligned from seed to shipment.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 text-emerald-500" /> Regional playbooks tailored to crop cycles and climate.
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 text-emerald-500" /> Live contract health scores with automated alerts.
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 text-emerald-500" /> Performance-based incentives and access to premium buyers.
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-500 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <motion.div
            className="grid gap-10 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {commitments.map(({ icon: Icon, heading, bullets }) => (
              <motion.div
                key={heading}
                variants={containerVariants}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">{heading}</h3>
                </div>
                <ul className="mt-5 space-y-3 text-sm opacity-90">
                  {bullets.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-4 w-4" /> {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <motion.div
          className="rounded-[40px] border border-emerald-100 bg-white p-10 text-center shadow-[0_30px_90px_rgba(148,163,184,0.25)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-emerald-50 px-4 py-2 text-xs uppercase tracking-wide text-emerald-700">
            <ArrowRight className="h-4 w-4 text-emerald-600" /> Join the movement
          </div>
          <h2 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Ready to co-create the future of resilient agriculture?
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Partner with GreenPact to access verified stakeholders, intelligent contracts, and an ecosystem that rewards trust. We are here to help you scale sustainably.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-emerald-600 shadow-[0_18px_40px_rgba(34,197,94,0.25)] transition hover:bg-emerald-50 sm:w-auto">
              Talk to our team
            </Button>
            <Link href="/market"> 
            <Button
              variant="outline"
              className="w-full rounded-full border border-emerald-300 px-8 py-4 text-base text-emerald-600 transition hover:bg-emerald-50 sm:w-auto"
            >
              Explore the marketplace
            </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
