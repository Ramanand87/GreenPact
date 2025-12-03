"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Added AvatarImage
import { Button } from "@/components/ui/button"
import { Star, Edit, Trash2 } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"
import Link from "next/link" // Added Link for navigation

export function ReviewsList({ 
  ratings, 
  userInfo,
  onEditClick,
  handleDeleteRating
}) {
  const { t } = useTranslate()

  if (!ratings?.data || ratings.data.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-8 text-center">
          <Star className="w-12 h-12 mx-auto stroke-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {t('noReviewsYet', { en: 'No Reviews Yet', hi: 'अभी कोई समीक्षा नहीं' })}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {t('noReviewsDesc', { en: 'This user hasn\'t received any reviews yet. Be the first to share your experience!', hi: 'इस उपयोगकर्ता को अभी तक कोई समीक्षा नहीं मिली है। अपना अनुभव साझा करने वाले पहले व्यक्ति बनें!' })}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {ratings.data.map((ratingItem, index) => (
        <Card
          key={index}
          className="border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              
              {/* Clickable Avatar */}
              <Link href={`/profile/${ratingItem.rating_user}`}>
                <Avatar className="w-10 h-10 border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                  {/* Bind the image from API */}
                  <AvatarImage 
                    src={ratingItem.rating_user_image} 
                    alt={ratingItem.rating_user} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {ratingItem.rating_user?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    {/* Clickable Username */}
                    <Link href={`/profile/${ratingItem.rating_user}`} className="hover:underline">
                        <h3 className="font-semibold text-gray-800 cursor-pointer">
                        {ratingItem.rating_user}
                        </h3>
                    </Link>
                    
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= ratingItem.rate
                              ? "fill-yellow-400 stroke-yellow-400"
                              : "fill-gray-200 stroke-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {userInfo?.data.username === ratingItem.rating_user && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onEditClick(ratingItem)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteRating(ratingItem.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-gray-700">
                  <p>{ratingItem.description}</p>
                </div>

                {ratingItem.rating_images && ratingItem.rating_images.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ratingItem.rating_images.map((imgData, idx) => (
                        <img
                          key={idx}
                          src={imgData.image || "/placeholder.svg"}
                          alt={`Rating Image ${idx + 1}`}
                          className="rounded-lg w-full h-40 object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(imgData.image, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}