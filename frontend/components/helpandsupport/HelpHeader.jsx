"use client"

import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function HelpHeader() {
  const { t } = useTranslate()

  return (
    <motion.div
      className="flex flex-col items-center justify-between mb-8 space-y-4 md:flex-row md:space-y-0"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-primary/20">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {t('helpAndSupport', { en: 'Help & Support', hi: 'सहायता और समर्थन' })}
        </h1>
      </div>
    </motion.div>
  )
}
