"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, PhoneIcon, Edit, MessageSquare, Crop, Star } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function ProfileHeader({ 
  profile, 
  ratings, 
  currentUser, 
  username, 
  userRole,
  calculateAverageRating,
  handleEditClick,
  handleChatClick,
  router
}) {
  const { t } = useTranslate()

  return (
    <div className="bg-white shadow-md mb-8">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="rounded-full p-1 bg-gradient-to-r from-green-400 to-green-600">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage
                  src={profile?.data.image || "/profile.jpg"}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-green-100 text-green-800 text-4xl">
                  {profile?.data.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            {currentUser === username && (
              <Button
                variant="outline"
                size="sm"
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white shadow-md hover:bg-green-50"
                onClick={handleEditClick}
              >
                <Camera className="w-4 h-4 mr-2" />
                {t('change', { en: 'Change', hi: 'बदलें' })}
              </Button>
            )}

            {ratings?.data && ratings.data.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-white">
                <div className="flex items-center">
                  <span className="font-bold text-xs">
                    {calculateAverageRating()}
                  </span>
                  <Star className="w-3 h-3 ml-0.5 fill-yellow-900" />
                </div>
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-1">
                  {profile?.data.name || "N/A"}
                </h1>
                <p className="text-gray-600 mb-2">
                  @{profile?.data?.user.username}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex items-center text-gray-700">
                    <PhoneIcon className="w-4 h-4 mr-2 text-green-600" />
                    <span>+91 {profile?.data.phoneno || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    <span>{profile?.data.address || "N/A"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 justify-start mt-4 md:mt-0">
                  {profile.role && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                      {profile.role === "farmer" ? t('farmer', { en: 'Farmer', hi: 'किसान' }) : t('contractor', { en: 'Contractor', hi: 'ठेकेदार' })}
                    </Badge>
                  )}
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
                    {t('verified', { en: 'Verified', hi: 'सत्यापित' })}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
              {currentUser === username && (
                <Button
                  className="bg-green-600 hover:bg-green-700 shadow-sm"
                  onClick={handleEditClick}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('editProfile', { en: 'Edit Profile', hi: 'प्रोफ़ाइल संपादित करें' })}
                </Button>
              )}
              {currentUser === username && (
                userRole === "farmer" ? (
                  <Button
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={() => router.push(`/your-crops/${currentUser}`)}
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    {t('yourCrops', { en: 'Your Crops', hi: 'आपकी फसलें' })}
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={() => router.push(`/crop-demand/${currentUser}`)}
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    {t('yourDemands', { en: 'Your Demands', hi: 'आपकी मांगें' })}
                  </Button>
                ))}
              {currentUser !== username && (
                <Button
                  onClick={handleChatClick}
                  className="bg-green-600 hover:bg-green-700 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('chat', { en: 'Chat', hi: 'चैट' })}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
