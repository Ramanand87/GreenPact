// components/helpandsupport/faq-section.jsx
"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslate } from "@/lib/LanguageContext";

export function FAQSection({ userType }) {
  const { t } = useTranslate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = {
    farmer: [
      {
        question: t('faqFarmerQ1', { en: 'How do I register as a farmer?', hi: 'मैं किसान के रूप में पंजीकरण कैसे करूं?' }),
        answer: t('faqFarmerA1', { en: 'You can register by visiting our support center or through the mobile app.', hi: 'आप हमारे सपोर्ट सेंटर पर जाकर या मोबाइल ऐप के माध्यम से पंजीकरण कर सकते हैं।' })
      },
      {
        question: t('faqFarmerQ2', { en: 'What documents are required for registration?', hi: 'पंजीकरण के लिए कौन से दस्तावेज़ों की आवश्यकता है?' }),
        answer: t('faqFarmerA2', { en: 'You need your Aadhaar card, land ownership proof, and a recent photograph.', hi: 'आपको आधार कार्ड, जमीन के स्वामित्व का प्रमाण और हाल की तस्वीर चाहिए।' })
      },
      {
        question: t('faqFarmerQ3', { en: 'How can I get financial assistance?', hi: 'मैं वित्तीय सहायता कैसे प्राप्त कर सकता हूं?' }),
        answer: t('faqFarmerA3', { en: 'Visit the financial assistance section in the app or contact our helpline.', hi: 'ऐप में वित्तीय सहायता अनुभाग पर जाएं या हमारी हेल्पलाइन से संपर्क करें।' })
      }
    ],
    contractor: [
      {
        question: t('faqContractorQ1', { en: 'How do I register as a contractor?', hi: 'मैं ठेकेदार के रूप में पंजीकरण कैसे करूं?' }),
        answer: t('faqContractorA1', { en: 'You can register by visiting our business portal or through the mobile app.', hi: 'आप हमारे बिज़नेस पोर्टल पर जाकर या मोबाइल ऐप के माध्यम से पंजीकरण कर सकते हैं।' })
      },
      {
        question: t('faqContractorQ2', { en: 'What are the benefits of registering?', hi: 'पंजीकरण के क्या फायदे हैं?' }),
        answer: t('faqContractorA2', { en: 'You get access to exclusive contracts, business support, and training programs.', hi: 'आपको विशेष अनुबंधों, व्यापार समर्थन और प्रशिक्षण कार्यक्रमों तक पहुंच मिलती है।' })
      },
      {
        question: t('faqContractorQ3', { en: 'How can I list my services?', hi: 'मैं अपनी सेवाओं को कैसे सूचीबद्ध कर सकता हूं?' }),
        answer: t('faqContractorA3', { en: 'You can list your services through the contractor dashboard in the app.', hi: 'आप ऐप में ठेकेदार डैशबोर्ड के माध्यम से अपनी सेवाओं को सूचीबद्ध कर सकते हैं।' })
      }
    ]
  };

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
