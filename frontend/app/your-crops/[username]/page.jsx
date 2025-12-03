"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/lib/LanguageContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Trash, Edit, Plus, Loader2, Calendar, MapPin, Phone, Package, User } from "lucide-react";
import {
  useGetCropsQuery,
  useAddCropMutation,
  useUpdateCropMutation,
  useDeleteCropMutation,
} from "@/redux/Service/cropApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function YourCropsPage() {
  const { username } = useParams();
  const { t } = useTranslate();
  const { data, isLoading, isError } = useGetCropsQuery(username);
  console.log(data);
  const crops = Array.isArray(data) ? data : []; // Ensure crops is always an array

  const [addCrop, { isLoading: isAdding }] = useAddCropMutation();
  const [updateCrop, { isLoading: isUpdating }] = useUpdateCropMutation();
  const [deleteCrop] = useDeleteCropMutation();

  const [editingCrop, setEditingCrop] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For previewing image
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState(null);
  const [isDeletingInDialog, setIsDeletingInDialog] = useState(false);

  const handleDeleteClick = (crop) => {
    setCropToDelete(crop);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cropToDelete) return;
    
    setIsDeletingInDialog(true);
    try {
      await deleteCrop(cropToDelete.crop_id).unwrap();
      setDeleteDialogOpen(false);
      setCropToDelete(null);
    } catch (error) {
      console.error("Error deleting crop:", error);
    } finally {
      setIsDeletingInDialog(false);
    }
  };

 const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const fileInput = event.target.crop_image;

    // CHECK: Is there a new file selected?
    if (fileInput?.files.length > 0) {
      // If yes, ensure it is set correctly
      formData.set("crop_image", fileInput.files[0]);
    } else {
      // CRITICAL FIX: If no new file is selected, delete the key.
      // This prevents sending an empty file object to the backend.
      // Most backends will ignore the field if it's missing, preserving the old image.
      formData.delete("crop_image");
      
      // OPTIONAL: Only use the line below if your backend SPECIFICALLY expects 
      // the old image URL string when not updating the file. 
      // If your backend handles "missing file field = keep old image", do not use this.
      // if (editingCrop?.crop_image) {
      //   formData.append("crop_image", editingCrop.crop_image); 
      // }
    }

    try {
      if (editingCrop) {
        // Now we send the formData. If we deleted 'crop_image', 
        // the backend should receive only the text fields.
        await updateCrop({ id: editingCrop.crop_id, body: formData }).unwrap();
      } else {
        await addCrop(formData).unwrap();
      }

      setOpenDialog(false);
      setEditingCrop(null);
    } catch (error) {
      console.error("Error saving crop:", error);
    } finally {
      setLoading(false);
      setSelectedImage(null); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                {t('yourCrops', { en: 'Your Crops', hi: 'आपकी फसलें' })}
              </h1>
              <p className="text-gray-600 text-sm sm:text-lg">
                Manage and showcase your agricultural products
              </p>
            </div>
            {/* Add Crop Button */}
            <Dialog
              open={openDialog}
              onOpenChange={(isOpen) => {
                setOpenDialog(isOpen);
                if (!isOpen) {
                  setEditingCrop(null);
                  setSelectedImage(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addNewCrop', { en: 'Add New Crop', hi: 'नई फसल जोड़ें' })}
                </Button>
              </DialogTrigger>

              {/* Add/Edit Crop Modal */}
              <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCrop ? t('editCrop', { en: 'Edit Crop', hi: 'फसल संपादित करें' }) : t('addNewCrop', { en: 'Add New Crop', hi: 'नई फसल जोड़ें' })}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSave}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <Input
              name="crop_name"
              placeholder={t('cropName', { en: 'Crop Name', hi: 'फसल का नाम' })}
              defaultValue={editingCrop?.crop_name}
              required
            />
            <Input
              name="crop_price"
              type="number"
              placeholder={t('pricePerKg', { en: 'Price (₹/kg)', hi: 'मूल्य (₹/किलो)' })}
              defaultValue={editingCrop?.crop_price}
              required
            />
            <Input
              name="quantity"
              placeholder={t('quantityKg', { en: 'Quantity(/Kg)', hi: 'मात्रा (/किलो)' })}
              defaultValue={editingCrop?.quantity}
              required
            />
            <Input
              name="Description"
              placeholder={t('description', { en: 'Description', hi: 'विवरण' })}
              defaultValue={editingCrop?.Description}
              required
            />
            <Input
              name="location"
              placeholder={t('location', { en: 'Location', hi: 'स्थान' })}
              defaultValue={editingCrop?.location}
              required
            />
           <div>
           <label htmlFor="harvested_time" className="text-sm text-gray-700">{t('harvestedDate', { en: 'Harvested Date', hi: 'कटाई की तारीख' })}</label>
            <Input
              id="harvested_time"
              name="harvested_time"
              type="date"
              placeholder="Harvested Time"
              defaultValue={editingCrop?.harvested_time}
              required
            />
           </div>

            {/* Image Upload and Preview */}
            <div className="space-y-2">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <Input
                name="crop_image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedImage(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : null}
                {editingCrop ? t('saveChanges', { en: 'Save Changes', hi: 'परिवर्तन सहेजें' }) : t('addCrop', { en: 'Add Crop', hi: 'फसल जोड़ें' })}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
              >
                {t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* List of Crops */}
        {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mr-3" />
          <span className="text-lg text-gray-600">{t('loading', { en: 'Loading...', hi: 'लोड हो रहा है...' })}</span>
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-lg font-semibold text-red-600">
            {t('errorFetchingCrops', { en: 'Error fetching crops.', hi: 'फसलें प्राप्त करने में त्रुटि।' })}
          </p>
        </div>
      ) : crops.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🌾</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            {t('noCropsAvailable', { en: 'No crops available', hi: 'कोई फसल उपलब्ध नहीं' })}
          </p>
          <p className="text-gray-600 mb-6">Start by adding your first crop to the marketplace</p>
          <Button
            onClick={() => setOpenDialog(true)}
            className="bg-green-600 hover:bg-green-700 h-12 px-6 font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('addNewCrop', { en: 'Add New Crop', hi: 'नई फसल जोड़ें' })}
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{crops.length}</span> {crops.length === 1 ? 'crop' : 'crops'} in your inventory
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <Card
                key={crop.crop_id}
                className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-md flex flex-col h-full bg-white"
              >
                <Link href={`/crop/${crop?.crop_id}`}>
                  <CardHeader className="p-0 relative overflow-hidden">
                    <div className="relative w-full h-48">
                      <img
                        src={crop.crop_image || "/placeholder.svg?height=224&width=400"}
                        alt={crop.crop_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                      
                      {/* Price Tag */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-white/90 text-xs font-medium mb-1">Price per kg</p>
                            <p className="text-white text-2xl font-bold">₹{crop.crop_price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/90 text-xs font-medium mb-1">Available</p>
                            <p className="text-white text-lg font-semibold">{crop.quantity} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Link>

                <CardContent className="p-5 flex-grow flex flex-col">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">
                    {crop.crop_name}
                  </h3>

                  {/* Compact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{crop.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-gray-500">Harvested</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(crop.harvested_time).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-3 p-5 pt-0 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 hover:bg-gray-50"
                    onClick={() => {
                      setEditingCrop(crop);
                      setSelectedImage(crop.crop_image);
                      setOpenDialog(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t('edit', { en: 'Edit', hi: 'संपादित करें' })}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDeleteClick(crop)}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    {t('delete', { en: 'Delete', hi: 'हटाएं' })}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        if (!isDeletingInDialog) {
          setDeleteDialogOpen(open);
          if (!open) setCropToDelete(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold text-gray-900">{cropToDelete?.crop_name}</span> from your crops.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingInDialog}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeletingInDialog}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeletingInDialog ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}
