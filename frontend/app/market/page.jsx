"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetAllCropsQuery } from "@/redux/Service/marketApi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, Calendar, MapPin, Phone, Package, Search, Filter, X } from "lucide-react"
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
  const { data: allCrops = [], isLoading, isError } = useGetAllCropsQuery()
  const router = useRouter()
  const cropsData = allCrops?.data || []
  const userInfo = useSelector((state) => state.auth.userInfo)
  const currentUser = userInfo?.data?.username
  const userRole = userInfo?.role

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [filteredCrops, setFilteredCrops] = useState([])
  const [filteredUserCrops, setFilteredUserCrops] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Get unique locations for filter dropdown
  const locations = cropsData ? [...new Set(cropsData.map((crop) => crop.location))].filter(Boolean) : []

  // Apply filters whenever dependencies change
  useEffect(() => {
    if (!cropsData.length) return

    let filtered = [...cropsData]
    let userFiltered = []

    // Filter for user crops if publisher
    if (currentUser) {
      userFiltered = cropsData.filter(crop => 
        crop.publisher?.username === currentUser
      )
    }

    // Apply search filter
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

    // Apply price filter
    filtered = filtered.filter((crop) => {
      const price = Number.parseFloat(crop.crop_price)
      return price >= priceRange[0] && price <= priceRange[1]
    })
    userFiltered = userFiltered.filter((crop) => {
      const price = Number.parseFloat(crop.crop_price)
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter((crop) => crop.location === selectedLocation)
      userFiltered = userFiltered.filter((crop) => crop.location === selectedLocation)
    }

    setFilteredCrops(filtered)
    setFilteredUserCrops(userFiltered)
  }, [cropsData, searchQuery, priceRange, selectedLocation, currentUser])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 10000])
    setSelectedLocation("")
    setIsFilterOpen(false)
  }

  // Get max price for slider
  const maxPrice = cropsData.length
    ? Math.max(...cropsData.map((crop) => Number.parseFloat(crop.crop_price || 0)), 10000)
    : 10000

  const renderCropCards = (cropsToRender) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="ml-2">Loading crops...</span>
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-12 text-red-500">
            Error fetching crops. Please try again later.
          </div>
        ) : cropsToRender.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">No crops found matching your criteria.</p>
            <Button variant="outline" onClick={resetFilters} className="mt-4">
              Reset Filters
            </Button>
          </div>
        ) : (
          cropsToRender.map((crop) => (
            <Card
              key={crop.crop_id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/crop/${crop.crop_id}`)}
            >
              <CardHeader className="p-0">
                <img
                  src={crop.crop_image || "/placeholder.svg?height=192&width=384"}
                  alt={crop.crop_name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-green-800">{crop.crop_name}</CardTitle>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                    ₹{crop.crop_price}
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <Package className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Quantity: <span className="font-medium">{crop.quantity}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Contact: <span className="font-medium">{crop.publisher_profile?.phoneno}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Location: <span className="font-medium">{crop.location}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Harvested: <span className="font-medium">{crop.harvested_time}</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-gray-700 line-clamp-2">{crop.Description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-900">Marketplace</h1>
        {currentUser && userRole === "farmer" && (
          <Button 
            onClick={() => router.push(`/your-crops/${currentUser}`)}
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Manage Your Crops
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops by name, description, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(selectedLocation || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    {(selectedLocation ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Price Range (₹)</Label>
                  <div className="pt-4">
                    <Slider
                      defaultValue={[0, maxPrice]}
                      value={priceRange}
                      max={maxPrice}
                      step={100}
                      onValueChange={setPriceRange}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
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
        </div>

        {/* Active filters */}
        {(selectedLocation || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
          <div className="flex flex-wrap gap-2">
            {selectedLocation && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {selectedLocation}
                <button onClick={() => setSelectedLocation("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                <button onClick={() => setPriceRange([0, maxPrice])}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results count and tabs */}
      <div className="mb-4 text-muted-foreground">
        {!isLoading && (
          <p>
            Showing {activeTab === "all" ? filteredCrops.length : filteredUserCrops.length} 
            {activeTab === "all" ? filteredCrops.length === 1 ? " crop" : " crops" : filteredUserCrops.length === 1 ? " your crop" : " your crops"}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}
      </div>

      {currentUser && userRole === "farmer" ? (
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all">All Crops</TabsTrigger>
            <TabsTrigger value="your">Your Crops</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {renderCropCards(filteredCrops)}
          </TabsContent>
          <TabsContent value="your">
            {renderCropCards(filteredUserCrops)}
          </TabsContent>
        </Tabs>
      ) : (
        renderCropCards(filteredCrops)
      )}
    </div>
  )
}