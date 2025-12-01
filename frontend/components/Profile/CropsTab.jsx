"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, User } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"
import { getTranslatedCropName } from "@/lib/cropTranslations"

export function CropsTab({ crops, language }) {
  const { t } = useTranslate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {crops.map((crop) => (
        <Link key={crop.crop_id} href={`/crop/${crop?.crop_id}`}>
          <Card
            className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg flex flex-col h-full bg-white cursor-pointer rounded-2xl"
          >
            {/* Image with overlay pricing */}
            <div className="relative overflow-hidden rounded-t-2xl">
              <div className="relative w-full h-56">
                <img
                  src={crop.crop_image}
                  alt={crop.crop_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Price and quantity overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <p className="text-white/80 text-xs font-medium mb-1">Price per kg</p>
                    <p className="text-white text-3xl font-bold drop-shadow-lg">₹{crop.crop_price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs font-medium mb-1">Available</p>
                    <p className="text-white text-2xl font-bold drop-shadow-lg">{crop.quantity} kg</p>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 flex-grow">
              <div className="space-y-4">
                {/* Crop name */}
                <h3 className="text-2xl font-bold text-gray-900">
                  {getTranslatedCropName(crop.crop_name, language)}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Location</p>
                    <p className="text-sm font-bold text-gray-900">{crop.location}</p>
                  </div>
                </div>

                {/* Harvested time */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Harvested</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(crop.harvested_time).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Publisher info */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                    {crop.publisher_profile?.image ? (
                      <img 
                        src={crop.publisher_profile.image} 
                        alt={crop.publisher_profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Farmer</p>
                    <p className="text-sm font-bold text-gray-900">
                      {crop.publisher_profile?.name || crop.publisher?.username}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
