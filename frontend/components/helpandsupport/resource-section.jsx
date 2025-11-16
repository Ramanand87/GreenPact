"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Video, Download, ExternalLink, BookOpen, Calendar, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ResourcesSection({ userType }) {
  const [expandedCategory, setExpandedCategory] = useState("guides")

  const resources = {
    farmer: [
      {
        id: "guides",
        title: "Guides & Tutorials",
        icon: <BookOpen className="w-5 h-5" />, 
        items: [
          { title: "Understanding Contract Farming", type: "PDF", new: true },
          { title: "How to Negotiate Better Terms", type: "Video" },
          { title: "Managing Your Farm Records", type: "PDF" },
          { title: "Using the Mobile App", type: "Tutorial" },
        ],
      },
      {
        id: "documents",
        title: "Important Documents",
        icon: <FileText className="w-5 h-5" />,
        items: [
          { title: "Sample Contract Template", type: "PDF" },
          { title: "Farmer Rights Document", type: "PDF", new: true },
          { title: "Payment Schedule", type: "PDF" },
          { title: "Quality Standards Guide", type: "PDF" },
        ],
      },
    ],
    contractor: [
      {
        id: "guides",
        title: "Guides & Tutorials",
        icon: <BookOpen className="w-5 h-5" />,
        items: [
          { title: "Contractor Onboarding Guide", type: "PDF" },
          { title: "Finding Reliable Farmers", type: "Video" },
          { title: "Quality Control Best Practices", type: "PDF", new: true },
          { title: "Using the Contractor Dashboard", type: "Tutorial" },
        ],
      },
      {
        id: "documents",
        title: "Important Documents",
        icon: <FileText className="w-5 h-5" />,
        items: [
          { title: "Contract Templates", type: "PDF" },
          { title: "Legal Compliance Guide", type: "PDF" },
          { title: "Contractor Responsibilities", type: "PDF" },
          { title: "Dispute Resolution Process", type: "PDF", new: true },
        ],
      },
    ],
  }

  const getIconForType = (type) => {
    const icons = {
      PDF: <FileText className="w-4 h-4" />, 
      Video: <Video className="w-4 h-4" />,
      Tutorial: <BookOpen className="w-4 h-4" />,
      Calendar: <Calendar className="w-4 h-4" />,
      Event: <Calendar className="w-4 h-4" />,
      FAQ: <HelpCircle className="w-4 h-4" />,
    }
    return icons[type] || <FileText className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {resources[userType].map((category) => (
          <Button
            key={category.id}
            variant={expandedCategory === category.id ? "default" : "outline"}
            onClick={() => setExpandedCategory(category.id)}
          >
            {category.icon}
            <span className="ml-2">{category.title}</span>
          </Button>
        ))}
      </div>

      {resources[userType].map((category) => (
        expandedCategory === category.id && (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {category.items.map((item, index) => (
                <Card key={index} className="border-2 border-primary/20 transition-all hover:shadow-md">
                  <CardContent className="p-4 flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-4 bg-primary/20 rounded-full">
                      {getIconForType(item.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.new && <Badge variant="outline" className="ml-2 bg-secondary/20">New</Badge>}
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      {item.type === "PDF" || item.type === "Video" ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )
      ))}
    </div>
  )
}
