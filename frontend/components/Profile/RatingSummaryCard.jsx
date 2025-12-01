"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function RatingSummaryCard({ ratings, calculateAverageRating, countRatingsByValue, calculateRatingPercentage }) {
  const { t } = useTranslate()

  return (
    <Card className="lg:col-span-1 border-0 shadow-md overflow-hidden h-fit">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <CardTitle className="flex items-center text-green-800">
          <Star className="w-5 h-5 mr-2 fill-yellow-400 stroke-yellow-500" />
          {t('ratingSummary', { en: 'Rating Summary', hi: 'रेटिंग सारांश' })}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {ratings?.data && ratings.data.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-800">
                  {calculateAverageRating()}
                </div>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(calculateAverageRating())
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "fill-gray-200 stroke-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-500 mt-2">
                  {ratings.data.length} {t('reviewsCount', { en: 'reviews', hi: 'समीक्षाएं' })}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((value) => (
                <div key={value} className="flex items-center gap-2">
                  <div className="w-8 text-right">{value}</div>
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  <div className="flex-1">
                    <Progress
                      value={calculateRatingPercentage(value)}
                      className="h-2"
                    />
                  </div>
                  <div className="w-8 text-gray-500 text-sm">
                    {countRatingsByValue(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Star className="w-12 h-12 mx-auto stroke-gray-300 mb-2" />
            <p className="text-gray-500">{t('noRatingsYet', { en: 'No ratings yet', hi: 'अभी कोई रेटिंग नहीं' })}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
