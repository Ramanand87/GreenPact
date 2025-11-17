"use client"

import { useRouter, useParams } from "next/navigation"
import { useGetSingleDemandQuery } from "@/redux/Service/demandApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Phone, ArrowLeft, Calendar, MapPin, Package, DollarSign, Clock, User } from 'lucide-react'
import Link from "next/link"

export default function DemandCropDetailsPage() {
  const router = useRouter()
  const { crop_id } = useParams()
  const { data: demandDetail, isLoading, isError } = useGetSingleDemandQuery(crop_id)
  const demandDetails = demandDetail?.data

  // Function to generate a color based on crop name
  const generateColor = (name) => {
    if (!name) return "from-emerald-400 to-green-600"
    
    const colors = [
      "from-emerald-400 to-green-600",
      "from-amber-400 to-orange-600",
      "from-rose-400 to-red-600",
      "from-yellow-300 to-amber-500",
      "from-sky-400 to-blue-600",
      "from-violet-400 to-purple-600",
    ]
    
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Loading crop details...</p>
      </div>
    )
  }

  if (isError || !demandDetails) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Demand Not Found</h2>
          <p className="text-gray-600 mb-6">The crop demand you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()} className="bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mr-4 hover:bg-green-50 hover:text-green-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Demands
        </Button>
        <Separator orientation="vertical" className="h-8 mx-2" />
        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100">
          Crop Demand
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Hero Image/Banner */}
        <div className="lg:col-span-2">
          <div
            className={`w-full h-80 sm:h-96 rounded-xl flex items-center justify-center bg-gradient-to-br ${generateColor(demandDetails.crop_name)} text-white shadow-lg overflow-hidden`}
          >
            <div className="text-center p-8 backdrop-blur-[2px] backdrop-brightness-90 w-full h-full flex flex-col items-center justify-center">
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-3">{demandDetails.crop_name}</h1>
              <p className="text-xl sm:text-2xl opacity-90 font-medium">Premium Quality</p>
              <div className="mt-6 px-8 py-3 bg-white/20 rounded-full inline-block backdrop-blur-sm">
                Fresh Harvest
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Price and Quick Info */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg overflow-hidden h-full">
            <div className="bg-green-50 p-6 border-b border-green-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-green-800">Price Details</h2>
                
              </div>
              <div className="text-3xl font-bold text-green-700 mb-2">
                ₹{demandDetails.crop_price}/Kg
              </div>
              <p className="text-green-600 text-sm">Market competitive price</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{demandDetails.quantity}/Kg</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{demandDetails.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Harvested On</p>
                  <p className="font-medium">{demandDetails.harvested_time}</p>
                </div>
              </div>
              
              {demandDetails.contractor_profile?.user && (
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Buyer</p>
                    <p className="font-medium">{demandDetails.contractor_profile.user.username}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Description and Details */}
      <div className="mt-8">
        <Card className="border-0 shadow-lg">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Crop</h2>
            
            <div className="prose max-w-none text-gray-700">
              <p className="leading-relaxed">{demandDetails.description}</p>
            </div>
            
            <Separator className="my-8" />
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{demandDetails.contact_no}</p>
                </div>
              </div>
              
              {demandDetails.contractor_profile?.user?.email && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{demandDetails.contractor_profile.user.email}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {demandDetails.contractor_profile?.user?.username && (
                <Link className="flex-1" href={`/profile/${demandDetails.contractor_profile.user.username}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all h-12">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat with Buyer
                  </Button>
                </Link>
              )}
              {/* <Button 
                variant="outline" 
                className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors h-12"
                onClick={() => window.location.href = `tel:${demandDetails.contact_no}`}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Buyer
              </Button> */}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Additional Information */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 text-gray-500 mr-2" />
          <p className="text-gray-600 text-sm">
            This demand was posted on {new Date().toLocaleDateString()}
          </p>
        </div>
        <p className="text-gray-500 text-sm">
          Note: Please verify all details with the buyer before making any transactions.
        </p>
      </div>
    </div>
  )
}
