"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Video, Download, ExternalLink, BookOpen, Calendar, HelpCircle, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslate } from "@/lib/LanguageContext"

export function ResourcesSection({ userType }) {
  const { t } = useTranslate();
  const [expandedCategory, setExpandedCategory] = useState("guides")

  const resources = {
    farmer: [
      {
        id: "guides",
        title: t('guidesTutorials', { en: 'Guides & Tutorials', hi: 'गाइड और ट्यूटोरियल' }),
        icon: <BookOpen className="w-5 h-5" />,
        items: [
          { title: t('understandingContractFarming', { en: 'Understanding Contract Farming', hi: 'कॉन्ट्रैक्ट फार्मिंग को समझना' }), type: "PDF", new: true, link: "https://drive.google.com/file/d/16e6a-AIee5mlru9LWi6qgIAh0q_7xz-c/view?usp=sharing", actionIcon: "external" },
          { title: t('negotiateBetterTerms', { en: 'How to Negotiate Better Terms', hi: 'बेहतर शर्तें कैसे तय करें' }), type: "Video", link: "" , actionIcon: "external"},
          { title: t('managingFarmRecords', { en: 'Managing Your Farm Records', hi: 'अपने फार्म रिकॉर्ड प्रबंधित करना' }), type: "PDF", link: "https://drive.google.com/file/d/1gimZlUWq4vQE6nJv1KhC-Yw8hl1isrY6/view?usp=sharing", actionIcon: "external" },
          { title: t('usingMobileApp', { en: 'Using the Mobile App', hi: 'मोबाइल ऐप का उपयोग' }), type: "Tutorial", icon: <Smartphone className="w-4 h-4" />, link: "https://drive.google.com/file/d/1JO2knWi8qjEd-taI7XH7nC8yC65qhxsh/view?usp=sharing", actionIcon: "external" },
        ],
      },
      {
        id: "documents",
        title: t('importantDocuments', { en: 'Important Documents', hi: 'महत्वपूर्ण दस्तावेज़' }),
        icon: <FileText className="w-5 h-5" />,
        items: [
          { title: t('sampleContractTemplate', { en: 'Sample Contract Template', hi: 'नमूना अनुबंध टेम्प्लेट' }), type: "PDF", link: "https://drive.google.com/file/d/1dhAVlWuKlS6M2_tI3Tnc5SOU2ztq1CJE/view?usp=sharing", actionIcon: "external" },
          { title: t('farmerRightsDocument', { en: 'Farmer Rights Document', hi: 'किसान अधिकार दस्तावेज़' }), type: "PDF", new: true, link: "https://drive.google.com/file/d/1pdfxSXPgBYO2vo42Q5GW2BXXxihnAmwg/view?usp=sharing", actionIcon: "external" },
          { title: t('paymentSchedule', { en: 'Payment Schedule', hi: 'भुगतान अनुसूची' }), type: "PDF", link: "https://drive.google.com/file/d/1_0wESNT5rafhfCLcGlTae8KxYDQTvAUC/view?usp=sharing", actionIcon: "external" },
          { title: t('qualityStandardsGuide', { en: 'Quality Standards Guide', hi: 'गुणवत्ता मानक गाइड' }), type: "PDF", link: "https://drive.google.com/file/d/1zUsLZUUhUgi9QMEYyz0ba0u39cAV7MI4/view?usp=sharing", actionIcon: "external" },
        ],
      },
    ],
    contractor: [
      {
        id: "guides",
        title: t('guidesTutorials', { en: 'Guides & Tutorials', hi: 'गाइड और ट्यूटोरियल' }),
        icon: <BookOpen className="w-5 h-5" />,
        items: [
          { title: t('contractorOnboardingGuide', { en: 'Contractor Onboarding Guide', hi: 'ठेकेदार ओनबोर्डिंग गाइड' }), type: "PDF" , link:"https://drive.google.com/file/d/1IiDNmdJqjynuQG-1MoSjSAlrm1o18gfb/view?usp=sharing", actionIcon: "external" },
          { title: t('findingReliableFarmers', { en: 'Finding Reliable Farmers', hi: 'विश्वसनीय किसान ढूंढना' }), type: "Video", link:"", actionIcon: "external"},
          { title: t('qualityControlBestPractices', { en: 'Quality Control Best Practices', hi: 'गुणवत्ता नियंत्रण सर्वोत्तम प्रथाएं' }), type: "PDF", new: true , link:"https://drive.google.com/file/d/1uMhhgMH0ZKo_f58-N9udFxXP-hCFKHU0/view?usp=sharing", actionIcon: "external"},
          { title: t('usingContractorDashboard', { en: 'Using the Contractor Dashboard', hi: 'ठेकेदार डैशबोर्ड का उपयोग' }), type: "Tutorial" , link:"https://drive.google.com/file/d/1Om6hIQOScfN2qekaB00YyYgYzGymhYDb/view?usp=sharing", actionIcon: "external"},
        ],
      },
      {
        id: "documents",
        title: t('importantDocuments', { en: 'Important Documents', hi: 'महत्वपूर्ण दस्तावेज़' }),
        icon: <FileText className="w-5 h-5" />,
        items: [
          { title: t('contractTemplates', { en: 'Contract Templates', hi: 'अनुबंध टेम्प्लेट' }), type: "PDF", link:"https://drive.google.com/file/d/1QmaDpGrm9OjaQqV0XN-lP_VHIp_gvAd7/view?usp=sharing" , actionIcon: "external"},
          { title: t('legalComplianceGuide', { en: 'Legal Compliance Guide', hi: 'कानूनी अनुपालन गाइड' }), type: "PDF", link:"https://drive.google.com/file/d/1cgiXRCja-6NmBe-fPDSX4sLSdCT83iLj/view?usp=sharing" , actionIcon: "external"},
          { title: t('contractorResponsibilities', { en: 'Contractor Responsibilities', hi: 'ठेकेदार जिम्मेदारियां' }), type: "PDF", link:"https://drive.google.com/file/d/1DMxU9ghwVsDWVMJdl3AP7Ym8CNEIJ4Ls/view?usp=sharing" , actionIcon: "external"},
          { title: t('disputeResolutionProcess', { en: 'Dispute Resolution Process', hi: 'विवाद समाधान प्रक्रिया' }), type: "PDF", new: true , link:"https://drive.google.com/file/d/1qffZqtZNO5rq-XIm19cW-au_lC34ikyY/view?usp=sharing", actionIcon: "external"},
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
                      {item.icon || getIconForType(item.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.new && <Badge variant="outline" className="ml-2 bg-secondary/20">{t('new', { en: 'New', hi: 'नया' })}</Badge>}
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={item.link || "#"} target="_blank" rel="noopener noreferrer">
                        {item.actionIcon === "external" ? <ExternalLink className="w-4 h-4" /> : (item.type === "PDF" || item.type === "Video" ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />)}
                      </a>
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
