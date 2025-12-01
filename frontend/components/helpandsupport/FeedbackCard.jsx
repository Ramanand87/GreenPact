"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp } from "lucide-react"
import { FeedbackForm } from "./feedback-form"

export function FeedbackCard({ activeTab }) {
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
            <span>Share Your Feedback</span>
          </CardTitle>
          <CardDescription>Help us improve our platform by sharing your experience</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <FeedbackForm userType={activeTab} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
