"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp } from "lucide-react"
import { FAQSection } from "./faqs"

export function FAQCard({ activeTab }) {
  return (
    <motion.div
      className="mt-12 mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
    >
      <Card>
        <CardHeader className="bg-primary/20 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <ThumbsUp className="w-6 h-6" />
            <span>FAQs</span>
          </CardTitle>
          <CardDescription>Frequently asked questions</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <FAQSection userType={activeTab} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
