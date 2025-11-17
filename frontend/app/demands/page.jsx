"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetAllDemandsQuery } from "@/redux/Service/demandApi"
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

export default function DemandCropsPage() {
  const { data: demands = [], isLoading, isError } = useGetAllDemandsQuery()
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

  // Get unique locations for filter dropdown
  const locations = demandsData ? [...new Set(demandsData.map((demand) => demand.location))].filter(Boolean) : []

  // Apply filters whenever dependencies change
  useEffect(() => {
    if (!demandsData.length) return

    let filtered = [...demandsData]
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
  }, [demandsData, searchQuery, priceRange, selectedLocation, currentUser, userRole])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 10000])
    setSelectedLocation("")
    setIsFilterOpen(false)
  }

  // Get max price for slider
  const maxPrice = demandsData.length
    ? Math.max(...demandsData.map((demand) => Number.parseFloat(demand.crop_price || 0)), 10000)
    : 10000

  // Function to generate a color based on crop name
  const generateColor = (name) => {
    const colors = [
      "from-green-500 to-emerald-700",
      "from-orange-400 to-amber-700",
      "from-red-400 to-rose-700",
      "from-yellow-300 to-amber-600",
      "from-blue-400 to-indigo-700",
      "from-purple-400 to-violet-700",
    ]

    // Use the first character of the crop name to select a color
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const renderDemandCards = (demandsToRender) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="ml-2">Loading demands...</span>
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-12 text-red-500">
            Error fetching demands. Please try again later.
          </div>
        ) : demandsToRender.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">No demands found matching your criteria.</p>
            <Button variant="outline" onClick={resetFilters} className="mt-4">
              Reset Filters
            </Button>
          </div>
        ) : (
          demandsToRender.map((demand) => (
            <Card
              key={demand.demand_id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/demand/${demand.demand_id}`)}
            >
              <CardHeader className="p-0">
                <div
                  className={`w-full h-48 rounded-t-lg flex items-center justify-center bg-gradient-to-br ${generateColor(demand.crop_name)} text-white`}
                >
                  <div className="text-center p-4">
                    <h2 className="text-3xl font-bold tracking-tight mb-1">{demand.crop_name}</h2>
                    <p className="text-lg opacity-90 font-medium">Premium Quality</p>
                    <div className="mt-2 px-4 py-1 bg-white/20 rounded-full inline-block backdrop-blur-sm text-sm">
                      Fresh Harvest
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-green-800">{demand.crop_name}</CardTitle>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                    ₹{demand.crop_price}/Kg
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <Package className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Quantity: <span className="font-medium">{demand.quantity}/Kg</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Contact: <span className="font-medium">{demand.contact_no}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Location: <span className="font-medium">{demand.location}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Harvested: <span className="font-medium">{demand.harvested_time}</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-gray-700 line-clamp-2">{demand.description}</p>
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
        <h1 className="text-3xl font-bold text-green-900">Demand Crops</h1>
        {userRole === "contractor" && (
          <Button 
            onClick={() => router.push(`/crop-demand/${currentUser}`)}
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Manage Your Demands
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search demands by crop name, description, location..."
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
            Showing {activeTab === "all" ? filteredDemands.length : filteredUserDemands.length} 
            {activeTab === "all" ? filteredDemands.length === 1 ? " demand" : " demands" : filteredUserDemands.length === 1 ? " your demand" : " your demands"}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}
      </div>

      {userRole === "contractor" ? (
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all">All Demands</TabsTrigger>
            <TabsTrigger value="your">Your Demands</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {renderDemandCards(filteredDemands)}
          </TabsContent>
          <TabsContent value="your">
            {renderDemandCards(filteredUserDemands)}
          </TabsContent>
        </Tabs>
      ) : (
        renderDemandCards(filteredDemands)
      )}
    </div>
  )
}