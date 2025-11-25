"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useGetMarketPriceQuery } from "@/redux/Service/cropApi";
import { useGetSingleCropQuery } from "@/redux/Service/marketApi";
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useTranslate } from "@/lib/LanguageContext";
import { getTranslatedCropName } from "@/lib/cropTranslations";

export default function CropDetailsPage() {
  const { t, language } = useTranslate();
  const router = useRouter();
  const { crop_id } = useParams();
  const { data: crop, error, isLoading } = useGetSingleCropQuery(crop_id);
  const { data: marketCrops } = useGetMarketPriceQuery(crop?.data.crop_name);

  const marketPrice = marketCrops?.results?.[0]?.modal_price;
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userRole = userInfo?.role;

  if (isLoading) return <p>{t('loading', { en: 'Loading...', hi: 'लोड हो रहा है...' })}</p>;
  if (error) return <p>{t('errorLoadingCrop', { en: 'Error loading crop data.', hi: 'फसल डेटा लोड करने में त्रुटि।' })}</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
      <Button variant="ghost" className="mb-2" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('backToMarket', { en: 'Back to Market', hi: 'बाज़ार पर वापस जाएं' })}
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <img
            src={crop?.data.crop_image}
            alt={crop?.data.crop_name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <CardTitle className="text-3xl">{getTranslatedCropName(crop?.data.crop_name, language)}</CardTitle>
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">₹{crop?.data.crop_price}/kg</p>
            <p className="text-sm text-gray-600">{t('quantity', { en: 'Quantity', hi: 'मात्रा' })}: {crop?.data.quantity}</p>
            <p className="text-sm text-gray-600">{t('seller', { en: 'Seller', hi: 'विक्रेता' })}: {crop?.data.publisher_profile.name}</p>
          </div>
          <p className="text-gray-700">{crop?.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {marketPrice && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{t('marketPrice', { en: 'Market Price', hi: 'बाज़ार मूल्य' })}</p>
                <p className="font-semibold">{marketPrice}/Quintal </p>
              </div>
            )}
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{t('location', { en: 'Location', hi: 'स्थान' })}</p>
              <p className="font-semibold">{crop?.data.location}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{t('harvestedTime', { en: 'Harvested Time', hi: 'कटाई का समय' })}</p>
              <p className="font-semibold">{crop?.data.harvested_time}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-4">
          {userRole === "contractor" && (
            <Link href={`/create-contract/${crop?.data.crop_id}`} className="flex-1">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('createContract', { en: 'Create Contract', hi: 'अनुबंध बनाएं' })}
              </Button>
            </Link>
          )}
          <Link
            href={`/profile/${crop?.data.publisher.username}`}
            className={`${userRole === "contractor" ? "" : "flex w-full"}`}
          >
            <Button variant="outline" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              {t('contactSeller', { en: 'Contact Seller', hi: 'विक्रेता से संपर्क करें' })}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
