"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function CallToAction3D() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white py-24 text-slate-900 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.15),_transparent_65%)]" />
      <motion.div
        className="absolute -left-10 top-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[36px] border border-emerald-100 bg-white p-10 shadow-[0_30px_90px_rgba(148,163,184,0.25)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-200/60 via-transparent to-lime-200/50"
            animate={{ opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-2 text-xs uppercase tracking-wider text-emerald-700">
              <Zap className="h-4 w-4 text-emerald-600" /> Ready to Transform Your Farming?
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
              Start Building Secure Contracts Today
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Join thousands of farmers and contractors who are already securing better deals, protecting their interests, and growing their businesses with trusted partnerships.
            </p>
          </motion.div>

          <motion.div
            className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <Link href={userInfo ? "/market" : "/login"}>
            <Button className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-8 py-4 text-base font-semibold text-white shadow-[0_20px_60px_rgba(34,197,94,0.28)] transition sm:w-auto">
              Get Started Now
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Button>
            </Link>
            <Link href={userInfo ? "/about-us" : "/login"}>
            <Button
              variant="outline"
              className="flex w-full items-center justify-center rounded-full border border-emerald-500/30 bg-white px-8 py-4 text-base text-emerald-600 transition hover:border-emerald-500/50 hover:bg-emerald-50 sm:w-auto"
            >
              Learn More
            </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
