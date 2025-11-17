"use client";

import { motion } from "framer-motion";
import { User, FileText, Handshake, Truck, CheckCircle } from 'lucide-react';

const steps = [
  {
    title: "Create Your Profile",
    description: "Sign up as a farmer or contractor and complete verification",
    icon: User,
  },
  {
    title: "Browse & Connect",
    description: "Explore available contracts or post your needs in the marketplace",
    icon: FileText,
  },
  {
    title: "Negotiate & Agree",
    description: "Discuss terms and digitally sign secure contracts",
    icon: Handshake,
  },
  {
    title: "Transact Safely",
    description: "Complete transactions with escrow protection for both parties",
    icon: Truck,
  },
  {
    title: "Grow Together",
    description: "Build long-term relationships with verified, reliable partners",
    icon: CheckCircle,
  },
];

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-r from-emerald-100/20 via-transparent to-lime-100/20"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ transform: "translate(-50%, -50%)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto">
            A smooth, transparent process designed for trust and efficiency
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute left-5 sm:left-7 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-lime-400 to-emerald-400 rounded-full"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
            style={{ x: "-50%" }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                variants={stepVariants}
                className={`mb-6 sm:mb-12 flex flex-col md:${isEven ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-full md:w-1/2 ${isEven ? "md:pr-16" : "md:pl-16"} pl-16 sm:pl-20 md:pl-0`}>
                  <motion.div
                    className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 hover:border-emerald-400 hover:shadow-md transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-slate-900 mb-2 sm:mb-3">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                <div className="w-full md:w-auto flex justify-start md:justify-center relative z-10 mt-3 sm:mt-0">
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.15, boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10 + index,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Icon className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
