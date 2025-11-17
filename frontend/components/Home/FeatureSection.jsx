"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Users, Clock, MessageSquare, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Guaranteed Protection",
    description:
      "Legally binding digital contracts with escrow security for all parties",
    color: "emerald",
  },
  {
    icon: TrendingUp,
    title: "Fair & Transparent",
    description: "AI-driven price recommendations ensuring equitable deals",
    color: "lime",
  },
  {
    icon: Users,
    title: "Verified Partners",
    description: "Access to pre-screened farmers and contractors you can trust",
    color: "emerald",
  },
  {
    icon: Clock,
    title: "Timely Payments",
    description: "Secure escrow system guaranteeing on-time settlements",
    color: "lime",
  },
  {
    icon: MessageSquare,
    title: "Seamless Communication",
    description: "Built-in chat and notifications for easy coordination",
    color: "emerald",
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description: "AI-powered insights helping you make informed decisions",
    color: "lime",
  },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-lime-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="mx-auto max-w-7xl px-4  relative z-10">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            Powerful Features for Success
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to build trust, manage contracts, and grow your agricultural business
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 h-full hover:border-emerald-400 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                  <motion.div
                    className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className={`w-6 sm:w-7 h-6 sm:h-7 text-${feature.color}-600`} />
                  </motion.div>

                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3 group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
