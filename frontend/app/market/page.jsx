"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAllCropsQuery } from "@/redux/Service/marketApi";
import { useTranslate } from "@/lib/LanguageContext";
import { getTranslatedCropName } from "@/lib/cropTranslations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Calendar,
  MapPin,
  Phone,
  Package,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MarketPage() {
  const { t, language } = useTranslate();
  const { data: allCrops = [], isLoading, isError } = useGetAllCropsQuery();

  console.log("All Crops Data:", allCrops);
  const router = useRouter();
  const cropsData = allCrops?.data || [];
  const userInfo = useSelector((state) => state.auth.userInfo);
  const currentUser = userInfo?.data?.username;
  const userRole = userInfo?.role;
  const ALL_LOCATIONS_OPTION = "__all__";

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [filteredUserCrops, setFilteredUserCrops] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [userCoords, setUserCoords] = useState(null);
  const [detectedLocation, setDetectedLocation] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [hasManualLocationSelection, setHasManualLocationSelection] =
    useState(false);
  const [detectedLocationDetails, setDetectedLocationDetails] = useState({
    full: "",
    district: "",
    state: "",
  });

  const [filtered, setFiltered] = useState(null);
  const [maxDistance, setMaxDistance] = useState(100);
  const [isAiFiltering, setIsAiFiltering] = useState(false);
  const [aiFilteredCrops, setAiFilteredCrops] = useState(null);
  const [isAiFilterOpen, setIsAiFilterOpen] = useState(false);
  const [aiLimitError, setAiLimitError] = useState(false);

  // Get unique locations for filter dropdown
  const locations = useMemo(() => {
    if (!cropsData) return [];
    return [...new Set(cropsData.map((crop) => crop.location))].filter(Boolean);
  }, [cropsData]);

  useEffect(() => {
    if (!navigator?.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    let isCancelled = false;
    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isCancelled) return;
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError("");
      },
      (error) => {
        if (isCancelled) return;
        setLocationError(error.message || "Unable to retrieve your location.");
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userCoords) return;

    let isCancelled = false;

    const resolveLocation = async () => {
      try {
        const params = new URLSearchParams({
          format: "json",
          lat: userCoords.latitude.toString(),
          lon: userCoords.longitude.toString(),
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to resolve your location.");
        }

        const data = await response.json();
        if (isCancelled) return;

        const locality =
          data?.address?.city ||
          data?.address?.town ||
          data?.address?.village ||
          data?.address?.district ||
          data?.address?.state_district ||
          data?.address?.state ||
          "";

        const district =
          data?.address?.district ||
          data?.address?.state_district ||
          data?.address?.county ||
          "";

        const state =
          data?.address?.state ||
          data?.address?.region ||
          data?.address?.state_district ||
          "";

        const fullAddress = data?.display_name || "";

        const resolvedLocation = locality || district || state || "";

        console.log("Detected address details:", {
          fullAddress,
          locality,
          district,
          state,
        });

        setDetectedLocationDetails({
          full: fullAddress,
          district,
          state,
        });

        if (resolvedLocation) {
          setDetectedLocation(resolvedLocation);
          setLocationError("");
        } else {
          setLocationError("Unable to determine your nearest city.");
        }
      } catch (error) {
        if (!isCancelled) {
          setLocationError(error.message || "Unable to resolve your location.");
        }
      } finally {
        if (!isCancelled) {
          setIsDetectingLocation(false);
        }
      }
    };

    resolveLocation();

    return () => {
      isCancelled = true;
    };
  }, [userCoords]);

  useEffect(() => {
    if (!detectedLocation || !locations.length || hasManualLocationSelection)
      return;

    const normalizedDetected = detectedLocation.toLowerCase();
    const match =
      locations.find((loc) => loc.toLowerCase() === normalizedDetected) ||
      locations.find((loc) => normalizedDetected.includes(loc.toLowerCase())) ||
      locations.find((loc) => loc.toLowerCase().includes(normalizedDetected));

    if (match && match !== selectedLocation) {
      setSelectedLocation(match);
    }
  }, [
    detectedLocation,
    locations,
    hasManualLocationSelection,
    selectedLocation,
  ]);
  console.log("All Crops Data inside useEffect:", allCrops);


const fullAddress = detectedLocationDetails.full;

  // Function to handle AI filtering
  const handleAiFilter = async () => {
    if (!allCrops?.data?.length || !fullAddress) {
      console.warn("Cannot apply AI filter: missing crops data or location");
      return;
    }

    setIsAiFiltering(true);
    try {
      console.log("All Crops Data before AI call:", allCrops);
      console.log("User full address for AI call:", fullAddress);
      console.log("Max distance:", maxDistance);

      const filterRes = await fetch("/api/filter-crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: fullAddress,
          crops: allCrops.data,
          maxDistance: maxDistance,
        }),
      });

      if (!filterRes.ok) {
        throw new Error(`HTTP error! status: ${filterRes.status}`);
      }

      const filteredData = await filterRes.json();
      console.log("Filtered Crops Data from AI:", filteredData);

      if (filteredData.fallback) {
        console.warn("Using fallback: AI service unavailable");
        // Check if it's an API limit error
        if (filteredData.error && 
            (filteredData.error.includes('empty') || 
             filteredData.error.includes('limit') ||
             filteredData.error.includes('429') ||
             filteredData.error.includes('exhausted'))) {
          setAiLimitError(true);
          setAiFilteredCrops(null); // Show all crops by not setting filter
          return;
        }
      }

      setAiLimitError(false);
      // Only set filtered crops if we have results, otherwise show all crops
      if (filteredData.matched && filteredData.matched.length > 0) {
        setAiFilteredCrops(filteredData.matched);
      } else {
        setAiFilteredCrops(null); // Show all crops if no matches
      }
    } catch (error) {
      console.log("Failed to fetch filtered crops:", error);
      // Fallback to showing all crops when error occurs
      setAiFilteredCrops(null); // null means show all crops
      setAiLimitError(true);
    } finally {
      setIsAiFiltering(false);
      setIsAiFilterOpen(false); // Close popup after filtering
    }
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    if (!cropsData.length) return;

    // Use AI-filtered crops for "All Crops" tab only, otherwise use all crops
    const baseData = aiFilteredCrops !== null ? aiFilteredCrops : cropsData;
    let filtered = [...baseData];
    
    // For user crops, always use all cropsData (not AI filtered)
    let userFiltered = [];

    // Filter for user crops if publisher
    if (currentUser) {
      userFiltered = cropsData.filter(
        (crop) => crop.publisher?.username === currentUser
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (crop) =>
          crop.crop_name.toLowerCase().includes(query) ||
          crop.Description?.toLowerCase().includes(query) ||
          crop.location?.toLowerCase().includes(query)
      );
      userFiltered = userFiltered.filter(
        (crop) =>
          crop.crop_name.toLowerCase().includes(query) ||
          crop.Description?.toLowerCase().includes(query) ||
          crop.location?.toLowerCase().includes(query)
      );
    }

    // Apply price filter
    filtered = filtered.filter((crop) => {
      const price = Number.parseFloat(crop.crop_price);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    userFiltered = userFiltered.filter((crop) => {
      const price = Number.parseFloat(crop.crop_price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter((crop) => crop.location === selectedLocation);
      userFiltered = userFiltered.filter(
        (crop) => crop.location === selectedLocation
      );
    }

    setFilteredCrops(filtered);
    setFilteredUserCrops(userFiltered);
  }, [cropsData, searchQuery, priceRange, selectedLocation, currentUser, aiFilteredCrops]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 10000]);
    setSelectedLocation("");
    setIsFilterOpen(false);
    setHasManualLocationSelection(false);
    setAiFilteredCrops(null);
    setMaxDistance(100);
  };

  // Get max price for slider
  const maxPrice = cropsData.length
    ? Math.max(
        ...cropsData.map((crop) => Number.parseFloat(crop.crop_price || 0)),
        10000
      )
    : 10000;

  const renderCropCards = (cropsToRender) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="ml-2">{t('loadingCrops', { en: 'Loading crops...', hi: 'फसलें लोड हो रही हैं...' })}</span>
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-12 text-red-500">
            {t('errorFetchingCrops', { en: 'Error fetching crops. Please try again later.', hi: 'फसलें प्राप्त करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।' })}
          </div>
        ) : cropsToRender.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">
              {t('noCropsFound', { en: 'No crops found matching your criteria.', hi: 'आपके मानदंडों से मेल खाने वाली कोई फसल नहीं मिली।' })}
            </p>
            <Button variant="outline" onClick={resetFilters} className="mt-4">
              {t('resetFilters', { en: 'Reset Filters', hi: 'फ़िल्टर रीसेट करें' })}
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
                  src={
                    crop.crop_image || "/placeholder.svg?height=192&width=384"
                  }
                  alt={crop.crop_name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-green-800">
                    {getTranslatedCropName(crop.crop_name, language)}
                  </CardTitle>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                    ₹{crop.crop_price}
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <Package className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      {t('quantity', { en: 'Quantity', hi: 'मात्रा' })}:{" "}
                      <span className="font-medium">{crop.quantity}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      {t('contact', { en: 'Contact', hi: 'संपर्क' })}:{" "}
                      <span className="font-medium">
                        {crop.publisher_profile?.phoneno}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      {t('location', { en: 'Location', hi: 'स्थान' })}:{" "}
                      <span className="font-medium">{crop.location}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      {t('harvested', { en: 'Harvested', hi: 'कटाई की गई' })}:{" "}
                      <span className="font-medium">{crop.harvested_time}</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-gray-700 line-clamp-2">
                      {crop.Description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-900">{t('marketplace', { en: 'Marketplace', hi: 'बाज़ार' })}</h1>
        {currentUser && userRole === "farmer" && (
          <Button
            onClick={() => router.push(`/your-crops/${currentUser}`)}
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {t('manageYourCrops', { en: 'Manage Your Crops', hi: 'अपनी फसलें प्रबंधित करें' })}
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchCropsPlaceholder', { en: 'Search crops by name, description, location...', hi: 'नाम, विवरण, स्थान से फसलें खोजें...' })}
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
                <span>{t('filters', { en: 'Filters', hi: 'फ़िल्टर' })}</span>
                {(selectedLocation ||
                  priceRange[0] > 0 ||
                  priceRange[1] < maxPrice) && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {(selectedLocation ? 1 : 0) +
                      (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{t('filters', { en: 'Filters', hi: 'फ़िल्टर' })}</h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    {t('reset', { en: 'Reset', hi: 'रीसेट करें' })}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>{t('priceRange', { en: 'Price Range (₹)', hi: 'मूल्य सीमा (₹)' })}</Label>
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
                  <Label>{t('location', { en: 'Location', hi: 'स्थान' })}</Label>
                  <Select
                    value={selectedLocation || ALL_LOCATIONS_OPTION}
                    onValueChange={(value) => {
                      setHasManualLocationSelection(true);
                      if (value === ALL_LOCATIONS_OPTION) {
                        setSelectedLocation("");
                      } else {
                        setSelectedLocation(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectLocation', { en: 'Select location', hi: 'स्थान चुनें' })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_LOCATIONS_OPTION}>
                        {t('allLocations', { en: 'All Locations', hi: 'सभी स्थान' })}
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

          <Popover open={isAiFilterOpen} onOpenChange={setIsAiFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-emerald-50 border-emerald-300 hover:bg-emerald-100"
              >
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">{t('aiFilter', { en: 'AI Filter', hi: 'AI फ़िल्टर' })}</span>
                {aiFilteredCrops !== null && (
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-emerald-600 text-white"
                  >
                    ✓
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-emerald-900">{t('aiLocationFilter', { en: 'AI Location Filter', hi: 'AI स्थान फ़िल्टर' })}</h3>
                  {aiFilteredCrops !== null && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setAiFilteredCrops(null);
                        setIsAiFilterOpen(false);
                      }}
                    >
                      {t('clear', { en: 'Clear', hi: 'साफ़ करें' })}
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-emerald-900 font-medium">{t('currentLocation', { en: 'Current Location', hi: 'वर्तमान स्थान' })}</Label>
                  <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-md">
                    {isDetectingLocation ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('detectingLocation', { en: 'Detecting your location...', hi: 'आपका स्थान खोजा जा रहा है...' })}
                      </span>
                    ) : fullAddress ? (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{fullAddress}</span>
                      </div>
                    ) : (
                      <span className="text-amber-600">{t('locationNotAvailable', { en: 'Location not available', hi: 'स्थान उपलब्ध नहीं' })}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-emerald-900 font-medium">{t('maxDistance', { en: 'Max Distance', hi: 'अधिकतम दूरी' })}: {maxDistance} km</Label>
                  <div className="pt-4">
                    <Slider
                      value={[maxDistance]}
                      max={500}
                      min={10}
                      step={10}
                      onValueChange={(value) => setMaxDistance(value[0])}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>10 km</span>
                    <span>500 km</span>
                  </div>
                </div>

                <Button
                  onClick={handleAiFilter}
                  disabled={!fullAddress || isAiFiltering}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isAiFiltering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('filtering', { en: 'Filtering...', hi: 'फ़िल्टर किया जा रहा है...' })}
                    </>
                  ) : (
                    t('applyFilter', { en: 'Apply Filter', hi: 'फ़िल्टर लागू करें' })
                  )}
                </Button>

                {aiFilteredCrops !== null && (
                  <div className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded-md">
                    ✓ {t('showingCropsWithin', { en: 'Showing', hi: 'दिखाया जा रहा है' })} {aiFilteredCrops.length} {t('cropsWithin', { en: 'crops within', hi: 'फसलें' })} {maxDistance}km
                  </div>
                )}

                {!fullAddress && !isDetectingLocation && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
                    ⚠ {t('locationRequired', { en: 'Location required for AI filter', hi: 'AI फ़िल्टर के लिए स्थान आवश्यक है' })}
                  </div>
                )}

                {aiLimitError && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                    <strong>⚠ {t('aiLimitExceeded', { en: 'AI Limit Exceeded', hi: 'AI सीमा पार' })}</strong>
                    <p className="mt-1">{t('aiLimitMessage', { en: 'The AI service limit has been reached. Please try again later or use the regular filters.', hi: 'AI सेवा की सीमा पहुंच गई है। कृपया बाद में पुनः प्रयास करें या नियमित फ़िल्टर का उपयोग करें।' })}</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active filters */}
        {(selectedLocation ||
          priceRange[0] > 0 ||
          priceRange[1] < maxPrice ||
          aiFilteredCrops !== null) && (
          <div className="flex flex-wrap gap-2">
            {aiFilteredCrops !== null && (
              <Badge variant="default" className="flex items-center gap-1 bg-emerald-600">
                {t('aiFilter', { en: 'AI Filter', hi: 'AI फ़िल्टर' })}: {maxDistance}km ({aiFilteredCrops.length} {t('crops', { en: 'crops', hi: 'फसलें' })})
                <button onClick={() => setAiFilteredCrops(null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedLocation && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('location', { en: 'Location', hi: 'स्थान' })}: {selectedLocation}
                <button
                  onClick={() => {
                    setSelectedLocation("");
                    setHasManualLocationSelection(true);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('price', { en: 'Price', hi: 'मूल्य' })}: ₹{priceRange[0]} - ₹{priceRange[1]}
                <button onClick={() => setPriceRange([0, maxPrice])}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-6"
            >
              {t('clearAll', { en: 'Clear all', hi: 'सब साफ़ करें' })}
            </Button>
          </div>
        )}

        {(isDetectingLocation || detectedLocation || locationError) && (
          <div className="text-sm space-y-1 text-muted-foreground">
            {locationError && <p className="text-amber-600">{locationError}</p>}
          </div>
        )}
      </div>

      {/* Results count and tabs */}
      <div className="mb-4 text-muted-foreground">
        {!isLoading && (
          <p>
            {t('showing', { en: 'Showing', hi: 'दिखाया जा रहा है' })}{" "}
            {activeTab === "all"
              ? filteredCrops.length
              : filteredUserCrops.length}
            {activeTab === "all"
              ? filteredCrops.length === 1
                ? t('crop', { en: ' crop', hi: ' फसल' })
                : t('crops', { en: ' crops', hi: ' फसलें' })
              : filteredUserCrops.length === 1
              ? t('yourCrop', { en: ' your crop', hi: ' आपकी फसल' })
              : t('yourCrops', { en: ' your crops', hi: ' आपकी फसलें' })}
            {searchQuery && ` ${t('for', { en: 'for', hi: 'के लिए' })} "${searchQuery}"`}
          </p>
        )}
      </div>

      {currentUser && userRole === "farmer" ? (
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all">{t('allCrops', { en: 'All Crops', hi: 'सभी फसलें' })}</TabsTrigger>
            <TabsTrigger value="your">{t('yourCrops', { en: 'Your Crops', hi: 'आपकी फसलें' })}</TabsTrigger>
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
  );
}
