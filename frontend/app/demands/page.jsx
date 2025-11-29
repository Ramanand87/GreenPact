"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetAllDemandsQuery } from "@/redux/Service/demandApi"
import { useTranslate } from "@/lib/LanguageContext"
import { getTranslatedCropName } from "@/lib/cropTranslations"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, Calendar, MapPin, Phone, Package, Search, Filter, X, User, Star, Zap, Wheat } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSelector } from "react-redux"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function DemandCropsPage() {
  const { t, language } = useTranslate();
  const { data: demands = [], isLoading, isError } = useGetAllDemandsQuery()
  console.log("Fetched Demands Data:", demands)
  const router = useRouter()
  const demandsData = demands?.data || []
  const userInfo = useSelector((state) => state.auth.userInfo)
  const currentUser = userInfo?.data?.username
  const userRole = userInfo?.role

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [filteredDemands, setFilteredDemands] = useState([])
  const [filteredUserDemands, setFilteredUserDemands] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // AI Filter states
  const [maxDistance, setMaxDistance] = useState(100)
  const [isAiFiltering, setIsAiFiltering] = useState(false)
  const [aiFilteredDemands, setAiFilteredDemands] = useState(null)
  const [isAiFilterOpen, setIsAiFilterOpen] = useState(false)
  const [aiLimitError, setAiLimitError] = useState(false)
  const [userCoords, setUserCoords] = useState(null)
  const [detectedLocation, setDetectedLocation] = useState("")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [detectedLocationDetails, setDetectedLocationDetails] = useState({
    full: "",
    district: "",
    state: "",
  })

  // Get unique locations for filter dropdown
  const locations = demandsData ? [...new Set(demandsData.map((demand) => demand.location))].filter(Boolean) : []

  // Detect user location
  useEffect(() => {
    if (!navigator?.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }

    let isCancelled = false
    setIsDetectingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isCancelled) return
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationError("")
      },
      (error) => {
        if (isCancelled) return
        setLocationError(error.message || "Unable to retrieve your location.")
        setIsDetectingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )

    return () => {
      isCancelled = true
    }
  }, [])

  // Resolve location from coordinates
  useEffect(() => {
    if (!userCoords) return

    let isCancelled = false

    const resolveLocation = async () => {
      try {
        const params = new URLSearchParams({
          format: "json",
          lat: userCoords.latitude.toString(),
          lon: userCoords.longitude.toString(),
        })

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error("Unable to resolve your location.")
        }

        const data = await response.json()
        if (isCancelled) return

        const locality =
          data?.address?.city ||
          data?.address?.town ||
          data?.address?.village ||
          data?.address?.district ||
          data?.address?.state_district ||
          data?.address?.state ||
          ""

        const district =
          data?.address?.district ||
          data?.address?.state_district ||
          data?.address?.county ||
          ""

        const state =
          data?.address?.state ||
          data?.address?.region ||
          data?.address?.state_district ||
          ""

        const fullAddress = data?.display_name || ""

        const resolvedLocation = locality || district || state || ""

        setDetectedLocationDetails({
          full: fullAddress,
          district,
          state,
        })

        if (resolvedLocation) {
          setDetectedLocation(resolvedLocation)
          setLocationError("")
        } else {
          setLocationError("Unable to determine your nearest city.")
        }
      } catch (error) {
        if (!isCancelled) {
          setLocationError(error.message || "Unable to resolve your location.")
        }
      } finally {
        if (!isCancelled) {
          setIsDetectingLocation(false)
        }
      }
    }

    resolveLocation()

    return () => {
      isCancelled = true
    }
  }, [userCoords])

  const fullAddress = detectedLocationDetails.full

  // Function to handle AI filtering
  const handleAiFilter = async () => {
    if (!demands?.data?.length || !fullAddress) {
      console.warn("Cannot apply AI filter: missing demands data or location")
      return
    }

    setIsAiFiltering(true)
    try {
      console.log("All Demands Data before AI call:", demands)
      console.log("User full address for AI call:", fullAddress)
      console.log("Max distance:", maxDistance)

      const filterRes = await fetch("/api/filter-demands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: fullAddress,
          demands: demands.data,
          maxDistance: maxDistance,
        }),
      })

      if (!filterRes.ok) {
        throw new Error(`HTTP error! status: ${filterRes.status}`)
      }

      const filteredData = await filterRes.json()
      console.log("Filtered Demands Data from AI:", filteredData)

      if (filteredData.fallback) {
        console.warn("Using fallback: AI service unavailable")
        // Check if it's an API limit error
        if (filteredData.error && 
            (filteredData.error.includes('empty') || 
             filteredData.error.includes('limit') ||
             filteredData.error.includes('429') ||
             filteredData.error.includes('exhausted'))) {
          setAiLimitError(true)
          setAiFilteredDemands(null) // Show all demands by not setting filter
          return
        }
      }

      setAiLimitError(false)
      // Only set filtered demands if we have results, otherwise show all demands
      if (filteredData.matched && filteredData.matched.length > 0) {
        setAiFilteredDemands(filteredData.matched)
      } else {
        setAiFilteredDemands(null) // Show all demands if no matches
      }
    } catch (error) {
      console.log("Failed to fetch filtered demands:", error)
      // Fallback to showing all demands when error occurs
      setAiFilteredDemands(null) // null means show all demands
      setAiLimitError(true)
    } finally {
      setIsAiFiltering(false)
      setIsAiFilterOpen(false) // Close popup after filtering
    }
  }

  // Apply filters whenever dependencies change
  useEffect(() => {
    if (!demandsData.length) return

    // Use AI-filtered demands for "All Demands" tab only, otherwise use all demands
    const baseData = aiFilteredDemands !== null ? aiFilteredDemands : demandsData
    let filtered = [...baseData]
    
    // For user demands, always use all demandsData (not AI filtered)
    let userFiltered = []

    // Filter for user demands if contractor
    if (userRole === "contractor" && currentUser) {
      userFiltered = demandsData.filter(demand => 
        demand.demand_user?.username === currentUser
      )
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (demand) =>
          demand.crop_name.toLowerCase().includes(query) ||
          demand.description?.toLowerCase().includes(query) ||
          demand.location?.toLowerCase().includes(query),
      )
      userFiltered = userFiltered.filter(
        (demand) =>
          demand.crop_name.toLowerCase().includes(query) ||
          demand.description?.toLowerCase().includes(query) ||
          demand.location?.toLowerCase().includes(query),
      )
    }

    // Apply price filter
    filtered = filtered.filter((demand) => {
      const price = Number.parseFloat(demand.crop_price)
      return price >= priceRange[0] && price <= priceRange[1]
    })
    userFiltered = userFiltered.filter((demand) => {
      const price = Number.parseFloat(demand.crop_price)
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter((demand) => demand.location === selectedLocation)
      userFiltered = userFiltered.filter((demand) => demand.location === selectedLocation)
    }

    setFilteredDemands(filtered)
    setFilteredUserDemands(userFiltered)
  }, [demandsData, searchQuery, priceRange, selectedLocation, currentUser, userRole, aiFilteredDemands])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 10000])
    setSelectedLocation("")
    setIsFilterOpen(false)
    setAiFilteredDemands(null)
    setMaxDistance(100)
    setAiLimitError(false)
  }

  // Get max price for slider
  const maxPrice = demandsData.length
    ? Math.max(...demandsData.map((demand) => Number.parseFloat(demand.crop_price || 0)), 10000)
    : 10000

  // Generate professional gradient colors based on crop name
  const getGradientForCrop = (cropName) => {
    const gradients = [
      'from-emerald-500 via-teal-500 to-cyan-600',
      'from-blue-500 via-indigo-500 to-purple-600',
      'from-pink-500 via-rose-500 to-red-600',
      'from-orange-500 via-amber-500 to-yellow-600',
      'from-green-500 via-lime-500 to-emerald-600',
      'from-violet-500 via-purple-500 to-fuchsia-600',
      'from-cyan-500 via-sky-500 to-blue-600',
      'from-rose-500 via-pink-500 to-purple-600',
      'from-amber-500 via-orange-500 to-red-600',
      'from-teal-500 via-emerald-500 to-green-600',
    ]
    
    // Use crop name to consistently pick a gradient
    const index = cropName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length
    return gradients[index]
  }

  const DemandCard = ({ demand }) => (
    <Card
      key={demand.demand_id}
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg flex flex-col h-full bg-white cursor-pointer rounded-2xl"
      onClick={() => router.push(`/demand/${demand.demand_id}`)}
    >
      {/* Image Container with Price & Quantity Overlay */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="relative w-full h-56 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -ml-20 -mb-20" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/30 rounded-full -ml-12 -mt-12" />
          </div>
          
          {/* Large Crop Icon Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Wheat className="h-32 w-32 text-white/40 transform rotate-12" />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Price and Quantity Badges */}
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
          {/* Crop Name */}
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

          {/* Required By Date */}
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

          {/* Contractor Info */}
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
  )

  const renderDemandCards = (demandsToRender) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <span className="text-lg font-semibold text-gray-700">
              {t("loadingDemands", {
                en: "Loading crop demands...",
                hi: "मांगें लोड हो रही हैं...",
              })}
            </span>
            <span className="text-sm text-gray-500 mt-2">Please wait a moment</span>
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-20">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-xl font-bold text-red-600 mb-2">
                {t("errorFetchingDemands", {
                  en: "Error Loading Demands",
                  hi: "मांगें प्राप्त करने में त्रुटि",
                })}
              </p>
              <p className="text-gray-600 mb-4">Unable to connect to the server. Please try again later.</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : demandsToRender.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🌾</div>
              <p className="text-xl font-bold text-gray-900 mb-2">
                {t("noDemandsFound", {
                  en: "No Demands Found",
                  hi: "कोई मांग नहीं मिली",
                })}
              </p>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedLocation || aiFilteredDemands !== null
                  ? "Try adjusting your filters or search criteria to see more results."
                  : "No crop demands are currently available in the marketplace."}
              </p>
              {(searchQuery || selectedLocation || aiFilteredDemands !== null) && (
                <Button 
                  onClick={resetFilters} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t("resetFilters", {
                    en: "Clear All Filters",
                    hi: "फ़िल्टर रीसेट करें",
                  })}
                </Button>
              )}
            </div>
          </div>
        ) : (
          demandsToRender.map((demand) => <DemandCard key={demand.demand_id} demand={demand} />)
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {t("demandCrops", { en: "Crop Demands", hi: "फसल की मांग" })}
              </h1>
              <p className="text-gray-600 text-base md:text-lg font-medium">
                Discover quality crop demands from verified contractors and buyers
              </p>
              {!isLoading && demandsData.length > 0 && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-blue-600">{demandsData.length}</span> demands available
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{locations.length} locations</span>
                  </div>
                </div>
              )}
            </div>
            {currentUser && userRole === "contractor" && (
              <Button
                onClick={() => router.push(`/crop-demand/${currentUser}`)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto px-6 py-6 text-base"
              >
                <Zap className="h-5 w-5 mr-2" />
                {t("manageYourDemands", {
                  en: "Manage Your Demands",
                  hi: "मांगें प्रबंधित करें",
                })}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
            <Input
              placeholder={t("searchDemandsPlaceholder", {
                en: "Search demands by crop name, location, or description...",
                hi: "नाम, स्थान से मांगें खोजें...",
              })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Price and Location Filter */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 bg-white rounded-xl px-5 py-6 transition-all shadow-sm hover:shadow-md"
                >
                  <Filter className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Filters</span>
                  {(selectedLocation || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <Badge className="ml-2 bg-blue-600 text-white rounded-full px-2">
                      {(selectedLocation ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 border-2 border-gray-200 shadow-xl rounded-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                  {(selectedLocation || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-blue-600 hover:bg-blue-50 font-semibold"
                    >
                      Reset All
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-900">Price Range (₹ per kg)</Label>
                  <div className="pt-4">
                    <Slider
                      defaultValue={[0, maxPrice]}
                      value={priceRange}
                      max={maxPrice}
                      step={100}
                      onValueChange={setPriceRange}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">₹{priceRange[0]}</span>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-900">Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                      <SelectValue placeholder={t('selectLocation', { en: 'Select location', hi: 'स्थान चुनें' })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allLocations', { en: 'All Locations', hi: 'सभी स्थान' })}</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* AI Filter */}
          <Popover open={isAiFilterOpen} onOpenChange={setIsAiFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-500 rounded-xl px-5 py-6 transition-all shadow-sm hover:shadow-md"
              >
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-700">AI Filter</span>
                {aiFilteredDemands !== null && <Badge className="ml-2 bg-purple-600 text-white rounded-full">✓</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 border-2 border-gray-200 shadow-xl rounded-xl">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  AI Location Filter
                </h3>

                <Separator />

                {/* Current Location Display */}
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-900">Your Location</Label>
                  <div className="text-sm bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                    {isDetectingLocation ? (
                      <span className="flex items-center gap-2 text-gray-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Detecting your location...
                      </span>
                    ) : fullAddress ? (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                        <span className="break-words text-gray-800 font-medium">{fullAddress}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Location not available</span>
                    )}
                  </div>
                </div>

                {/* Max Distance */}
                <div className="space-y-3">
                  <Label className="font-semibold text-gray-900">Max Distance: {maxDistance} km</Label>
                  <Slider
                    value={[maxDistance]}
                    max={500}
                    min={10}
                    step={10}
                    onValueChange={(value) => setMaxDistance(value[0])}
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>10 km</span>
                    <span>500 km</span>
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  onClick={handleAiFilter}
                  disabled={!fullAddress || isAiFiltering}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg rounded-lg py-6"
                >
                  {isAiFiltering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Filtering...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Apply AI Filter
                    </>
                  )}
                </Button>

                {aiFilteredDemands !== null && (
                  <div className="text-sm bg-green-50 text-green-700 p-3 rounded-lg border-2 border-green-200 font-medium">
                    ✓ {t('showing', { en: 'Showing', hi: 'दिखाया जा रहा है' })} {aiFilteredDemands.length} {t('demandsWithin', { en: 'demands within', hi: 'मांगें' })} {maxDistance}km
                  </div>
                )}

                {!fullAddress && !isDetectingLocation && (
                  <div className="text-sm bg-orange-50 text-orange-700 p-3 rounded-lg border-2 border-orange-200 font-medium">
                    ⚠ {t('locationRequired', { en: 'Location required for AI filter', hi: 'AI फ़िल्टर के लिए स्थान आवश्यक है' })}
                  </div>
                )}

                {aiLimitError && (
                  <div className="text-sm bg-red-50 text-red-700 p-3 rounded-lg border-2 border-red-200">
                    <strong>⚠ {t('aiLimitExceeded', { en: 'AI Limit Exceeded', hi: 'AI सीमा पार' })}</strong>
                    <p className="mt-1 text-xs">{t('aiLimitMessage', { en: 'The AI service limit has been reached. Please try again later or use the regular filters.', hi: 'AI सेवा की सीमा पहुंच गई है। कृपया बाद में पुनः प्रयास करें या नियमित फ़िल्टर का उपयोग करें।' })}</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active filters */}
        {(selectedLocation || priceRange[0] > 0 || priceRange[1] < maxPrice || aiFilteredDemands !== null) && (
          <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm font-semibold text-gray-700 mr-2">Active Filters:</span>
            
            {aiFilteredDemands !== null && (
              <Badge variant="default" className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg">
                <Zap className="h-3 w-3" />
                AI Filter: {maxDistance}km
                <button onClick={() => setAiFilteredDemands(null)} className="ml-1 hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedLocation && (
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-300">
                <MapPin className="h-3 w-3" />
                {selectedLocation}
                <button onClick={() => setSelectedLocation("")} className="ml-1 hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-300">
                ₹{priceRange[0]} - ₹{priceRange[1]}
                <button onClick={() => setPriceRange([0, maxPrice])} className="ml-1 hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold ml-auto"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Results Section */}
      {!isLoading && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-0.5">
                  {activeTab === "all" ? "Available Demands" : "Your Posted Demands"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeTab === "all" ? filteredDemands.length : filteredUserDemands.length}
                </p>
              </div>
            </div>
            {searchQuery && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Search results for</p>
                <p className="font-semibold text-blue-600">"{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs Section */}
      {userRole === "contractor" ? (
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
            >
              All Crop Demands
            </TabsTrigger>
            <TabsTrigger 
              value="your"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
            >
              Your Posted Demands
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">{renderDemandCards(filteredDemands)}</TabsContent>
          <TabsContent value="your">{renderDemandCards(filteredUserDemands)}</TabsContent>
        </Tabs>
      ) : (
        renderDemandCards(filteredDemands)
      )}
    </div>
  </div>
  )
}