"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/Service/profileApi";
import {
  useGetRatingQuery,
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingImageMutation,
  useAddRatingImageMutation,
} from "@/redux/Service/ratingApi";
import {
  useGetAllContractsQuery,
  useGetPaymentsQuery,
} from "@/redux/Service/contract";
import {
  useCreateRoomMutation,
  useGetRoomsQuery,
} from "@/redux/Service/chatApi";
import { useGetCropsQuery } from "@/redux/Service/cropApi";
import { useGetAllDemandsQuery } from "@/redux/Service/demandApi";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/lib/LanguageContext";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { EditProfileDialog } from "@/components/Profile/EditProfileDialog";
import { ProfileTabs } from "@/components/Profile/ProfileTabs";
import { RatingSummaryCard } from "@/components/Profile/RatingSummaryCard";
import { AddReviewForm } from "@/components/Profile/AddReviewForm";
import { ReviewsList } from "@/components/Profile/ReviewsList";
import { EditRatingDialog } from "@/components/Profile/EditRatingDialog";
import { DocumentsTab } from "@/components/Profile/DocumentsTab";
import { ContractsTab } from "@/components/Profile/ContractsTab";
import { PaymentsTab } from "@/components/Profile/PaymentsTab";
import { CropsTab } from "@/components/Profile/CropsTab";
import { DemandsTab } from "@/components/Profile/DemandsTab";
import { LoadingState, ErrorState } from "@/components/Profile/ProfileStates";

