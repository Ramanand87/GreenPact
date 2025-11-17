"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ShieldCheck, Sparkles } from "lucide-react";

const stats = [
  { label: "Secured Contracts", value: "12K+" },
  { label: "Active Farmers", value: "48K" },
  { label: "Avg. ROI", value: "34%" },
];

export default function Hero3D() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_65%)]" />
      <motion.div
        className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-14 sm:px-6 md:flex-row md:items-center md:gap-20 lg:py-20">
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-2 text-xs uppercase tracking-wide text-emerald-700"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Trusted by progressive growers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            A 3D future for transparent agricultural contracts
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-5 text-base text-slate-600 sm:text-lg"
          >
            Experience a spatial flow of insights, live metrics, and secure agreements in a single immersive surface designed to keep your partnerships aligned and forward-looking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-7 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(34,197,94,0.25)] transition sm:w-auto">
              Explore immersive demo
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-white px-6 py-4 text-base text-emerald-600 transition hover:border-emerald-500/50 hover:bg-emerald-50 sm:w-auto"
            >
              <Play className="h-4 w-4" /> Watch overview
            </Button>
          </motion.div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-[0_12px_30px_rgba(16,185,129,0.10)]"
              >
                <div className="text-xl font-bold text-slate-900 sm:text-2xl">{stat.value}</div>
                <div className="text-xs text-slate-500 sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="relative flex flex-1 items-center justify-center"
          style={{ perspective: "1800px" }}
        >
          <motion.div
            className="relative h-[420px] w-full max-w-[440px] rounded-[30px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/40 to-white shadow-[0_25px_80px_rgba(16,185,129,0.25)]"
            animate={{ rotateY: [8, -8, 8] }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 rounded-[30px] border border-emerald-100 bg-gradient-to-br from-emerald-500/15 via-transparent to-lime-500/15" />

            <motion.div
              className="absolute left-6 top-8 flex gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_15px_30px_rgba(16,185,129,0.18)]"
              initial={{ opacity: 0, y: -10, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              style={{ transform: "translateZ(80px)" }}
            >
              <Sparkles className="h-10 w-10 text-emerald-500" />
              <div>
                <div className="text-sm font-semibold text-slate-900">AI Forecast</div>
                <div className="text-xs text-emerald-600">Market outlook: bullish</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-6 bottom-10 w-52 rounded-2xl border border-emerald-100 bg-white p-4 text-slate-900 shadow-[0_20px_45px_rgba(16,185,129,0.18)]"
              initial={{ opacity: 0, y: 20, rotateY: 20 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              style={{ transform: "translateZ(120px)" }}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Live yield monitor
              </div>
              <div className="mt-3 flex items-center justify-between text-slate-900">
                <span className="text-lg font-semibold">+14.8%</span>
                <span className="text-xs text-emerald-600">vs last cycle</span>
              </div>
              <motion.div
                className="mt-4 h-1.5 w-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/30"
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(40px)" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
