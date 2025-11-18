"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Farmers", value: "50K+" },
  { label: "Contracts", value: "10K+" },
  { label: "Secured Value", value: "₹500Cr+" },
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

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-2 text-xs uppercase tracking-wide text-emerald-700"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Trusted by
          Thousands of Farmers
        </motion.div>

        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Secure Your Future with Guaranteed Contracts
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mt-5 text-base text-slate-600 sm:text-lg"
            >
              Connect with verified partners, secure fair pricing, and build
              sustainable farming relationships with transparent, protected
              contracts
            </motion.p>
               <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-8 hidden md:flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/market">
            <Button className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-7 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(34,197,94,0.25)] transition sm:w-auto">
              Get Started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/about-us">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-white px-6 py-4 text-base text-emerald-600 transition hover:border-emerald-500/50 hover:bg-emerald-50 sm:w-auto"
            >
              <Play className="h-4 w-4" /> Learn More
            </Button>
          </Link>
        </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-start justify-center md:w-[380px] lg:w-[440px]"
          >
            <div className="relative h-[300px] w-full rounded-[30px] overflow-hidden border border-emerald-100 shadow-[0_25px_80px_rgba(16,185,129,0.25)] sm:h-[350px] md:h-[280px] lg:h-[320px]">
              <img
                src="/homeHero.png"
                alt="GreenPact Hero"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-8 flex md:hidden flex-col gap-3 sm:flex-row"
        >
          <Link href="/market">
            <Button className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-7 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(34,197,94,0.25)] transition sm:w-auto">
              Get Started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/about-us">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-white px-6 py-4 text-base text-emerald-600 transition hover:border-emerald-500/50 hover:bg-emerald-50 sm:w-auto"
            >
              <Play className="h-4 w-4" /> Learn More
            </Button>
          </Link>
        </motion.div>

        <div className="mt-20 grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4 + index * 0.1,
                ease: "easeOut",
              }}
              className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-[0_12px_30px_rgba(16,185,129,0.10)]"
            >
              <div className="text-xl font-bold text-slate-900 sm:text-2xl">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 sm:text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
