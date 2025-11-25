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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Trash, Edit, Plus, Loader2 } from "lucide-react";
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
  const [loadingDeleteId, setLoadingDeleteId] = useState(null); // Track which delete button is loading

  const handleDelete = async (id) => {
    console.log(id);
    console.log(typeof id);
    setLoadingDeleteId(id); // Set loading state for the specific crop
    try {
      await deleteCrop(id).unwrap();
    } catch (error) {
      console.error("Error deleting crop:", error);
    } finally {
      setLoadingDeleteId(null); // Reset loading state after delete
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    // Append file properly
    const fileInput = event.target.crop_image;
    if (fileInput?.files.length > 0) {
      formData.append("crop_image", fileInput.files[0]);
    }

    try {
      if (editingCrop) {
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
      setSelectedImage(null); // Reset image preview
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 ">
      <h1 className="text-3xl font-bold text-green-900 mb-8">{t('yourCrops', { en: 'Your Crops', hi: 'आपकी फसलें' })}</h1>

      {/* Add Crop Button */}
      <Dialog
        open={openDialog}
        onOpenChange={(isOpen) => {
          setOpenDialog(isOpen);
          if (!isOpen) {
            setEditingCrop(null);
            setSelectedImage(null); // Reset image preview
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="mb-8 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
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

      {/* List of Crops */}
      {isLoading ? (
        <div>{t('loading', { en: 'Loading...', hi: 'लोड हो रहा है...' })}</div>
      ) : isError ? (
        <div>{t('errorFetchingCrops', { en: 'Error fetching crops.', hi: 'फसलें प्राप्त करने में त्रुटि।' })}</div>
      ) : crops.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            {t('noCropsAvailable', { en: 'No crops available. Please add a crop.', hi: 'कोई फसल उपलब्ध नहीं। कृपया एक फसल जोड़ें।' })}
          </p>
          <Button
            onClick={() => setOpenDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('addNewCrop', { en: 'Add New Crop', hi: 'नई फसल जोड़ें' })}
          </Button>
        </div>
      ) : (
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
              </Link>

              <CardContent>
                <CardTitle className="text-xl">{crop.crop_name}</CardTitle>
                <div className="space-y-2 mt-4">
                  <p className="text-green-600 font-semibold">
                    ₹{crop.crop_price}/{t('kg', { en: 'kg', hi: 'किलो' })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('quantity', { en: 'Quantity:', hi: 'मात्रा:' })} {crop.quantity} {t('kg', { en: 'Kg', hi: 'किलो' })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('location', { en: 'Location:', hi: 'स्थान:' })} {crop.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('harvested', { en: 'Harvested:', hi: 'कटाई:' })} {crop.harvested_time}
                  </p>
                  <p className="text-gray-700">{crop.Description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCrop(crop);
                    setSelectedImage(crop.crop_image); // Set the existing image for preview
                    setOpenDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('edit', { en: 'Edit', hi: 'संपादित करें' })}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(crop.crop_id)}
                  disabled={loadingDeleteId === crop.crop_id} // Disable only the deleting button
                >
                  {loadingDeleteId === crop.crop_id ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <Trash className="w-4 h-4 mr-2" />
                  )}
                  {t('delete', { en: 'Delete', hi: 'हटाएं' })}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
