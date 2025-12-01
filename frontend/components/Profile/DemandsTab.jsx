"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, User, Wheat } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"
import { getTranslatedCropName } from "@/lib/cropTranslations"

export function DemandsTab({ demands, language, router }) {
  const { t } = useTranslate()

  if (!demands || demands.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-600 mb-4">
          {t('noCropDemands', { en: 'No crop demands available yet.', hi: 'अभी तक कोई फसल मांग उपलब्ध नहीं।' })}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {demands?.data?.map((demand) => (
        <Card
          key={demand.id}
          onClick={() => router.push(`/demand/${demand.demand_id}`)}
          className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg flex flex-col h-full bg-white cursor-pointer rounded-2xl"
        >
          {/* Gradient header with decorative elements */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className="relative w-full h-56 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
              {/* Decorative circles */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -ml-20 -mb-20" />
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/30 rounded-full -ml-12 -mt-12" />
              </div>
              
              {/* Wheat icon background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Wheat className="h-32 w-32 text-white/40 transform rotate-12" />
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Price and quantity overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <p className="text-white/80 text-xs font-medium mb-1">Offering Price</p>
                  <p className="text-white text-3xl font-bold drop-shadow-lg">₹{demand.crop_price}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-xs font-medium mb-1">Needed</p>
                  <p className="text-white text-2xl font-bold drop-shadow-lg">{demand.quantity} kg</p>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 flex-grow">
            <div className="space-y-4">
              {/* Crop name */}
              <h3 className="text-2xl font-bold text-gray-900">
                {getTranslatedCropName(demand.crop_name, language)}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-sm font-bold text-gray-900">{demand.location}</p>
                </div>
              </div>

              {/* Required time */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Required By</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(demand.harvested_time).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Buyer info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                  {demand.contractor_profile?.image ? (
                    <img 
                      src={demand.contractor_profile.image} 
                      alt={demand.contractor_profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Buyer</p>
                  <p className="text-sm font-bold text-gray-900">
                    {demand.contractor_profile?.name || demand.demand_user?.username}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
