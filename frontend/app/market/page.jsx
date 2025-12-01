"use client"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useGetAllCropsQuery } from "@/redux/Service/marketApi"
import { useTranslate } from "@/lib/LanguageContext"
import { getTranslatedCropName } from "@/lib/cropTranslations"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, Calendar, MapPin, Phone, Package, Search, Filter, X, User, Star, Zap } from "lucide-react"
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

export default function MarketPage() {
  const { t, language } = useTranslate()
  const { data: allCrops = [], isLoading, isError } = useGetAllCropsQuery()
  const router = useRouter()
  const cropsData = allCrops?.data || []
  const userInfo = useSelector((state) => state.auth.userInfo)
  const currentUser = userInfo?.data?.username
  const userRole = userInfo?.role
  const ALL_LOCATIONS_OPTION = "__all__"

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [maxPriceFilter, setMaxPriceFilter] = useState(1000)
  const [selectedLocation, setSelectedLocation] = useState("")
  const [filteredCrops, setFilteredCrops] = useState([])
  const [filteredUserCrops, setFilteredUserCrops] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [userCoords, setUserCoords] = useState(null)
  const [detectedLocation, setDetectedLocation] = useState("")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [hasManualLocationSelection, setHasManualLocationSelection] = useState(false)
  const [detectedLocationDetails, setDetectedLocationDetails] = useState({
    full: "",
    district: "",
    state: "",
  })
  const [filtered, setFiltered] = useState(null)
  const [maxDistance, setMaxDistance] = useState(100)
  const [isAiFiltering, setIsAiFiltering] = useState(false)
  const [aiFilteredCrops, setAiFilteredCrops] = useState(null)
  const [isAiFilterOpen, setIsAiFilterOpen] = useState(false)
  const [aiLimitError, setAiLimitError] = useState(false)

  // Get unique locations for filter dropdown
  const locations = useMemo(() => {
    if (!cropsData) return []
    return [...new Set(cropsData.map((crop) => crop.location))].filter(Boolean)
  }, [cropsData])

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
      },
    )

    return () => {
      isCancelled = true
    }
  }, [])

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

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
          headers: {
            Accept: "application/json",
          },
        })

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

        const district = data?.address?.district || data?.address?.state_district || data?.address?.county || ""

        const state = data?.address?.state || data?.address?.region || data?.address?.state_district || ""

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

  // Removed automatic location selection - user must manually select location filter

  const fullAddress = detectedLocationDetails.full

  // Function to handle AI filtering
  const handleAiFilter = async () => {
    if (!allCrops?.data?.length || !fullAddress) {
      return
    }

    setIsAiFiltering(true)
    try {
      const filterRes = await fetch("/api/filter-crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: fullAddress,
          crops: allCrops.data,
          maxDistance: maxDistance,
        }),
      })

      if (!filterRes.ok) {
        throw new Error(`HTTP error! status: ${filterRes.status}`)
      }

      const filteredData = await filterRes.json()

      if (filteredData.fallback) {
        if (
          filteredData.error &&
          (filteredData.error.includes("empty") ||
            filteredData.error.includes("limit") ||
            filteredData.error.includes("429") ||
            filteredData.error.includes("exhausted"))
        ) {
          setAiLimitError(true)
          setAiFilteredCrops(null)
          return
        }
      }

      setAiLimitError(false)

      if (filteredData.matched && filteredData.matched.length > 0) {
        setAiFilteredCrops(filteredData.matched)
      } else {
        setAiFilteredCrops(null)
      }
    } catch (error) {
      setAiFilteredCrops(null)
      setAiLimitError(true)
    } finally {
      setIsAiFiltering(false)
      setIsAiFilterOpen(false)
    }
  }

  useEffect(() => {
    if (!cropsData.length) return

    const baseData = aiFilteredCrops !== null ? aiFilteredCrops : cropsData
    let filtered = [...baseData]

    let userFiltered = []

    if (currentUser) {
      userFiltered = cropsData.filter((crop) => crop.publisher?.username === currentUser)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (crop) =>
          crop.crop_name.toLowerCase().includes(query) ||
          crop.Description?.toLowerCase().includes(query) ||
          crop.location?.toLowerCase().includes(query),
      )
      userFiltered = userFiltered.filter(
        (crop) =>
          crop.crop_name.toLowerCase().includes(query) ||
          crop.Description?.toLowerCase().includes(query) ||
          crop.location?.toLowerCase().includes(query),
      )
    }

    filtered = filtered.filter((crop) => {
      const price = Number.parseFloat(crop.crop_price)
      return price >= 0 && price <= maxPriceFilter
    })

    userFiltered = userFiltered.filter((crop) => {
      const price = Number.parseFloat(crop.crop_price)
      return price >= 0 && price <= maxPriceFilter
    })

    if (selectedLocation) {
      filtered = filtered.filter((crop) => crop.location === selectedLocation)
      userFiltered = userFiltered.filter((crop) => crop.location === selectedLocation)
    }

    setFilteredCrops(filtered)
    setFilteredUserCrops(userFiltered)
  }, [cropsData, searchQuery, maxPriceFilter, selectedLocation, currentUser, aiFilteredCrops])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setMaxPriceFilter(1000)
    setSelectedLocation("")
    setIsFilterOpen(false)
    setHasManualLocationSelection(false)
    setAiFilteredCrops(null)
    setMaxDistance(100)
  }

  // Get max price for slider
  const maxPrice = cropsData.length
    ? Math.max(...cropsData.map((crop) => Number.parseFloat(crop.crop_price || 0)), 1000)
    : 1000

  const CropCard = ({ crop }) => (
    <Card
      key={crop.crop_id}
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg flex flex-col h-full bg-white cursor-pointer rounded-2xl"
      onClick={() => router.push(`/crop/${crop.crop_id}`)}
    >
      {/* Image Container with Price & Quantity Overlay */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="relative w-full h-56">
          <img
            src={crop.crop_image || "/placeholder.svg?height=224&width=400"}
            alt={crop.crop_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Price and Quantity Badges */}
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
          {/* Crop Name */}
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

          {/* Harvested Date */}
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

          {/* Farmer Info */}
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
  )

  const renderCropCards = (cropsToRender) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
            <span className="text-lg font-semibold text-gray-700">
              {t("loadingCrops", {
                en: "Loading fresh crops...",
                hi: "फसलें लोड हो रही हैं...",
              })}
            </span>
            <span className="text-sm text-gray-500 mt-2">Please wait a moment</span>
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-20">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-xl font-bold text-red-600 mb-2">
                {t("errorFetchingCrops", {
                  en: "Error Loading Crops",
                  hi: "फसलें प्राप्त करने में त्रुटि",
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
        ) : cropsToRender.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🌾</div>
              <p className="text-xl font-bold text-gray-900 mb-2">
                {t("noCropsFound", {
                  en: "No Crops Found",
                  hi: "कोई फसल नहीं मिली",
                })}
              </p>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedLocation || aiFilteredCrops !== null
                  ? "Try adjusting your filters or search criteria to see more results."
                  : "No crops are currently available in the marketplace."}
              </p>
              {(searchQuery || selectedLocation || aiFilteredCrops !== null) && (
                <Button 
                  onClick={resetFilters} 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg"
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
          cropsToRender.map((crop) => <CropCard key={crop.crop_id} crop={crop} />)
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {t("marketplace", { en: "Marketplace", hi: "बाज़ार" })}
              </h1>
              <p className="text-gray-600 text-base md:text-lg font-medium">
                Discover fresh, quality crops directly from verified farmers
              </p>
              {!isLoading && cropsData.length > 0 && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-green-600">{cropsData.length}</span> crops available
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{locations.length} locations</span>
                  </div>
                </div>
              )}
            </div>
            {currentUser && userRole === "farmer" && (
              <Button
                onClick={() => router.push(`/your-crops/${currentUser}`)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto px-6 py-6 text-base"
              >
                <Zap className="h-5 w-5 mr-2" />
                {t("manageYourCrops", {
                  en: "Manage Your Crops",
                  hi: "फसलें प्रबंधित करें",
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
            <Input
              placeholder={t("searchCropsPlaceholder", {
                en: "Search crops by name, location, or description...",
                hi: "नाम, स्थान से फसलें खोजें...",
              })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-base border-2 border-gray-200 focus:border-green-500 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
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
                  className="flex items-center gap-2 border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 bg-white rounded-xl px-5 py-6 transition-all shadow-sm hover:shadow-md"
                >
                  <Filter className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Filters</span>
                  {(selectedLocation || maxPriceFilter < maxPrice) && (
                    <Badge className="ml-2 bg-green-600 text-white rounded-full px-2">
                      {(selectedLocation ? 1 : 0) + (maxPriceFilter < maxPrice ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 border-2 border-gray-200 shadow-xl rounded-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                    {(selectedLocation || maxPriceFilter < maxPrice) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-green-600 hover:bg-green-50 font-semibold"
                      >
                        Reset All
                      </Button>
                    )}
                  </div>

                  <Separator />

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-900">Max Price: ₹{maxPriceFilter} per kg</Label>
                  <div className="pt-4">
                    <Slider
                      value={[maxPriceFilter]}
                      max={maxPrice}
                      min={0}
                      step={10}
                      onValueChange={(value) => setMaxPriceFilter(value[0])}
                      className="cursor-pointer [&_.bg-primary\/20]:bg-gray-200 [&_.bg-primary]:bg-green-600 [&_[role=slider]]:bg-white [&_[role=slider]]:border-green-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">₹0</span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">₹{maxPriceFilter}</span>
                  </div>
                </div>                  {/* Location Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-900">Location</Label>
                    <Select
                      value={selectedLocation || ALL_LOCATIONS_OPTION}
                      onValueChange={(value) => {
                        setHasManualLocationSelection(true)
                        if (value === ALL_LOCATIONS_OPTION) {
                          setSelectedLocation("")
                        } else {
                          setSelectedLocation(value)
                        }
                      }}
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-lg">
                        <SelectValue
                          placeholder={t("selectLocation", {
                            en: "Select location",
                            hi: "स्थान चुनें",
                          })}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL_LOCATIONS_OPTION}>
                          {t("allLocations", {
                            en: "All Locations",
                            hi: "सभी स्थान",
                          })}
                        </SelectItem>
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
                  {aiFilteredCrops !== null && <Badge className="ml-2 bg-purple-600 text-white rounded-full">✓</Badge>}
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
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
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

                  {/* Status Messages */}
                  {aiFilteredCrops !== null && (
                    <div className="text-sm bg-green-50 text-green-700 p-3 rounded-lg border-2 border-green-200 font-medium">
                      ✓ Showing {aiFilteredCrops.length} crops within {maxDistance} km
                    </div>
                  )}

                  {!fullAddress && !isDetectingLocation && (
                    <div className="text-sm bg-orange-50 text-orange-700 p-3 rounded-lg border-2 border-orange-200 font-medium">
                      ⚠ Location required for AI filter
                    </div>
                  )}

                  {aiLimitError && (
                    <div className="text-sm bg-red-50 text-red-700 p-3 rounded-lg border-2 border-red-200">
                      <strong>⚠ AI Limit Exceeded</strong>
                      <p className="mt-1 text-xs">Please try again later or use regular filters.</p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

        {/* Active Filters Display */}
        {(selectedLocation || maxPriceFilter < maxPrice || aiFilteredCrops !== null) && (
            <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-gray-700 mr-2">Active Filters:</span>
              
              {aiFilteredCrops !== null && (
                <Badge variant="default" className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg">
                  <Zap className="h-3 w-3" />
                  AI Filter: {maxDistance}km
                  <button onClick={() => setAiFilteredCrops(null)} className="ml-1 hover:opacity-70">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {selectedLocation && (
                <Badge variant="secondary" className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg border border-green-300">
                  <MapPin className="h-3 w-3" />
                  {selectedLocation}
                  <button
                    onClick={() => {
                      setSelectedLocation("")
                      setHasManualLocationSelection(true)
                    }}
                    className="ml-1 hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
              </Badge>
            )}

            {maxPriceFilter < maxPrice && (
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-300">
                ₹0 - ₹{maxPriceFilter}
                <button onClick={() => setMaxPriceFilter(maxPrice)} className="ml-1 hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}              <Button
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
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-0.5">
                    {activeTab === "all" ? "Available Crops" : "Your Listed Crops"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeTab === "all" ? filteredCrops.length : filteredUserCrops.length}
                  </p>
                </div>
              </div>
              {searchQuery && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Search results for</p>
                  <p className="font-semibold text-green-600">"{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs Section */}
        {currentUser && userRole === "farmer" ? (
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                All Marketplace Crops
              </TabsTrigger>
              <TabsTrigger 
                value="your"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                Your Listed Crops
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">{renderCropCards(filteredCrops)}</TabsContent>
            <TabsContent value="your">{renderCropCards(filteredUserCrops)}</TabsContent>
          </Tabs>
        ) : (
          renderCropCards(filteredCrops)
        )}
      </div>
    </div>
  )
}
