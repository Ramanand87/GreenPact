"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useGetMarketPriceQuery } from "@/redux/Service/cropApi";
import { useGetSingleCropQuery } from "@/redux/Service/marketApi";
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function CropDetailsPage() {
  const router = useRouter();
  const { crop_id } = useParams();
  const { data: crop, error, isLoading } = useGetSingleCropQuery(crop_id);
  const { data: marketCrops } = useGetMarketPriceQuery(crop?.data.crop_name);

  const marketPrice = marketCrops?.results?.[0]?.modal_price;
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userRole = userInfo?.role;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading crop data.</p>;

  return (
    <div className="container mx-auto px-4 py-2">
      <Button variant="ghost" className="mb-2" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Market
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
          <CardTitle className="text-3xl">{crop?.data.crop_name}</CardTitle>
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">₹{crop?.data.crop_price}/kg</p>
            <p className="text-sm text-gray-600">Quantity: {crop?.data.quantity}</p>
            <p className="text-sm text-gray-600">Seller: {crop?.data.publisher_profile.name}</p>
          </div>
          <p className="text-gray-700">{crop?.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {marketPrice && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Market Price</p>
                <p className="font-semibold">{marketPrice}/Quintal </p>
              </div>
            )}
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">{crop?.data.location}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Harvested Time</p>
              <p className="font-semibold">{crop?.data.harvested_time}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-4">
          {userRole === "contractor" && (
            <Link href={`/create-contract/${crop?.data.crop_id}`} className="flex-1">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Create Contract
              </Button>
            </Link>
          )}
          <Link
            href={`/profile/${crop?.data.publisher.username}`}
            className={`${userRole === "contractor" ? "" : "flex w-full"}`}
          >
            <Button variant="outline" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Seller
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
