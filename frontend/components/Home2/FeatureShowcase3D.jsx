"use client";

import { motion } from "framer-motion";
import { Shield, Box , Layers, Workflow, Sparkles, Gauge } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Multi-layered escrow",
    description: "Dynamic escrow tiers that adapt to contract milestones with automated releases.",
    accent: "from-emerald-500 to-teal-400",
  },
  {
    icon: Box,
    title: "Spatial contract viewer",
    description: "Navigate agreements inside a 3D vault and surface clauses with natural gestures.",
    accent: "from-lime-400 to-emerald-500",
  },
  {
    icon: Layers,
    title: "Stacked intelligence",
    description: "Layer demand analytics, soil data, and climate indices for richer decisions.",
    accent: "from-cyan-400 to-emerald-500",
  },
  {
    icon: Workflow,
    title: "Adaptive workflows",
    description: "Orchestrate negotiation, verification, and logistics with branching automations.",
    accent: "from-emerald-400 to-blue-400",
  },
  {
    icon: Sparkles,
    title: "Predictive surfaces",
    description: "AI agents project price swings and recommend interventions before risks surface.",
    accent: "from-lime-500 to-emerald-400",
  },
  {
    icon: Gauge,
    title: "Real-time health",
    description: "Monitor performance metrics inside luminous gauges synced across devices.",
    accent: "from-emerald-500 to-indigo-400",
  },
];

export default function FeatureShowcase3D() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 text-slate-900 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.08),_transparent_70%)]" />
      <div className="absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-emerald-200/50 to-transparent blur-2xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Explore the layered command center</h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Each module responds to movement and depth, letting your teams negotiate, execute, and learn inside a persistent 3D workspace.
          </p>
        </motion.div>

        <div
          className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          style={{ perspective: "1400px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="relative h-full rounded-3xl border border-emerald-100 bg-white p-1 shadow-[0_18px_46px_rgba(16,185,129,0.12)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
              >
                <motion.div
                  whileHover={{ rotateX: -8, rotateY: 8, translateZ: 20 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="h-full rounded-[26px] bg-white p-7 shadow-[0_20px_50px_rgba(148,163,184,0.25)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-40 blur`} />
                    <Icon className="relative z-10 h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">
                    {feature.description}
                  </p>
                  <motion.div
                    className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-500"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
