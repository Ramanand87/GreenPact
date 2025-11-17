"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { Loader2, Calendar, MapPin, Phone, Package, Search, Filter, SlidersHorizontal, Sparkles } from "lucide-react"
import { useGetAllCropsQuery } from "@/redux/Service/marketApi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function MarketPageModern() {
  const router = useRouter()
  const { data: allCrops = [], isLoading, isError } = useGetAllCropsQuery()
  const cropsData = allCrops?.data || []
  const userInfo = useSelector((state) => state.auth.userInfo)
  const currentUser = userInfo?.data?.username
  const userRole = userInfo?.role

  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [filteredCrops, setFilteredCrops] = useState([])
  const [filteredUserCrops, setFilteredUserCrops] = useState([])
  const [activeTab, setActiveTab] = useState("all")

  const locations = useMemo(() => {
    return cropsData ? [...new Set(cropsData.map((crop) => crop.location))].filter(Boolean) : []
  }, [cropsData])

  const maxPrice = useMemo(() => {
    return cropsData.length
      ? Math.max(...cropsData.map((crop) => Number.parseFloat(crop.crop_price || 0)), 10000)
      : 10000
  }, [cropsData])

  useEffect(() => {
    if (!cropsData.length) return

    let filtered = [...cropsData]
    let userFiltered = []

    if (currentUser) {
      userFiltered = cropsData.filter((crop) => crop.publisher?.username === currentUser)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesQuery = (crop) =>
        crop.crop_name.toLowerCase().includes(query) ||
        crop.Description?.toLowerCase().includes(query) ||
        crop.location?.toLowerCase().includes(query)

      filtered = filtered.filter(matchesQuery)
      userFiltered = userFiltered.filter(matchesQuery)
    }

    const withinPrice = (crop) => {
      const price = Number.parseFloat(crop.crop_price)
      return price >= priceRange[0] && price <= priceRange[1]
    }

    filtered = filtered.filter(withinPrice)
    userFiltered = userFiltered.filter(withinPrice)

    if (selectedLocation) {
      const isSelected = (crop) => crop.location === selectedLocation
      filtered = filtered.filter(isSelected)
      userFiltered = userFiltered.filter(isSelected)
    }

    setFilteredCrops(filtered)
    setFilteredUserCrops(userFiltered)
  }, [cropsData, currentUser, priceRange, searchQuery, selectedLocation])

  useEffect(() => {
    setPriceRange((previous) => {
      // Align default range with computed max while keeping user adjustments intact
      if (!previous) {
        return [0, maxPrice]
      }

      const [minValue, maxValue] = previous
      if (minValue === 0 && (maxValue === 10000 || maxValue === 0)) {
        return [0, maxPrice]
      }

      if (maxValue > maxPrice) {
        return [Math.min(minValue, maxPrice), maxPrice]
      }

      return previous
    })
  }, [maxPrice])

  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, maxPrice])
    setSelectedLocation("")
  }

  const totalCount = filteredCrops.length
  const yourCount = filteredUserCrops.length
  const activeCount = activeTab === "all" ? totalCount : yourCount

  const priceStats = useMemo(() => {
    if (!cropsData.length) return { average: 0, highest: 0 }
    const prices = cropsData
      .map((crop) => Number.parseFloat(crop.crop_price || 0))
      .filter((price) => Number.isFinite(price) && price > 0)

    if (!prices.length) return { average: 0, highest: 0 }

    const average = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
    const highest = Math.max(...prices)
    return { average, highest }
  }, [cropsData])

  const distinctFarmers = useMemo(() => {
    if (!cropsData.length) return 0
    const ids = new Set(
      cropsData
        .map((crop) => crop.publisher?.username)
        .filter(Boolean)
    )
    return ids.size
  }, [cropsData])

  const renderCropCards = (cropsToRender) => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span>Loading crops...</span>
        </div>
      )
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-red-500">
          <p className="text-lg font-medium">We couldn&apos;t fetch the market data.</p>
          <p className="text-sm text-slate-500">Please refresh the page or try again shortly.</p>
        </div>
      )
    }

    if (!cropsToRender.length) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-emerald-100 bg-white/70 p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">No crops match your criteria.</p>
          <p className="text-sm text-slate-500">Adjust your filters or search to explore more listings.</p>
          <Button onClick={resetFilters} variant="outline" className="mt-2">
            Reset Filters
          </Button>
        </div>
      )
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cropsToRender.map((crop) => (
          <Card
            key={crop.crop_id}
            onClick={() => router.push(`/crop/${crop.crop_id}`)}
            className="group relative overflow-hidden rounded-3xl border border-emerald-100/60 bg-white shadow-[0_25px_70px_rgba(15,118,110,0.08)] transition-transform hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(15,118,110,0.12)]"
          >
            <CardHeader className="p-0">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={crop.crop_image || "/placeholder.svg?height=224&width=400"}
                  alt={crop.crop_name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm">
                  ₹{crop.crop_price}
                </Badge>
                <Badge variant="secondary" className="absolute right-4 top-4 rounded-full bg-emerald-100/90 text-emerald-700">
                  {crop.quantity} Qty
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-xl font-semibold text-slate-900">{crop.crop_name}</CardTitle>
                <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                  <span>Premium</span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-emerald-500" />
                  <span>Available: <span className="font-medium text-slate-900">{crop.quantity}</span></span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-emerald-500" />
                  <span>Contact: <span className="font-medium text-slate-900">{crop.publisher_profile?.phoneno || "NA"}</span></span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span>Location: <span className="font-medium text-slate-900">{crop.location || "Not specified"}</span></span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span>Harvested: <span className="font-medium text-slate-900">{crop.harvested_time}</span></span>
                </div>
              </div>

              <p className="line-clamp-2 text-sm text-slate-600">{crop.Description}</p>

              <div className="flex items-center justify-between pt-2 text-sm text-slate-500">
                <span>Click to view details</span>
                <span className="font-medium text-emerald-600">Open profile →</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const handleLocationChange = (value) => {
    if (value === "all") {
      setSelectedLocation("")
    } else {
      setSelectedLocation(value)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-lime-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_70%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-20 pt-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-700 shadow-sm">
              <SlidersHorizontal className="h-4 w-4" /> Intelligent crop exchange
            </div>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Discover fresh harvests inside a modern marketplace
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">
              Browse live listings, analyse pricing trends, and reach out to verified growers with a design-forward experience optimised for clarity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
                {cropsData.length || 0} active listings
              </Badge>
              <Badge className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
                {distinctFarmers}+ verified growers
              </Badge>
              <Badge className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
                Avg price ₹{priceStats.average || 0}
              </Badge>
            </div>
          </div>

          <Card className="relative z-10 w-full max-w-md rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,118,110,0.12)] backdrop-blur">
            <CardTitle className="text-lg font-semibold text-slate-900">Market pulse</CardTitle>
            <p className="mt-2 text-sm text-slate-600">Keep track of live pricing and latest harvests at a glance.</p>
            <Separator className="my-6" />
            <div className="space-y-5 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Average price</span>
                <span className="text-lg font-semibold text-slate-900">₹{priceStats.average || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Highest listing</span>
                <span className="text-lg font-semibold text-slate-900">₹{priceStats.highest || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Available crops</span>
                <span className="text-lg font-semibold text-slate-900">{cropsData.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Connected farmers</span>
                <span className="text-lg font-semibold text-slate-900">{distinctFarmers}</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="-mt-12 space-y-10">
          <Card className="relative rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-[0_20px_50px_rgba(15,118,110,0.08)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">Search the marketplace</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Try &ldquo;Organic wheat&rdquo; or a location"
                    className="h-12 rounded-full border-emerald-100 pl-11 pr-4 text-base shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Focus by location</label>
                  <Select value={selectedLocation || ""} onValueChange={handleLocationChange}>
                    <SelectTrigger className="h-12 rounded-full border-emerald-100 bg-white text-slate-700">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="all">All locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Refine by price (₹)</label>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                    <Slider
                      value={priceRange}
                      max={maxPrice}
                      step={100}
                      onValueChange={setPriceRange}
                    />
                    <div className="mt-2 flex items-center justify-between text-xs font-medium text-emerald-700">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(selectedLocation || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Filter className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-600">Active filters:</span>
                {selectedLocation && (
                  <Badge variant="secondary" className="rounded-full bg-emerald-100 text-emerald-700">
                    Location: {selectedLocation}
                    <button
                      type="button"
                      onClick={() => setSelectedLocation("")}
                      className="ml-2 text-xs text-emerald-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <Badge variant="secondary" className="rounded-full bg-emerald-100 text-emerald-700">
                    Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                    <button
                      type="button"
                      onClick={() => setPriceRange([0, maxPrice])}
                      className="ml-2 text-xs text-emerald-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-sm text-emerald-600">
                  Clear all
                </Button>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-800">{activeCount}</span>
                {activeTab === "all" ? (activeCount === 1 ? " crop" : " crops") : activeCount === 1 ? " of your crops" : " of your crops"}
                {searchQuery && (
                  <span className="ml-1">for "{searchQuery}"</span>
                )}
              </div>
              {currentUser && userRole === "farmer" && (
                <Button
                  onClick={() => router.push(`/your-crops/${currentUser}`)}
                  className="h-11 rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700"
                >
                  Manage your crops
                </Button>
              )}
            </div>

            {currentUser && userRole === "farmer" ? (
              <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 rounded-full bg-emerald-50/80 p-1">
                  <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                    All listings
                  </TabsTrigger>
                  <TabsTrigger value="your" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                    Your listings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-6">
                  {renderCropCards(filteredCrops)}
                </TabsContent>
                <TabsContent value="your" className="space-y-6">
                  {renderCropCards(filteredUserCrops)}
                </TabsContent>
              </Tabs>
            ) : (
              renderCropCards(filteredCrops)
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
