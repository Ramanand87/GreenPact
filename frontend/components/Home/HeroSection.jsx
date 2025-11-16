"use client"; // Required for Framer Motion in Next.js

import { Button } from "@/components/ui/button"; // shadcn Button
import { ArrowRight } from "lucide-react"; // Icon
import { motion } from "framer-motion"; // Framer Motion

export default function HeroSection() {
  return (
    <section className="relative h-[650px] md:h-[600px] flex items-center justify-center bg-green-900 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('/farmer-buyer-handshake.jpg')", // Replace with your image
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Secure Your Future with Guaranteed Farming Contracts
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Assured Buyers | Fair Prices | Timely Payments
        </p>

        {/* CTA Button */}
        <Button className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
          Get Started <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>

      {/* Subtle Animation: Growing Crops */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/80 to-transparent flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="flex space-x-4">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              className="w-8 h-8 bg-yellow-500 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.5,
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}