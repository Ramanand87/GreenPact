"use client"

import { useRouter, useParams } from "next/navigation"
import { useGetSingleDemandQuery } from "@/redux/Service/demandApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Phone, ArrowLeft, Calendar, MapPin, Package, DollarSign, Clock, User, Shield, Star, Wheat } from 'lucide-react'
import Link from "next/link"
import { useTranslate } from "@/lib/LanguageContext"
import { getTranslatedCropName } from "@/lib/cropTranslations"

export default function DemandCropDetailsPage() {
  const { t, language } = useTranslate();
  const router = useRouter()
  const { crop_id } = useParams()
  const { data: demandDetail, isLoading, isError } = useGetSingleDemandQuery(crop_id)
  const demandDetails = demandDetail?.data

  // Generate professional gradient colors based on crop name
  const getGradientForCrop = (cropName) => {
    if (!cropName) return 'from-emerald-500 via-teal-500 to-cyan-600'
    
    const gradients = [
      'from-emerald-500 via-teal-500 to-cyan-600',
      'from-blue-500 via-indigo-500 to-purple-600',
      'from-pink-500 via-rose-500 to-red-600',
      'from-orange-500 via-amber-500 to-yellow-600',
      'from-green-500 via-lime-500 to-emerald-600',
      'from-violet-500 via-purple-500 to-fuchsia-600',
      'from-cyan-500 via-sky-500 to-blue-600',
      'from-rose-500 via-pink-500 to-purple-600',
      'from-amber-500 via-orange-500 to-red-600',
      'from-teal-500 via-emerald-500 to-green-600',
    ]
    
    const index = cropName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length
    return gradients[index]
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">{t('loadingCropDetails', { en: 'Loading crop details...', hi: 'फसल विवरण लोड हो रहा है...' })}</p>
      </div>
    )
  }

  if (isError || !demandDetails) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('demandNotFound', { en: 'Demand Not Found', hi: 'मांग नहीं मिली' })}</h2>
          <p className="text-gray-600 mb-6">{t('demandNotFoundDesc', { en: "The crop demand you're looking for doesn't exist or has been removed.", hi: 'जिस फसल मांग की आप तलाश कर रहे हैं वह मौजूद नहीं है या हटा दी गई है।' })}</p>
          <Button onClick={() => router.back()} className="bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('goBack', { en: 'Go Back', hi: 'वापस जाएं' })}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToDemands', { en: 'Back to Demands', hi: 'मांगों पर वापस जाएं' })}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gradient Banner & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gradient Banner Card with 3D Effects */}
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="relative w-full aspect-square lg:aspect-video lg:h-[500px] bg-gradient-to-br from-green-400 via-green-500 to-green-700  overflow-hidden">
                {/* 3D Mesh Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.1) 41px),
                                      repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.1) 41px)`,
                    transform: 'perspective(500px) rotateX(60deg)',
                    transformOrigin: 'center center'
                  }}></div>
                </div>
                
                {/* Floating 3D Geometric Shapes */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Large floating sphere - top right */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm shadow-2xl animate-float" style={{
                    animation: 'float 6s ease-in-out infinite',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 -10px 30px rgba(255,255,255,0.2)'
                  }}></div>
                  
                  {/* Medium cube - bottom left */}
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/15 backdrop-blur-sm shadow-2xl animate-float-delayed" style={{
                    animation: 'float 8s ease-in-out infinite 2s',
                    transform: 'rotate(45deg)',
                    borderRadius: '20%',
                    boxShadow: '0 25px 70px rgba(0,0,0,0.4), inset 5px 5px 20px rgba(255,255,255,0.2)'
                  }}></div>
                  
                  {/* Small sphere - center left */}
                  <div className="absolute top-1/3 left-10 w-32 h-32 rounded-full bg-white/25 backdrop-blur-md shadow-xl animate-float" style={{
                    animation: 'float 7s ease-in-out infinite 1s',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.3), inset 0 -8px 25px rgba(255,255,255,0.3)'
                  }}></div>
                  
                  {/* Hexagon - top center */}
                  <div className="absolute top-20 right-1/4 w-40 h-40 bg-white/20 backdrop-blur-sm shadow-2xl animate-spin-slow" style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    animation: 'spin-slow 20s linear infinite',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                  }}></div>
                  
                  {/* Glass ring - bottom right */}
                  <div className="absolute bottom-1/4 right-16 w-36 h-36 rounded-full border-8 border-white/30 backdrop-blur-sm shadow-xl animate-pulse-slow" style={{
                    animation: 'pulse-slow 4s ease-in-out infinite',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.2)'
                  }}></div>
                </div>
                
                {/* Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5"></div>
                
                {/* Verified Badge */}
                {demandDetails.contractor_profile?.user?.is_verified && (
                  <div className="absolute top-6 left-6 z-10">
                    <Badge className="flex items-center gap-1.5 bg-orange-500 text-white border-0 shadow-2xl px-4 py-2 backdrop-blur-sm" style={{
                      boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4)'
                    }}>
                      <Star className="h-4 w-4 fill-white" />
                      <span className="font-semibold">Verified Buyer</span>
                    </Badge>
                  </div>
                )}

                {/* 3D Elevated Glass Card with Crop Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center p-8 perspective-1000" style={{ perspective: '1000px' }}>
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-10 py-8 border-2 border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-500" style={{
                      boxShadow: '0 25px 80px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(0,0,0,0.1)',
                      transform: 'translateZ(50px)',
                      backdropFilter: 'blur(20px)'
                    }}>
                      <div className="mb-4">
                        <Wheat className="h-16 w-16 text-white mx-auto drop-shadow-2xl opacity-95" strokeWidth={1.5} />
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-2xl tracking-tight">
                        {getTranslatedCropName(demandDetails.crop_name, language)}
                      </h2>
                      <div className="h-1.5 w-24 bg-white/70 rounded-full mx-auto shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Light rays effect */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-white/50 to-transparent transform -skew-x-12"></div>
                  <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-white/30 to-transparent transform -skew-x-12"></div>
                  <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-white/40 to-transparent transform -skew-x-12"></div>
                </div>
              </div>
            </Card>

            {/* Add custom animations to global styles */}
            <style jsx global>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(-20px) translateX(10px); }
              }
              @keyframes float-delayed {
                0%, 100% { transform: translateY(0px) translateX(0px) rotate(45deg); }
                50% { transform: translateY(-25px) translateX(-15px) rotate(45deg); }
              }
              @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes pulse-slow {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
              }
            `}</style>

            {/* Description Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Demand Details
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {demandDetails.description || 'Looking for fresh and high-quality produce. Interested in purchasing directly from farmers at competitive market rates. Please contact for bulk orders and delivery arrangements.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {/* Main Info Card */}
            <Card className="border-0 shadow-lg sticky top-24">
              <CardContent className="p-6">
                {/* Title & Price */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {getTranslatedCropName(demandDetails.crop_name, language)}
                  </h1>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-green-600">₹{demandDetails.crop_price}</span>
                    <span className="text-lg text-gray-600">per kg</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Key Info Grid */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Required Quantity</p>
                      <p className="text-lg font-bold text-gray-900">{demandDetails.quantity} kg</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{demandDetails.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Required By</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(demandDetails.harvested_time).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Buyer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Buyer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Name</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {demandDetails.contractor_profile?.user?.username || 'Anonymous'}
                      </span>
                    </div>
                    {demandDetails.contact_no && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {demandDetails.contact_no}
                        </span>
                      </div>
                    )}
                    {demandDetails.contractor_profile?.user?.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {demandDetails.contractor_profile.user.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  {demandDetails.contractor_profile?.user?.username && (
                    <Link href={`/profile/${demandDetails.contractor_profile.user.username}`} className="block">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        {t('contactBuyer', { en: 'Contact Buyer', hi: 'खरीदार से संपर्क करें' })}
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base font-semibold border-2 hover:bg-gray-50"
                    onClick={() => window.location.href = `tel:${demandDetails.contact_no}`}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {t('callNow', { en: 'Call Now', hi: 'अभी कॉल करें' })}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
