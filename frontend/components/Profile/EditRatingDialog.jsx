"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, ImageIcon, Trash2, Loader2 } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function EditRatingDialog({
  isOpen,
  onClose,
  ratingItem,
  rating,
  setRating,
  description,
  setDescription,
  images,
  handleImageChange,
  handleRemoveImage,
  handleDeleteRatingImage,
  handleUpdateRating,
  isUpdating
}) {
  const { t } = useTranslate()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-green-800">
            {t('editReview', { en: 'Edit Review', hi: 'समीक्षा संपादित करें' })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('yourRating', { en: 'Your Rating', hi: 'आपकी रेटिंग' })}
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-yellow-400 stroke-yellow-400"
                        : "stroke-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('updateDescription', { en: 'Update Description', hi: 'विवरण अपडेट करें' })}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows="4"
              placeholder={t('shareDetails', { en: 'Share details of your experience...', hi: 'अपने अनुभव का विवरण साझा करें...' })}
            />
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t('updateImageOptional', { en: 'Update Images (Optional)', hi: 'चित्र अपडेट करें (वैकल्पिक)' })}
            </label>
            
            {/* Existing Images from Database */}
            {ratingItem?.rating_images && ratingItem.rating_images.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">
                  {t('existingImages', { en: 'Existing Images', hi: 'मौजूदा चित्र' })}
                </p>
                <div className="flex flex-wrap gap-3">
                  {ratingItem.rating_images.map((imageObj) => (
                    <div key={imageObj.id} className="relative group">
                      <img
                        src={imageObj.image}
                        alt="Rating"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-green-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteRatingImage(imageObj.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                        title={t('deleteImage', { en: 'Delete Image', hi: 'चित्र हटाएं' })}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 font-medium">
                {t('addNewImages', { en: 'Add New Images', hi: 'नए चित्र जोड़ें' })}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                </label>
                {images.map((image, index) => {
                  if (image instanceof File) {
                    return (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-green-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              {images.filter(img => img instanceof File).length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  {images.filter(img => img instanceof File).length} {t('newImagesSelected', { en: 'new images selected', hi: 'नए चित्र चयनित' })}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
            className="border-gray-300"
          >
            {t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleUpdateRating(ratingItem.id)}
            disabled={isUpdating || rating === 0 || !description.trim()}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('updating', { en: 'Updating...', hi: 'अपडेट हो रहा है...' })}
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                {t('updateReview', { en: 'Update Review', hi: 'समीक्षा अपडेट करें' })}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
