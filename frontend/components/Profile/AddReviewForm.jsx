"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ImageIcon, Trash2, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslate } from "@/lib/LanguageContext"

export function AddReviewForm({ 
  profileName,
  rating, 
  setRating, 
  description, 
  setDescription,
  images,
  setImages,
  handleImageChange,
  handleRatingSubmit,
  handleRemoveImage,
  isSubmitting
}) {
  const { t } = useTranslate()

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <CardTitle className="text-green-800">
          {t('writeReview', { en: 'Write a Review', hi: 'समीक्षा लिखें' })}
        </CardTitle>
        <CardDescription>
          {t('shareExperience', { en: 'Share your experience with', hi: 'के साथ अपना अनुभव साझा करें' })} {profileName}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('yourRating', { en: 'Your Rating', hi: 'आपकी रेटिंग' })}
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TooltipProvider key={star}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setRating(star)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "fill-yellow-400 stroke-yellow-400"
                              : "stroke-gray-300"
                          } transition-colors`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {star === 1 && t('poor', { en: 'Poor', hi: 'खराब' })}
                      {star === 2 && t('fair', { en: 'Fair', hi: 'ठीक' })}
                      {star === 3 && t('average', { en: 'Average', hi: 'सामान्य' })}
                      {star === 4 && t('good', { en: 'Good', hi: 'अच्छा' })}
                      {star === 5 && t('excellent', { en: 'Excellent', hi: 'उत्कृष्ट' })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('yourReview', { en: 'Your Review', hi: 'आपकी समीक्षा' })}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('shareDetails', { en: 'Share details of your experience with this person...', hi: 'इस व्यक्ति के साथ अपने अनुभव का विवरण साझा करें...' })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('addPhotoOptional', { en: 'Add Photos (Optional)', hi: 'फ़ोटो जोड़ें (वैकल्पिक)' })}
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 text-center px-2">
                  {t('addImages', { en: 'Add Images', hi: 'चित्र जोड़ें' })}
                </span>
              </label>
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {images.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {images.length} {images.length === 1 ? t('imageSelected', { en: 'image selected', hi: 'चित्र चयनित' }) : t('imagesSelected', { en: 'images selected', hi: 'चित्र चयनित' })}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
        <Button
          className="ml-auto bg-green-600 hover:bg-green-700"
          onClick={handleRatingSubmit}
          disabled={rating === 0 || !description.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('submitting', { en: 'Submitting...', hi: 'सबमिट हो रहा है...' })}
            </>
          ) : (
            <>
              <Star className="w-4 h-4 mr-2" />
              {t('submitReview', { en: 'Submit Review', hi: 'समीक्षा जमा करें' })}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
