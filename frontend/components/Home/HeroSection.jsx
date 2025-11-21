"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from 'lucide-react';
import Link from "next/link";
import { useSelector } from "react-redux";

export default function HeroSection() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  console.log("User Info in HeroSection:");
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-emerald-50 to-white overflow-hidden flex items-center justify-center py-8 sm:py-12 md:py-0 md:min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-48 sm:w-96 h-48 sm:h-96 bg-emerald-100/40 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl py-6 sm:py-12 md:py-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-3 sm:p-4 bg-emerald-100 rounded-full backdrop-blur-sm border border-emerald-300"
          >
            <Leaf className="w-8 sm:w-12 h-8 sm:h-12 text-emerald-600" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight"
        >
          Secure Your Future with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-600">
            Guaranteed Contracts
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Connect with verified partners, secure fair pricing, and build sustainable farming relationships with transparent, protected contracts
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link href={userInfo ? "/market" : "/login"}>
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Get Started <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
            </Button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link href={userInfo ? "/about-us" : "/login"}>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full"
            >
              Learn More
            </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-2 sm:gap-4 mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-emerald-200"
        >
          {[
            { number: "50K+", label: "Farmers" },
            { number: "10K+", label: "Contracts" },
            { number: "₹500Cr+", label: "Secured Value" },
          ].map((stat, index) => (
            <motion.div key={index} animate={floatingVariants}>
              <div className="text-emerald-700 text-lg sm:text-2xl md:text-3xl font-bold">
                {stat.number}
              </div>
              <div className="text-slate-600 text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
