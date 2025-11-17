"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-12 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-emerald-200/40 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-lime-200/40 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-full mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-600" />
            <span className="text-emerald-700 text-xs sm:text-sm font-semibold">
              Ready to Transform Your Farming?
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
            Start Building{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-600">
              Secure Contracts Today
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed">
            Join thousands of farmers and contractors who are already securing better deals, protecting their interests, and growing their businesses with trusted partnerships.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            whileInView={{
              transition: { staggerChildren: 0.1 },
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link href="/market">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all">
                Get Started Now <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
              </Link>
            </motion.div>
            
          </motion.div>

          <motion.div
            className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-200 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            {["2000+ Active Users", "500+ Monthly Contracts", "100% Secure Platform"].map(
              (indicator, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm sm:text-base text-slate-600">{indicator}</span>
                </motion.div>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
