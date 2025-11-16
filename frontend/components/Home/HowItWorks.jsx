"use client"; // Required for Framer Motion

import { motion } from "framer-motion";
import { User, ClipboardList, Handshake, Truck } from "lucide-react";

const steps = [
  {
    title: "Sign Up & Create Profile",
    description: "Farmers and buyers register and set up profiles",
    icon: <User className="w-8 h-8 text-green-600" />,
  },
  {
    title: "Find & Negotiate Contracts",
    description: "List produce or send offers through the marketplace",
    icon: <ClipboardList className="w-8 h-8 text-green-600" />,
  },
  {
    title: "Secure Agreement & Payment",
    description: "Digitally sign contracts with escrow protection",
    icon: <Handshake className="w-8 h-8 text-green-600" />,
  },
  {
    title: "Track & Deliver",
    description: "Monitor fulfillment with real-time updates",
    icon: <Truck className="w-8 h-8 text-green-600" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center text-green-900 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Vertical Line (Chain Animation) */}
          <motion.div
            className="absolute left-6 top-0 h-full w-1 bg-green-200 origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          <div className="space-y-12 pl-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-6 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3, duration: 0.5 }}
              >
                {/* Step Icon with Circle */}
                <div className="absolute -left-12 top-0 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center z-10">
                  {step.icon}
                </div>

                {/* Step Content */}
                <div>
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-brown-700">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}