export default function ProfilePage() {
  const { t, language } = useTranslate();
  const router = useRouter();
  const { username } = useParams();
  
  // RTK Queries
  const { data: cropsData, isLoading: cropLoading } = useGetCropsQuery(username);
  const { data: demands = [], isLoading: demandLoading, isError } = useGetAllDemandsQuery(username);
  const { data: payments, isLoading: paymentLoading } = useGetPaymentsQuery();
  const { data: profile, error, isLoading, refetch } = useGetProfileQuery(username);
  const { data: ratings, refetch: refetchRatings } = useGetRatingQuery(username);
  const { data: contracts } = useGetAllContractsQuery();
  const { data: rooms } = useGetRoomsQuery();
  
  // RTK Mutations
  const [updateProfile] = useUpdateProfileMutation();
  const [createRating] = useCreateRatingMutation();
  const [deleteRating] = useDeleteRatingMutation();
  const [updateRating] = useUpdateRatingMutation();
  const [deleteRatingImage] = useDeleteRatingImageMutation();
  const [addRatingImage] = useAddRatingImageMutation();
  const [createRoom] = useCreateRoomMutation();

  const crops = Array.isArray(cropsData) ? cropsData : [];
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isUpdatingRating, setIsUpdatingRating] = useState(false);
  
  // State
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [hasRated, setHasRated] = useState(false);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditingRating, setCurrentEditingRating] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");

  const userInfo = useSelector((state) => state.auth.userInfo);
  const currentUser = userInfo?.data.username;
  const userRole = userInfo?.role;

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
    setQrCodeImage(profile?.data.qr_code_image || "");
    setEditOpen(true);
  };

  const handleProfileSubmit = async () => {
    setIsUpdatingProfile(true);
    try {
      const data = new FormData();
      data.append("phoneno", phone);
      data.append("address", address);

      if (profilePic && profilePic.startsWith("data:image")) {
        const blob = dataURItoBlob(profilePic);
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        data.append("image", file);
      }

      if (qrCodeImage && qrCodeImage.startsWith("data:image")) {
        const blob = dataURItoBlob(qrCodeImage);
        const file = new File([blob], "qr_code.jpg", { type: "image/jpeg" });
        data.append("qr_code_image", file);
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
    setIsSubmittingRating(true);
    const formData = new FormData();
    formData.append("rated_user", username);
    formData.append("description", description);
    formData.append("rate", parseInt(rating)); // Ensure rate is an integer
    
    // Append multiple images
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await createRating({ ratingData: formData }).unwrap();
      refetchRatings();
      setRating(0);
      setDescription("");
      setImages([]);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteRatingImage = async (imageId) => {
    try {
      await deleteRatingImage(imageId).unwrap();
      
      // Update the currentEditingRating state to remove the deleted image immediately
      setCurrentEditingRating(prev => ({
        ...prev,
        rating_images: prev.rating_images.filter(img => img.id !== imageId)
      }));
      
      refetchRatings();
    } catch (error) {
      console.error("Failed to delete rating image:", error);
    }
  };

  const handleEditRatingClick = (ratingItem) => {
    setCurrentEditingRating(ratingItem);
    setRating(ratingItem.rate);
    setDescription(ratingItem.description);
    setImages([]);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentEditingRating(null);
    setRating(0);
    setDescription("");
    setImages([]);
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await deleteRating(ratingId).unwrap();
      refetchRatings();
    } catch (error) {
      console.error("Failed to delete rating:", error);
    }
  };

  const handleUpdateRating = async (ratingId) => {
    setIsUpdatingRating(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("rate", parseInt(rating)); // Ensure rate is an integer
    
    try {
      // 1. Update text fields (description, rate)
      await updateRating({ ratingId, updatedRatingData: formData }).unwrap();

      // 2. Upload new images one by one using the addRatingImage API
      const imageUploadPromises = images
        .filter(image => image instanceof File)
        .map(image => {
          const imageFormData = new FormData();
          imageFormData.append("rating", ratingId);
          imageFormData.append("image", image);
          return addRatingImage(imageFormData).unwrap();
        });

      if (imageUploadPromises.length > 0) {
        await Promise.all(imageUploadPromises);
      }

      refetchRatings();
      handleCloseEditDialog();
    } catch (error) {
      console.error("Failed to update rating:", error);
    } finally {
      setIsUpdatingRating(false);
    }
  };

  const calculateAverageRating = () => {
    if (!ratings?.data || ratings.data.length === 0) return 0;
    const sum = ratings.data.reduce((acc, curr) => acc + curr.rate, 0);
    return (sum / ratings.data.length).toFixed(1);
  };

  const countRatingsByValue = (value) => {
    if (!ratings?.data) return 0;
    return ratings.data.filter((r) => r.rate === value).length;
  };

  const calculateRatingPercentage = (value) => {
    if (!ratings?.data || ratings.data.length === 0) return 0;
    return (countRatingsByValue(value) / ratings.data.length) * 100;
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState router={router} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-16">
      <ProfileHeader
        profile={profile}
        ratings={ratings}
        currentUser={currentUser}
        username={username}
        userRole={userRole}
        calculateAverageRating={calculateAverageRating}
        handleEditClick={handleEditClick}
        handleChatClick={handleChatClick}
        router={router}
      />

      <EditProfileDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
        qrCodeImage={qrCodeImage}
        setQrCodeImage={setQrCodeImage}
        handleProfileSubmit={handleProfileSubmit}
        isUpdatingProfile={isUpdatingProfile}
      />

      <div className="mx-auto max-w-7xl px-4">
        <Tabs defaultValue="reviews" className="w-full">
          <ProfileTabs username={username} currentUser={currentUser} profileRole={profile.role} />

          <TabsContent value="reviews">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RatingSummaryCard
                ratings={ratings}
                calculateAverageRating={calculateAverageRating}
                countRatingsByValue={countRatingsByValue}
                calculateRatingPercentage={calculateRatingPercentage}
              />

              <div className="lg:col-span-2 space-y-6">
                {!hasRated && (
                  <AddReviewForm
                    profileName={profile?.data.name}
                    rating={rating}
                    setRating={setRating}
                    description={description}
                    setDescription={setDescription}
                    images={images}
                    setImages={setImages}
                    handleImageChange={handleImageChange}
                    handleRatingSubmit={handleRatingSubmit}
                    handleRemoveImage={handleRemoveImage}
                    isSubmitting={isSubmittingRating}
                  />
                )}

                <ReviewsList
                  ratings={ratings}
                  userInfo={userInfo}
                  onEditClick={handleEditRatingClick}
                  handleDeleteRating={handleDeleteRating}
                />

                <EditRatingDialog
                  isOpen={editDialogOpen}
                  onClose={handleCloseEditDialog}
                  ratingItem={currentEditingRating}
                  rating={rating}
                  setRating={setRating}
                  description={description}
                  setDescription={setDescription}
                  images={images}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                  handleDeleteRatingImage={handleDeleteRatingImage}
                  handleUpdateRating={handleUpdateRating}
                  isUpdating={isUpdatingRating}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab profile={profile} currentUser={currentUser} username={username} />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsTab contracts={contracts} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTab
              payments={payments}
              paymentLoading={paymentLoading}
              userRole={userRole}
              currentUser={currentUser}
              router={router}
            />
          </TabsContent>

          <TabsContent value="Crops">
            <CropsTab crops={crops} language={language} />
          </TabsContent>

          <TabsContent value="Demands">
            <DemandsTab
              demands={demands}
              language={language}
              router={router}
              generateColor={generateColor}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
