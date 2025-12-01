"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, CheckCircle } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function DocumentsTab({ profile, currentUser, username }) {
  const { t } = useTranslate()

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <CardTitle className="flex items-center text-green-800">
          <Shield className="w-5 h-5 mr-2" />
          {t('verificationDocuments', { en: 'Verification Documents', hi: 'सत्यापन दस्तावेज़' })}
        </CardTitle>
        <CardDescription>
          {t('viewManageDocuments', { en: 'View and manage your verification documents', hi: 'अपने सत्यापन दस्तावेज़ों को देखें और प्रबंधित करें' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile?.data.aadhar_image ? (
            <Card className="border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
              <CardHeader className="bg-blue-50 p-4">
                <CardTitle className="text-lg flex items-center text-blue-800">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  {t('aadharCard', { en: 'Aadhar Card', hi: 'आधार कार्ड' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-video relative rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={profile.data.aadhar_image || "/placeholder.svg"}
                    alt="Aadhar Card"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t('verified', { en: 'Verified', hi: 'सत्यापित' })}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50 p-4">
                <CardTitle className="text-lg flex items-center text-gray-700">
                  <FileText className="w-5 h-5 mr-2 text-gray-500" />
                  Aadhar Card
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">
                  {t('noAadharUploaded', { en: 'No Aadhar card uploaded', hi: 'कोई आधार कार्ड अपलोड नहीं किया गया' })}
                </p>
                {currentUser === username && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Shield className="w-4 h-4 mr-2" />
                    {t('uploadDocument', { en: 'Upload Document', hi: 'दस्तावेज़़ अपलोड करें' })}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {profile?.data.screenshot ? (
            <Card className="border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
              <CardHeader className="bg-purple-50 p-4">
                <CardTitle className="text-lg flex items-center text-purple-800">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  {t('screenshot', { en: 'Screenshot', hi: 'स्क्रीनशॉट' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-video relative rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={profile.data.screenshot || "/placeholder.svg"}
                    alt="Screenshot"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50 p-4">
                <CardTitle className="text-lg flex items-center text-gray-700">
                  <FileText className="w-5 h-5 mr-2 text-gray-500" />
                  Screenshot
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">
                  {t('noScreenshotUploaded', { en: 'No screenshot uploaded', hi: 'कोई स्क्रीनशॉट अपलोड नहीं किया गया' })}
                </p>
                {currentUser === username && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
