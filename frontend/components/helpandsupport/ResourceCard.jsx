"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { ResourcesSection } from "./resource-section"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function ResourceCard({ userType }) {
  return (
    <motion.div
      className="grid gap-6 mt-6 md:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="md:col-span-2">
        <Card>
          <CardHeader className="bg-primary/20 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6" />
              <span>{userType === "farmer" ? "Farmer Resources" : "Contractor Resources"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResourcesSection userType={userType} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
