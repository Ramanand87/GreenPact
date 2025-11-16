// components/helpandsupport/faq-section.jsx
"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = {
  farmer: [
    {
      question: "How do I register as a farmer?",
      answer: "You can register by visiting our support center or through the mobile app."
    },
    {
      question: "What documents are required for registration?",
      answer: "You need your Aadhaar card, land ownership proof, and a recent photograph."
    },
    {
      question: "How can I get financial assistance?",
      answer: "Visit the financial assistance section in the app or contact our helpline."
    }
  ],
  contractor: [
    {
      question: "How do I register as a contractor?",
      answer: "You can register by visiting our business portal or through the mobile app."
    },
    {
      question: "What are the benefits of registering?",
      answer: "You get access to exclusive contracts, business support, and training programs."
    },
    {
      question: "How can I list my services?",
      answer: "You can list your services through the contractor dashboard in the app."
    }
  ]
};

export function FAQSection({ userType }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {faqs[userType].map((faq, index) => (
        <div key={index} className="border rounded-lg">
          <button
            onClick={() => toggleFAQ(index)}
            className="flex items-center justify-between w-full p-4 text-left"
          >
            <span className="text-lg font-medium">{faq.question}</span>
            {expandedIndex === index ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedIndex === index && (
            <motion.div
              className="p-4 pt-0"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-muted-foreground">{faq.answer}</p>
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
}
