"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4">About AgriConnect</h3>
            <p className="text-green-200 text-sm">
              Bridging farmers with guaranteed buyers through transparent contracts and fair pricing.
              Our mission is to empower agricultural communities with technology.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Features', 'How It Works', 'FAQs', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-green-200 hover:text-green-50 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4">Support & Help</h3>
            <ul className="space-y-2 mb-6">
              {['Privacy Policy', 'Terms & Conditions', 'Help Center'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-green-200 hover:text-green-50 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Newsletter</h3>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-green-800 border-green-700 text-green-50"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  Subscribe
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>support@agriconnect.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Farmers Plaza, New Delhi, India</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Join Community</h3>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-full bg-green-800 hover:bg-green-700 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t border-green-800 pt-8 text-center text-green-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p>
            © 2024 AgriConnect. All rights reserved. | 
            <a href="#" className="hover:text-green-200 ml-2">Legal Disclaimer</a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}