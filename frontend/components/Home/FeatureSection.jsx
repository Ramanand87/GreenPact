"use client"; // Required for Framer Motion in Next.js

import { motion } from "framer-motion"; // Framer Motion
import { Check, Scale, Handshake, Clock, MessageSquare, BarChart } from "lucide-react"; // Icons

const features = [
  {
    icon: <Handshake className="w-10 h-10 text-green-600" />,
    title: "Guaranteed Buyers",
    description: "Farmers get access to verified buyers with assured contracts.",
  },
  {
    icon: <Scale className="w-10 h-10 text-green-600" />,
    title: "Fair & Transparent Pricing",
    description: "AI-driven price recommendations ensure fairness.",
  },
  {
    icon: <Check className="w-10 h-10 text-green-600" />,
    title: "Secure Digital Contracts",
    description: "Legally binding agreements with e-signature support.",
  },
  {
    icon: <Clock className="w-10 h-10 text-green-600" />,
    title: "Timely Payments",
    description: "Secure escrow system ensuring on-time payments.",
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-green-600" />,
    title: "Real-Time Communication",
    description: "Built-in chat and notification system for seamless coordination.",
  },
  {
    icon: <BarChart className="w-10 h-10 text-green-600" />,
    title: "Market Insights & Forecasts",
    description: "AI-powered analytics help farmers make informed decisions.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center text-green-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-brown-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}