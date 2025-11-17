"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Aparna Devi",
    role: "Organic farmer, Karnataka",
    quote:
      "The 3D cockpit shows me contract health, logistics, and finance streams in one sweep. Our partners finally feel like co-pilots, not strangers.",
  },
  {
    name: "Raghav Sharma",
    role: "Agri contractor, Punjab",
    quote:
      "Negotiations are faster because the agreement literally surrounds us. We highlight clauses, simulate risks, and commit with absolute clarity.",
  },
  {
    name: "GreenFuture Coop",
    role: "Agri collective, Maharashtra",
    quote:
      "Real-time projections surfaced by AI agents help us optimise crop rotations and cashflow, keeping every member accountable.",
  },
];

export default function Testimonials3D() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 text-slate-900 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.12),_transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-100/60 to-transparent blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Quote className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">Voices inside the immersive hub</h2>
          <p className="mt-3 text-base text-slate-600">
            Stories from teams who now operate inside the layered GreenPact environment.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              className="group relative h-full overflow-hidden rounded-[28px] border border-emerald-100 bg-white p-7 shadow-[0_25px_60px_rgba(148,163,184,0.22)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ rotateX: -6, rotateY: 6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="absolute -right-6 top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/40 to-lime-400/40 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative">
                <p className="text-sm text-slate-600">
                  {item.quote}
                </p>
                <div className="mt-6 flex flex-col">
                  <span className="text-base font-semibold text-slate-900">{item.name}</span>
                  <span className="text-xs uppercase tracking-wider text-emerald-600">{item.role}</span>
                </div>
                <div className="mt-6 flex items-center gap-1 text-emerald-500">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
