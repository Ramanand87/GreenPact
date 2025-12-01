"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function LoadingState() {
  const { t } = useTranslate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-green-800 font-medium">
          {t('loadingProfile', { en: 'Loading profile...', hi: 'प्रोफ़ाइल लोड हो रही है...' })}
        </p>
      </div>
    </div>
  )
}

export function ErrorState({ router }) {
  const { t } = useTranslate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          {t('profileNotFound', { en: 'Profile Not Found', hi: 'प्रोफ़ाइल नहीं मिला' })}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('profileNotFoundDesc', { en: 'We couldn\'t find the profile you\'re looking for.', hi: 'हम आपके द्वारा खोजी जा रही प्रोफ़ाइल नहीं पा सके।' })}
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-red-600 hover:bg-red-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('goBack', { en: 'Go Back', hi: 'वापस जाएं' })}
        </Button>
      </div>
    </div>
  )
}
