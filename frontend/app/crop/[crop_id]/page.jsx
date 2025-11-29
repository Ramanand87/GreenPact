"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetMarketPriceQuery } from "@/redux/Service/cropApi";
import { useGetSingleCropQuery } from "@/redux/Service/marketApi";
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Package, 
  User, 
  Phone, 
  Mail,
  TrendingUp,
  Star,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useTranslate } from "@/lib/LanguageContext";
import { getTranslatedCropName } from "@/lib/cropTranslations";
import { m } from "framer-motion";

export default function CropDetailsPage() {
  const { t, language } = useTranslate();
  const router = useRouter();
  const { crop_id } = useParams();
  const { data: crop, error, isLoading } = useGetSingleCropQuery(crop_id);
  const { data: marketCrops } = useGetMarketPriceQuery(crop?.data.crop_name);

  const marketPrice = marketCrops?.results?.[0]?.modal_price;
  console.log("Market Price Data:", marketCrops);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userRole = userInfo?.role;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading', { en: 'Loading...', hi: 'लोड हो रहा है...' })}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{t('errorLoadingCrop', { en: 'Error loading crop data.', hi: 'फसल डेटा लोड करने में त्रुटि।' })}</p>
        </div>
      </div>
    );
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
            {t('backToMarket', { en: 'Back to Market', hi: 'बाज़ार पर वापस जाएं' })}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Gallery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative w-full aspect-square lg:aspect-video lg:h-[500px] bg-gray-100">
                <img
                  src={crop?.data.crop_image}
                  alt={crop?.data.crop_name}
                  className="w-full h-full object-cover"
                />
                {/* Verified Badge */}
                {crop?.data.publisher_profile?.is_verfied && (
                  <div className="absolute top-4 left-4">
                    <Badge className="flex items-center gap-1 bg-orange-500 text-white border-0 shadow-lg px-3 py-1">
                      <Star className="h-4 w-4 fill-white" />
                      Verified Seller
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Description Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Product Details
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {crop?.data.Description || 'Fresh and high-quality produce directly from the farm. Organically grown with proper care and harvested at the perfect time to ensure maximum freshness and nutrition.'}
                </p>

                {marketPrice && (
                  <>
                    <Separator className="my-6" />
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-gray-900">Market Price Reference</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-700">₹{marketPrice}/Quintal</p>
                      <p className="text-sm text-gray-600 mt-1">Current market rate for comparison</p>
                    </div>
                  </>
                )}
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
                    {getTranslatedCropName(crop?.data.crop_name, language)}
                  </h1>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-green-600">₹{crop?.data.crop_price}</span>
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
                      <p className="text-xs text-gray-500 mb-1">Available Quantity</p>
                      <p className="text-lg font-bold text-gray-900">{crop?.data.quantity} kg</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{crop?.data.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Harvested On</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(crop?.data.harvested_time).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Seller Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Seller Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Name</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {crop?.data.publisher_profile?.name || crop?.data.publisher?.username}
                      </span>
                    </div>
                    {crop?.data.publisher_profile?.phoneno && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {crop?.data.publisher_profile?.phoneno}
                        </span>
                      </div>
                    )}
                    {crop?.data.publisher?.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {crop?.data.publisher?.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  {userRole === "contractor" && (
                    <Link href={`/create-contract/${crop?.data.crop_id}`} className="block">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {t('createContract', { en: 'Create Contract', hi: 'अनुबंध बनाएं' })}
                      </Button>
                    </Link>
                  )}
                  <Link href={`/profile/${crop?.data.publisher.username}`} className="block">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 text-base font-semibold border-2 hover:bg-gray-50"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      {t('contactSeller', { en: 'Contact Seller', hi: 'विक्रेता से संपर्क करें' })}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
