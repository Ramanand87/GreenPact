"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Shield, FileText, CreditCard, Crop } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function ProfileTabs({ username, currentUser, profileRole }) {
  const { t } = useTranslate()

  return (
    <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
      {username === currentUser ? (
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
          >
            <Star className="w-4 h-4 mr-2" />
            {t('reviews', { en: 'Reviews', hi: 'समीक्षाएं' })}
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
          >
            <Shield className="w-4 h-4 mr-2" />
            {t('documents', { en: 'Documents', hi: 'दस्तावेज़' })}
          </TabsTrigger>
          <TabsTrigger
            value="contracts"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
          >
            <FileText className="w-4 h-4 mr-2" />
            {t('contracts', { en: 'Contracts', hi: 'अनुबंध' })}
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {t('payments', { en: 'Payments', hi: 'भुगतान' })}
          </TabsTrigger>
        </TabsList>
      ) : (
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
          >
            <Star className="w-4 h-4 mr-2" />
            {t('reviews', { en: 'Reviews', hi: 'समीक्षाएं' })}
          </TabsTrigger>

          {profileRole === "farmer" ? (
            <TabsTrigger
              value="Crops"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
            >
              <Crop className="w-4 h-4 mr-2" />
              {t('crops', { en: 'Crops', hi: 'फसलें' })}
            </TabsTrigger>
          ) : (
            <TabsTrigger
              value="Demands"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
            >
              <Crop className="w-4 h-4 mr-2" />
              {t('demands', { en: 'Demands', hi: 'मांगें' })}
            </TabsTrigger>
          )}
        </TabsList>
      )}
    </div>
  )
}
