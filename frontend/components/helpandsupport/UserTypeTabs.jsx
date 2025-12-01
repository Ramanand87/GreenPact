"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TractorIcon as Farmer, Factory } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"
import { ResourceCard } from "./ResourceCard"

export function UserTypeTabs({ activeTab, onTabChange }) {
  const { t } = useTranslate()

  return (
    <Tabs defaultValue="farmer" className="w-full" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2 h-auto bg-accent/20 p-1 border-2 border-primary/20">
        <TabsTrigger
          value="farmer"
          className="py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <div className="flex flex-col items-center space-y-2">
            <Farmer className="w-8 h-8" />
            <span className="text-lg">{t('forFarmers', { en: 'For Farmers', hi: 'किसानों के लिए' })}</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="contractor"
          className="py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <div className="flex flex-col items-center space-y-2">
            <Factory className="w-8 h-8" />
            <span className="text-lg">{t('forContractors', { en: 'For Contractors', hi: 'ठेकेदारों के लिए' })}</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="farmer">
        <ResourceCard userType="farmer" />
      </TabsContent>

      <TabsContent value="contractor">
        <ResourceCard userType="contractor" />
      </TabsContent>
    </Tabs>
  )
}
