"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/Service/profileApi";
import {
  useGetRatingQuery,
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "@/redux/Service/ratingApi";
import {
  useGetAllContractsQuery,
  useGetPaymentsQuery,
} from "@/redux/Service/contract";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Star,
  CreditCard,
  User,
  Shield,
  Crop,
  Trash2,
  Edit,
  Camera,
  MapPin,
  PhoneIcon,
  Calendar,
  CheckCircle,
  Clock,
  ArrowLeft,
  MessageSquare,
  ImageIcon,
  Package,
  Phone,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useCreateRoomMutation,
  useGetRoomsQuery,
} from "@/redux/Service/chatApi";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Webcam from "react-webcam";
import Link from "next/link";
import { useGetCropsQuery } from "@/redux/Service/cropApi";
import { useGetAllDemandsQuery } from "@/redux/Service/demandApi";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/LanguageContext";
import { getTranslatedCropName } from "@/lib/cropTranslations";

export default function ProfilePage() {
  const { t, language } = useTranslate();
  const router = useRouter();
  const { username } = useParams();
  const { data, isLoading: cropLoading } = useGetCropsQuery(username);
  const {
    data: demands = [],
    isLoading: demandLoading,
    isError,
  } = useGetAllDemandsQuery(username);
  console.log(demands);

  const { data: payments, isLoading: paymentLoading } = useGetPaymentsQuery();
  const crops = Array.isArray(data) ? data : [];
  console.log(data);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const {
    data: profile,
    error,
    isLoading,
    refetch,
  } = useGetProfileQuery(username);
  const { data: ratings, refetch: refetchRatings } =
    useGetRatingQuery(username);
  const { data: contracts } = useGetAllContractsQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [createRating] = useCreateRatingMutation();
  const [deleteRating] = useDeleteRatingMutation();
  const [updateRating] = useUpdateRatingMutation();
  const { data: rooms } = useGetRoomsQuery();
  const [createRoom] = useCreateRoomMutation();

  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [hasRated, setHasRated] = useState(false);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const currentUser = userInfo?.data.username;
  const userRole = userInfo?.role;

  // Edit Profile State
  const [editOpen, setEditOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const webcamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const generateColor = (name) => {
    const colors = [
      "from-emerald-400 to-green-600",
      "from-amber-400 to-orange-600",
      "from-rose-400 to-red-600",
      "from-yellow-300 to-amber-500",
      "from-sky-400 to-blue-600",
      "from-violet-400 to-purple-600",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
 
  
 
  const handleEditClick = () => {
    setPhone(profile?.data.phoneno || "");
    setAddress(profile?.data.address || "");
    setProfilePic(profile?.data.image || "");
    setEditOpen(true);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setProfilePic(imageSrc);
  };

  const handleProfileSubmit = async () => {
    setIsUpdatingProfile(true);
    try {
      const data = new FormData();
      data.append("phoneno", phone);
      data.append("address", address);
  
      // Convert base64 to File object if it's a data URI
      if (profilePic && profilePic.startsWith("data:image")) {
        const blob = dataURItoBlob(profilePic);
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        data.append("image", file);
      }
  
    
  
      await updateProfile(data).unwrap();
      refetch();
      setEditOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  // Helper function to convert data URI to Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
  const handleChatClick = async () => {
    if (rooms?.data?.some((room) => room.chat_user === username)) {
      router.push(`/chat/${username}`);
    } else {
      try {
        await createRoom(username).unwrap();
        router.push(`/chat/${username}`);
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  };

  // Check if the current user has already rated the profile user
  useEffect(() => {
    if (ratings) {
      const currentUser = userInfo?.data.username;
      const hasRated =
        ratings.data.some((r) => r.rating_user === currentUser) ||
        username == currentUser;
      setHasRated(hasRated);
    }
  }, [ratings, userInfo, username]);

  const handleRatingSubmit = async () => {
    const imageToSend = images[0]; // Send only the first image

    const formData = new FormData();
    formData.append("rated_user", username);
    formData.append("description", description);
    formData.append("rate", rating);
    if (imageToSend) {
      formData.append("images", imageToSend); // Append the image file
    }

    try {
      await createRating({ ratingData: formData }).unwrap();
      refetchRatings();
      setRating(0); // Reset rating
      setDescription(""); // Reset description
      setImages([]); // Reset images
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 1) {
      alert("Only one image can be uploaded. The first image will be used.");
    }
    setImages([files[0]]); // Store only the first image
  };

  // Handle delete rating
  const handleDeleteRating = async (ratingId) => {
    try {
      await deleteRating(ratingId).unwrap(); // Call delete mutation
      refetchRatings(); // Refetch ratings after deletion
    } catch (error) {
      console.error("Failed to delete rating:", error);
    }
  };

  // Handle update rating
  const handleUpdateRating = async (ratingId) => {
    const imageToSend = images[0]; // Send only the first image

    const updatedRatingData = {
      description,
      rate: rating,
      images: imageToSend, // Send a single image
    };

    try {
      await updateRating({ ratingId, updatedRatingData }).unwrap(); // Call update mutation
      refetchRatings(); // Refetch ratings after update
      setEditingRatingId(null); // Reset editing state
      setRating(0); // Reset rating
      setDescription(""); // Reset description
      setImages([]); // Reset images
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!ratings?.data || ratings.data.length === 0) return 0;
    const sum = ratings.data.reduce((acc, curr) => acc + curr.rate, 0);
    return (sum / ratings.data.length).toFixed(1);
  };

  // Count ratings by star value
  const countRatingsByValue = (value) => {
    if (!ratings?.data) return 0;
    return ratings.data.filter((r) => r.rate === value).length;
  };

  // Calculate percentage for rating bar
  const calculateRatingPercentage = (value) => {
    if (!ratings?.data || ratings.data.length === 0) return 0;
    return (countRatingsByValue(value) / ratings.data.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-green-800 font-medium">
            {t('loadingProfile', { en: 'Loading profile...', hi: 'प्रोफ़ाइल लोड हो रही है...' })}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            {t('profileNotFound', { en: 'Profile Not Found', hi: 'प्रोफ़ाइल नहीं मिला' })}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('profileNotFoundDesc', { en: 'We couldn\'t find the profile you\'re looking for.', hi: 'हम आपके द्वारा खोजी जा रही प्रोफ़ाइल नहीं पा सके।' })}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-red-600 hover:bg-red-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('goBack', { en: 'Go Back', hi: 'वापस जाएं' })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-16">
      {/* Back Navigation */}

      {/* Profile Header */}
      <div className="bg-white shadow-md mb-8">
        <div className="mx-auto max-w-7xl px-4 py-8 ">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="rounded-full p-1 bg-gradient-to-r from-green-400 to-green-600">
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarImage
                    src={profile?.data.image || "/profile.jpg"}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-green-100 text-green-800 text-4xl">
                    {profile?.data.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              {currentUser === username && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white shadow-md hover:bg-green-50"
                  onClick={handleEditClick}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {t('change', { en: 'Change', hi: 'बदलें' })}
                </Button>
              )}

              {/* Rating Badge */}
              {ratings?.data && ratings.data.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-white">
                  <div className="flex items-center">
                    <span className="font-bold text-xs">
                      {calculateAverageRating()}
                    </span>
                    <Star className="w-3 h-3 ml-0.5 fill-yellow-900" />
                  </div>
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-green-800 mb-1">
                    {profile?.data.name || "N/A"}
                  </h1>
                  <p className="text-gray-600 mb-2">
                    @{profile?.data?.user.username}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <PhoneIcon className="w-4 h-4 mr-2 text-green-600" />
                      <span>+91 {profile?.data.phoneno || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span>{profile?.data.address || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-start mt-4 md:mt-0">
                  {profile.role && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                      {profile.role === "farmer" ? t('farmer', { en: 'Farmer', hi: 'किसान' }) : t('contractor', { en: 'Contractor', hi: 'ठेकेदार' })}
                    </Badge>
                  )}
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
                    {t('verified', { en: 'Verified', hi: 'सत्यापित' })}
                  </Badge>
                </div>
                </div>

                
              </div>

              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                {currentUser === username && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={handleEditClick}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t('editProfile', { en: 'Edit Profile', hi: 'प्रोफ़ाइल संपादित करें' })}
                  </Button>
                )}
                {currentUser===username &&(
                userRole === "farmer" ? (
                  <Button
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={() => router.push(`/your-crops/${currentUser}`)}
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    {t('yourCrops', { en: 'Your Crops', hi: 'आपकी फसलें' })}
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={() => router.push(`/crop-demand/${currentUser}`)}
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    {t('yourDemands', { en: 'Your Demands', hi: 'आपकी मांगें' })}
                  </Button>
                ))}
                {currentUser !== username && (
                  <Button
                    onClick={handleChatClick}
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t('chat', { en: 'Chat', hi: 'चैट' })}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editProfile', { en: 'Edit Profile', hi: 'प्रोफ़ाइल संपादित करें' })}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('phoneNumber', { en: 'Phone Number', hi: 'फ़ोन नंबर' })}
              </label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('enterPhoneNumber', { en: 'Enter phone number', hi: 'फ़ोन नंबर दर्ज करें' })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('address', { en: 'Address', hi: 'पता' })}</label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('enterAddress', { en: 'Enter address', hi: 'पता दर्ज करें' })}
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium mb-2">
                {t('profilePicture', { en: 'Profile Picture', hi: 'प्रोफ़ाइल चित्र' })}
              </label>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-40 h-40 rounded-lg mb-2"
              />
              <Button
                onClick={handleCapture}
                className="bg-blue-600 hover:bg-blue-700 mb-2"
              >
                {t('capturePhoto', { en: 'Capture Photo', hi: 'फोटो खींचें' })}
              </Button>
              {profilePic && (
                <img
                  src={profilePic || "/placeholder.svg"}
                  alt="Captured"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
            </div>
        
          </div>
          <DialogFooter>
            <Button
              onClick={handleProfileSubmit}
              className="bg-green-600 hover:bg-green-700"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('saving', { en: 'Saving...', hi: 'सहेजा जा रहा है...' })}
                </>
              ) : (
                t('saveChanges', { en: 'Save Changes', hi: 'परिवर्तन सहेजें' })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 ">
        {/* Tabbed Navigation */}
        <Tabs defaultValue="reviews" className="w-full">
          <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
            {username === currentUser ? (
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {t('reviews', { en: 'Reviews', hi: 'समीक्षाएं' })}
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {t('documents', { en: 'Documents', hi: 'दस्तावेज़' })}
                </TabsTrigger>
                <TabsTrigger
                  value="contracts"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t('contracts', { en: 'Contracts', hi: 'अनुबंध' })}
                </TabsTrigger>
                <TabsTrigger
                  value="payments"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t('payments', { en: 'Payments', hi: 'भुगतान' })}
                </TabsTrigger>
              </TabsList>
            ) : (
              <TabsList className="grid w-full grid-cols-2 gap-2">
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {t('reviews', { en: 'Reviews', hi: 'समीक्षाएं' })}
                </TabsTrigger>

                {profile.role === "farmer" ? (
                  <TabsTrigger
                    value="Crops"
                    className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    {t('crops', { en: 'Crops', hi: 'फसलें' })}
                  </TabsTrigger>
                ) : (
                  <TabsTrigger
                    value="Demands"
                    className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    {t('demands', { en: 'Demands', hi: 'मांगें' })}
                  </TabsTrigger>
                )}
              </TabsList>
            )}
          </div>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rating Summary */}
              <Card className="lg:col-span-1 border-0 shadow-md overflow-hidden h-fit">
                <CardHeader className="bg-green-50 border-b border-green-100">
                  <CardTitle className="flex items-center text-green-800">
                    <Star className="w-5 h-5 mr-2 fill-yellow-400 stroke-yellow-500" />
                    {t('ratingSummary', { en: 'Rating Summary', hi: 'रेटिंग सारांश' })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {ratings?.data && ratings.data.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-green-800">
                            {calculateAverageRating()}
                          </div>
                          <div className="flex items-center justify-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(calculateAverageRating())
                                    ? "fill-yellow-400 stroke-yellow-400"
                                    : "fill-gray-200 stroke-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-500 mt-2">
                            {ratings.data.length} {t('reviewsCount', { en: 'reviews', hi: 'समीक्षाएं' })}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((value) => (
                          <div key={value} className="flex items-center gap-2">
                            <div className="w-8 text-right">{value}</div>
                            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                            <div className="flex-1">
                              <Progress
                                value={calculateRatingPercentage(value)}
                                className="h-2"
                              />
                            </div>
                            <div className="w-8 text-gray-500 text-sm">
                              {countRatingsByValue(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Star className="w-12 h-12 mx-auto stroke-gray-300 mb-2" />
                      <p className="text-gray-500">{t('noRatingsYet', { en: 'No ratings yet', hi: 'अभी कोई रेटिंग नहीं' })}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Add Review Form */}
                {!hasRated && (
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="bg-green-50 border-b border-green-100">
                      <CardTitle className="text-green-800">
                        {t('writeReview', { en: 'Write a Review', hi: 'समीक्षा लिखें' })}
                      </CardTitle>
                      <CardDescription>
                        {t('shareExperience', { en: 'Share your experience with', hi: 'के साथ अपना अनुभव साझा करें' })} {profile?.data.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {t('yourRating', { en: 'Your Rating', hi: 'आपकी रेटिंग' })}
                          </label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <TooltipProvider key={star}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => setRating(star)}
                                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                    >
                                      <Star
                                        className={`w-8 h-8 ${
                                          star <= rating
                                            ? "fill-yellow-400 stroke-yellow-400"
                                            : "stroke-gray-300"
                                        } transition-colors`}
                                      />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {star === 1 && t('poor', { en: 'Poor', hi: 'खराब' })}
                                    {star === 2 && t('fair', { en: 'Fair', hi: 'ठीक' })}
                                    {star === 3 && t('average', { en: 'Average', hi: 'सामान्य' })}
                                    {star === 4 && t('good', { en: 'Good', hi: 'अच्छा' })}
                                    {star === 5 && t('excellent', { en: 'Excellent', hi: 'उत्कृष्ट' })}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {t('yourReview', { en: 'Your Review', hi: 'आपकी समीक्षा' })}
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('shareDetails', { en: 'Share details of your experience with this person...', hi: 'इस व्यक्ति के साथ अपने अनुभव का विवरण साझा करें...' })}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none min-h-[120px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {t('addPhotoOptional', { en: 'Add Photo (Optional)', hi: 'फ़ोटो जोड़ें (वैकल्पिक)' })}
                          </label>
                          <div className="flex items-center space-x-4">
                            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">
                                {t('addImage', { en: 'Add Image', hi: 'चित्र जोड़ें' })}
                              </span>
                            </label>
                            {images.length > 0 && (
                              <div className="relative">
                                <img
                                  src={
                                    URL.createObjectURL(images[0]) ||
                                    "/placeholder.svg"
                                  }
                                  alt="Preview"
                                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => setImages([])}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
                      <Button
                        className="ml-auto bg-green-600 hover:bg-green-700"
                        onClick={handleRatingSubmit}
                        disabled={rating === 0 || !description.trim()}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {t('submitReview', { en: 'Submit Review', hi: 'समीक्षा जमा करें' })}
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                {/* Reviews List */}
                {ratings?.data && ratings.data.length > 0 ? (
                  <div className="space-y-6">
                    {ratings.data.map((rating, index) => (
                      <Card
                        key={index}
                        className="border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {rating.rating_user?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-800">
                                    {rating.rating_user}
                                  </h3>
                                  <div className="flex items-center mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= rating.rate
                                            ? "fill-yellow-400 stroke-yellow-400"
                                            : "fill-gray-200 stroke-gray-200"
                                        }`}
                                      />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">
                                      {new Date().toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Edit and delete buttons */}
                                {userInfo?.data.username ===
                                  rating.rating_user && (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-500 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => {
                                        setEditingRatingId(rating.id);
                                        setRating(rating.rate);
                                        setDescription(rating.description);
                                        setImages(
                                          rating.images ? [rating.images] : []
                                        );
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() =>
                                        handleDeleteRating(rating.id)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <div className="mt-3 text-gray-700">
                                <p>{rating.description}</p>
                              </div>

                              {rating.rating_images && (
                                <div className="mt-4">
                                  <img
                                    src={rating.rating_images[0].image || "/placeholder.svg"}
                                    alt="Rating Image"
                                    className="rounded-lg max-h-64 object-cover border border-gray-200"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Edit form for the selected rating */}
                          {editingRatingId === rating.id && (
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                              <h4 className="font-medium text-green-800">
                                {t('editYourReview', { en: 'Edit Your Review', hi: 'अपनी समीक्षा संपादित करें' })}
                              </h4>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  {t('updateRating', { en: 'Update Rating', hi: 'रेटिंग अपडेट करें' })}
                                </label>
                                <div className="flex items-center space-x-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRating(star)}
                                      className="w-8 h-8 rounded-full flex items-center justify-center"
                                    >
                                      <Star
                                        className={`w-5 h-5 ${
                                          star <= rating
                                            ? "fill-yellow-400 stroke-yellow-400"
                                            : "stroke-gray-300"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  {t('updateDescription', { en: 'Update Description', hi: 'विवरण अपडेट करें' })}
                                </label>
                                <textarea
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                  rows="4"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  {t('updateImageOptional', { en: 'Update Image (Optional)', hi: 'चित्र अपडेट करें (वैकल्पिक)' })}
                                </label>
                                <div className="flex items-center space-x-4">
                                  <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="hidden"
                                    />
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                  </label>
                                  {images.length > 0 &&
                                    images[0] instanceof File && (
                                      <img
                                        src={
                                          URL.createObjectURL(images[0]) ||
                                          "/placeholder.svg"
                                        }
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded-lg"
                                      />
                                    )}
                                </div>
                              </div>

                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingRatingId(null)}
                                  className="border-gray-300"
                                >
                                  {t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}
                                </Button>
                                <Button
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleUpdateRating(rating.id)}
                                >
                                  {t('updateReview', { en: 'Update Review', hi: 'समीक्षा अपडेट करें' })}
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-8 text-center">
                      <Star className="w-12 h-12 mx-auto stroke-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">
                        {t('noReviewsYet', { en: 'No Reviews Yet', hi: 'अभी कोई समीक्षा नहीं' })}
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        {t('noReviewsDesc', { en: 'This user hasn\'t received any reviews yet. Be the first to share your experience!', hi: 'इस उपयोगकर्ता को अभी तक कोई समीक्षा नहीं मिली है। अपना अनुभव साझा करने वाले पहले व्यक्ति बनें!' })}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-800">
                  <Shield className="w-5 h-5 mr-2" />
                  {t('verificationDocuments', { en: 'Verification Documents', hi: 'सत्यापन दस्तावेज़' })}
                </CardTitle>
                <CardDescription>
                  {t('viewManageDocuments', { en: 'View and manage your verification documents', hi: 'अपने सत्यापन दस्तावेज़ों को देखें और प्रबंधित करें' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile?.data.aadhar_image ? (
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                      <CardHeader className="bg-blue-50 p-4">
                        <CardTitle className="text-lg flex items-center text-blue-800">
                          <FileText className="w-5 h-5 mr-2 text-blue-600" />
                          {t('aadharCard', { en: 'Aadhar Card', hi: 'आधार कार्ड' })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="aspect-video relative rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={
                              profile.data.aadhar_image || "/placeholder.svg"
                            }
                            alt="Aadhar Card"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {t('verified', { en: 'Verified', hi: 'सत्यापित' })}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gray-50 p-4">
                        <CardTitle className="text-lg flex items-center text-gray-700">
                          <FileText className="w-5 h-5 mr-2 text-gray-500" />
                          Aadhar Card
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500 mb-4">
                          {t('noAadharUploaded', { en: 'No Aadhar card uploaded', hi: 'कोई आधार कार्ड अपलोड नहीं किया गया' })}
                        </p>
                        {currentUser === username && (
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Shield className="w-4 h-4 mr-2" />
                            {t('uploadDocument', { en: 'Upload Document', hi: 'दस्तावेज़़ अपलोड करें' })}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {profile?.data.screenshot ? (
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                      <CardHeader className="bg-purple-50 p-4">
                        <CardTitle className="text-lg flex items-center text-purple-800">
                          <FileText className="w-5 h-5 mr-2 text-purple-600" />
                          {t('screenshot', { en: 'Screenshot', hi: 'स्क्रीनशॉट' })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="aspect-video relative rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={profile.data.screenshot || "/placeholder.svg"}
                            alt="Screenshot"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gray-50 p-4">
                        <CardTitle className="text-lg flex items-center text-gray-700">
                          <FileText className="w-5 h-5 mr-2 text-gray-500" />
                          Screenshot
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500 mb-4">
                          {t('noScreenshotUploaded', { en: 'No screenshot uploaded', hi: 'कोई स्क्रीनशॉट अपलोड नहीं किया गया' })}
                        </p>
                        {currentUser === username && (
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Shield className="w-4 h-4 mr-2" />
                            Upload Document
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-800">
                  <FileText className="w-5 h-5 mr-2" />
                  {t('contractDetails', { en: 'Contract Details', hi: 'अनुबंध विवरण' })}
                </CardTitle>
                <CardDescription>
                  {t('manageContracts', { en: 'Manage your ongoing and past contracts', hi: 'अपने चल रहे और पिछले अनुबंधों का प्रबंधन करें' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {contracts?.data && contracts.data.length > 0 ? (
                    contracts.data.map((contract) => (
                      <Card
                        key={contract.contract_id}
                        className="border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <CardHeader className="p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                              Contract #{contract.contract_id.substring(0, 8)}
                            </CardTitle>
                            <Badge
                              className={
                                contract.status
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }
                            >
                              {contract.status ? t('active', { en: 'Active', hi: 'सक्रिय' }) : t('pending', { en: 'Pending', hi: 'लंबित' })}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium text-gray-700">
                                {t('contractDetails', { en: 'Contract Details', hi: 'अनुबंध विवरण' })}
                              </h3>
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center text-gray-600">
                                  <User className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>{t('farmer', { en: 'Farmer', hi: 'किसान' })}: {contract.farmer_name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <User className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>{t('buyer', { en: 'Buyer', hi: 'खरीददार' })}: {contract.buyer_name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>
                                    {t('deliveryDate', { en: 'Delivery Date', hi: 'डिलीवरी तिथि' })}:{" "}
                                    {new Date(
                                      contract.delivery_date
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>
                                    {t('created', { en: 'Created', hi: 'बनाया गया' })}:{" "}
                                    {new Date(
                                      contract.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-700">
                                {t('financialDetails', { en: 'Financial Details', hi: 'वित्तीय विवरण' })}
                              </h3>
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center text-gray-600">
                                  <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>
                                    {t('price', { en: 'Price', hi: 'मूल्य' })}: ₹
                                    {contract.nego_price.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Crop className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>{t('crop', { en: 'Crop', hi: 'फसल' })}: {contract.crop_name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>
                                    {t('deliveryAddress', { en: 'Delivery Address', hi: 'डिलीवरी पता' })}:{" "}
                                    {contract.delivery_address}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>
                                    {t('quantity', { en: 'Quantity', hi: 'मात्रा' })}: {contract.quantity} {t('units', { en: 'units', hi: 'इकाइयां' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                          <Link href="/contracts">
                            <Button variant="outline" className="ml-auto">
                              <FileText className="w-4 h-4 mr-2" />
                              {t('viewDetails', { en: 'View Details', hi: 'विवरण देखें' })}
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">
                        {t('noContractsFound', { en: 'No Contracts Found', hi: 'कोई अनुबंध नहीं मिला' })}
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        {t('noContractsDesc', { en: 'There are no contracts associated with this account yet.', hi: 'इस खाते से अभी तक कोई अनुबंध नहीं जुड़ा है।' })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          {/* Payments Tab */}
          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-800">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t('paymentHistory', { en: 'Payment History', hi: 'भुगतान इतिहास' })}
                </CardTitle>
                <CardDescription>
                  {t('viewAllPayments', { en: 'View all payment transactions made and received', hi: 'किए गए और प्राप्त सभी भुगतान लेन-देन देखें' })}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                {paymentLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                  </div>
                ) : payments?.data && payments.data.length > 0 ? (
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left p-3 text-gray-700">
                              {t('paymentID', { en: 'Payment ID', hi: 'भुगतान ID' })}
                            </th>
                            <th className="text-left p-3 text-gray-700">
                              {t('date', { en: 'Date', hi: 'तारीख' })}
                            </th>
                            <th className="text-left p-3 text-gray-700">
                              {t('description', { en: 'Description', hi: 'विवरण' })}
                            </th>
                            <th className="text-left p-3 text-gray-700">
                              {t('amount', { en: 'Amount', hi: 'राशि' })}
                            </th>
                            {userRole === "farmer" && (
                              <th className="text-left p-3 text-gray-700">
                                {t('buyer', { en: 'Buyer', hi: 'खरीददार' })}
                              </th>
                            )}
                            {userRole === "contractor" && (
                              <th className="text-left p-3 text-gray-700">
                                {t('farmer', { en: 'Farmer', hi: 'किसान' })}
                              </th>
                            )}
                            {userRole !== "farmer" &&
                              userRole !== "contractor" && (
                                <>
                                  <th className="text-left p-3 text-gray-700">
                                    {t('from', { en: 'From', hi: 'से' })}
                                  </th>
                                  <th className="text-left p-3 text-gray-700">
                                    {t('to', { en: 'To', hi: 'तक' })}
                                  </th>
                                </>
                              )}
                            <th className="text-left p-3 text-gray-700">
                              {t('receipt', { en: 'Receipt', hi: 'रसीद' })}
                            </th>
                            <th className="text-left p-3 text-gray-700">
                              {t('actions', { en: 'Actions', hi: 'कार्रवाई' })}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.data.map((payment) => (
                            <tr
                              key={payment.id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              <td className="p-3 text-gray-700">
                                PAY-{payment.id.toString().slice(-6)}
                              </td>
                              <td className="p-3 text-gray-700">
                                {new Date(payment.date).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-gray-700">
                                {payment.description}
                              </td>
                              <td className="p-3 text-gray-700 font-medium">
                                ₹{payment.amount.toLocaleString()}
                              </td>
                              {userRole === "farmer" && (
                                <td className="p-3 text-gray-700">
                                  <Badge
                                    variant="outline"
                                    className="border-blue-200"
                                  >
                                    {payment.buyer}
                                  </Badge>
                                </td>
                              )}
                              {userRole === "contractor" && (
                                <td className="p-3 text-gray-700">
                                  <Badge
                                    variant="outline"
                                    className="border-green-200"
                                  >
                                    {payment.farmer}
                                  </Badge>
                                </td>
                              )}
                              {userRole !== "farmer" &&
                                userRole !== "contractor" && (
                                  <>
                                    <td className="p-3 text-gray-700">
                                      <Badge
                                        variant="outline"
                                        className="border-blue-200"
                                      >
                                        {payment.buyer}
                                      </Badge>
                                    </td>
                                    <td className="p-3 text-gray-700">
                                      <Badge
                                        variant="outline"
                                        className="border-green-200"
                                      >
                                        {payment.farmer}
                                      </Badge>
                                    </td>
                                  </>
                                )}
                              <td className="p-3">
                                {payment.receipt ? (
                                  <a
                                    href={payment.receipt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-sm"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    {t('viewReceipt', { en: 'View Receipt', hi: 'रसीद देखें' })}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">
                                    {t('noReceipt', { en: 'No receipt', hi: 'कोई रसीद नहीं' })}
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="ghost"
                                  size=""
                                  className="text-gray-900 hover:text-green-700"
                                  onClick={() =>
                                    router.push(`/contract/${payment.contract}`)
                                  }
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  {t('viewContract', { en: 'View Contract', hi: 'अनुबंध देखें' })}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userRole !== "farmer" && (
                        <Card className="border border-green-100">
                          <CardHeader className="bg-green-50 p-4">
                            <CardTitle className="text-green-800 text-lg">
                              {t('totalPaymentsMade', { en: 'Total Payments Made', hi: 'कुल भुगतान किया गया' })}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="text-3xl font-bold text-green-700">
                              ₹
                              {payments.data
                                .filter((p) => p.buyer === currentUser)
                                .reduce(
                                  (sum, payment) => sum + payment.amount,
                                  0
                                )
                                .toLocaleString()}
                            </div>
                            <p className="text-gray-500 mt-2">
                              {
                                payments.data.filter(
                                  (p) => p.buyer === currentUser
                                ).length
                              }{" "}
                              {t('transactions', { en: 'transactions', hi: 'लेन-देन' })}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {userRole !== "contractor" && (
                        <Card className="border border-blue-100">
                          <CardHeader className="bg-blue-50 p-4">
                            <CardTitle className="text-blue-800 text-lg">
                              {t('totalPaymentsReceived', { en: 'Total Payments Received', hi: 'कुल भुगतान प्राप्त हुआ' })}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="text-3xl font-bold text-blue-700">
                              ₹
                              {payments.data
                                .filter((p) => p.farmer === currentUser)
                                .reduce(
                                  (sum, payment) => sum + payment.amount,
                                  0
                                )
                                .toLocaleString()}
                            </div>
                            <p className="text-gray-500 mt-2">
                              {
                                payments.data.filter(
                                  (p) => p.farmer === currentUser
                                ).length
                              }{" "}
                              transactions
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      {t('noPaymentHistory', { en: 'No Payment History', hi: 'कोई भुगतान इतिहास नहीं' })}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {t('noPaymentHistoryDesc', { en: 'There are no payment transactions recorded yet.', hi: 'अभी तक कोई भुगतान लेन-देन दर्ज नहीं किया गया है।' })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {profile.role === "farmer" ? (
            <TabsContent value="Crops">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crops.map((crop) => (
                  <Card
                    key={crop.crop_id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/crop/${crop?.crop_id}`}>
                      <CardHeader>
                        <img
                          src={crop.crop_image}
                          alt={crop.crop_name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-xl">
                          {getTranslatedCropName(crop.crop_name, language)}
                        </CardTitle>
                        <div className="space-y-2 mt-4">
                          <p className="text-green-600 font-semibold">
                            ₹{crop.crop_price}/{t('kg', { en: 'kg', hi: 'किलो' })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t('quantity', { en: 'Quantity', hi: 'मात्रा' })}: {crop.quantity} {t('kg', { en: 'Kg', hi: 'किलो' })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t('location', { en: 'Location', hi: 'स्थान' })}: {crop.location}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t('harvested', { en: 'Harvested', hi: 'कटाई' })}: {crop.harvested_time}
                          </p>
                          <p className="text-gray-700">{crop.Description}</p>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ) : (
            <TabsContent value="Demands">
              {/* List of Demands */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  <span className="ml-2 text-lg text-gray-600">
                    {t('loadingDemands', { en: 'Loading demands...', hi: 'मांगें लोड हो रही हैं...' })}
                  </span>
                </div>
              ) : isError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600">
                    {t('errorFetchingDemands', { en: 'Error fetching demands. Please try again later.', hi: 'मांगें प्राप्त करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।' })}
                  </p>
                </div>
              ) : demands.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-600 mb-4">
                    {t('noCropDemands', { en: 'No crop demands available yet.', hi: 'अभी तक कोई फसल मांग उपलब्ध नहीं।' })}
                  </p>
                  <Button
                    onClick={() => setOpenDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {t('createFirstDemand', { en: 'Create Your First Demand', hi: 'अपनी पहली मांग बनाएं' })}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {demands?.data.map((demand) => (
                    <Card
                      key={demand.id}
                      onClick={() => router.push(`/demand/${demand.demand_id}`)}
                      className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
                    >
                      <CardHeader className="p-0">
                        <div
                          className={`w-full h-52 cursor-pointer  flex items-center justify-center bg-gradient-to-br ${generateColor(
                            demand.crop_name
                          )} text-white group-hover:scale-[1.02] transition-transform duration-300 ease-out`}
                        >
                          <div className="text-center p-6 backdrop-blur-[2px] backdrop-brightness-90 w-full h-full flex flex-col items-center justify-center">
                            <h2 className="text-4xl font-bold tracking-tight mb-1">
                              {getTranslatedCropName(demand.crop_name, language)}
                            </h2>
                            <p className="text-lg opacity-90 font-medium">
                              {t('premiumQuality', { en: 'Premium Quality', hi: 'प्रीमियम गुणवत्ता' })}
                            </p>
                            <div className="mt-3 px-5 py-1.5 bg-white/20 rounded-full inline-block backdrop-blur-sm text-sm">
                              {t('freshHarvest', { en: 'Fresh Harvest', hi: 'ताज़ी कटाई' })}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 pb-4">
                        <div className="flex justify-between items-start mb-4">
                          <CardTitle className="text-2xl text-green-800">
                            {getTranslatedCropName(demand.crop_name, language)}
                          </CardTitle>
                          <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                            ₹{demand.crop_price}
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <div className="flex items-start">
                            <Package className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                            <p className="text-gray-700">
                              {t('quantity', { en: 'Quantity', hi: 'मात्रा' })}:{" "}
                              <span className="font-medium">
                                {demand.quantity}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-start">
                            <Phone className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                            <p className="text-gray-700">
                              {t('contact', { en: 'Contact', hi: 'संपर्क' })}:{" "}
                              <span className="font-medium">
                                {demand.contact_no}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                            <p className="text-gray-700">
                              {t('location', { en: 'Location', hi: 'स्थान' })}:{" "}
                              <span className="font-medium">
                                {demand.location}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-start">
                            <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                            <p className="text-gray-700">
                              {t('harvested', { en: 'Harvested', hi: 'कटाई' })}:{" "}
                              <span className="font-medium">
                                {demand.harvested_time}
                              </span>
                            </p>
                          </div>

                          <div className="pt-2">
                            <p className="text-gray-700 line-clamp-2">
                              {demand.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
