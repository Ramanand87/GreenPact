"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <footer className="bg-gradient-to-b from-white via-emerald-50/30 to-white border-t border-emerald-100">
      <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* About Us */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              About GreenPact
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Bridging farmers with guaranteed buyers through transparent contracts and fair pricing.
              Our mission is to empower agricultural communities with technology.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Features', 'How It Works', 'FAQs', 'Contact Us'].map((link) => (
                <motion.li key={link} whileHover={{ x: 5 }}>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-emerald-600 transition-colors font-medium text-xs sm:text-sm"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Support & Help</h3>
            <ul className="space-y-2 mb-4 sm:mb-6">
              {['Privacy Policy', 'Terms & Conditions', 'Help Center'].map((link) => (
                <motion.li key={link} whileHover={{ x: 5 }}>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-emerald-600 transition-colors font-medium text-xs sm:text-sm"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Newsletter</h3>
              <form className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-emerald-50 border-emerald-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-emerald-400 text-xs sm:text-sm"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-emerald-600 to-lime-500 hover:shadow-lg hover:shadow-emerald-300/50 text-white whitespace-nowrap text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3">
                    Subscribe
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Contact & Social */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Contact Us</h3>
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <motion.div className="flex items-center gap-2 sm:gap-3" whileHover={{ x: 5 }}>
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                  <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs sm:text-sm">+91 98765 43210</span>
              </motion.div>
              <motion.div className="flex items-center gap-2 sm:gap-3" whileHover={{ x: 5 }}>
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs sm:text-sm">support@greenp.in</span>
              </motion.div>
              <motion.div className="flex items-center gap-2 sm:gap-3" whileHover={{ x: 5 }}>
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                  <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs sm:text-sm">Farmers Plaza, New Delhi, India</span>
              </motion.div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Join Community</h3>
              <div className="flex gap-2 sm:gap-3">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-2.5 rounded-full bg-emerald-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-lime-400 text-emerald-600 hover:text-white transition-all"
                  >
                    <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="border-t border-emerald-100 pt-6 sm:pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 text-xs sm:text-sm">
            © 2025 GreenPact. All rights reserved. | 
            <motion.a 
              href="#" 
              className="hover:text-emerald-600 ml-1 sm:ml-2 font-medium transition-colors"
              whileHover={{ textDecoration: 'underline' }}
            >
              Legal Disclaimer
            </motion.a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
