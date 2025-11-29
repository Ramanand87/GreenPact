"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/lib/LanguageContext";
import { getTranslatedCropName } from "@/lib/cropTranslations";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Plus,
  Trash,
  Edit,
  Loader2,
  Calendar,
  MapPin,
  Phone,
  Package,
  User,
  Star,
} from "lucide-react";
import {
  useGetAllDemandsQuery,
  useAddDemandMutation,
  useUpdateDemandMutation,
  useDeleteDemandMutation,
} from "@/redux/Service/demandApi";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

export default function DemandCropsPage() {
  const { username } = useParams();
  const router = useRouter();
  const { t, language } = useTranslate();

  const {
    data: demands = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllDemandsQuery(username);
  const [addDemand, { isLoading: isAdding }] = useAddDemandMutation();
  const [updateDemand, { isLoading: isUpdating }] = useUpdateDemandMutation();
  const [deleteDemand] = useDeleteDemandMutation();

  const [editingDemand, setEditingDemand] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [demandToDelete, setDemandToDelete] = useState(null);
  const [isDeletingInDialog, setIsDeletingInDialog] = useState(false);

  const [contactError, setContactError] = useState("");

  const handleSave = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const contactNo = formData.get("contact_no");

    // Validate contact number length
    if (contactNo.length !== 10) {
      setContactError("Contact number must be 10 digits");
      return;
    } else {
      setContactError("");
    }

    const newDemand = {
      crop_name: formData.get("crop_name"),
      crop_price: formData.get("crop_price"),
      crop_image: formData.get("crop_image")
        ? URL.createObjectURL(formData.get("crop_image"))
        : "",
      contact_no: contactNo,
      quantity: formData.get("quantity"),
      description: formData.get("description"),
      location: formData.get("location"),
      harvested_time: formData.get("harvested_time"),
    };

    if (editingDemand) {
      await updateDemand({
        id: editingDemand.demand_id,
        updateData: newDemand,
      }).unwrap();
      setEditingDemand(null);
    } else {
      await addDemand(newDemand).unwrap();
    }

    setOpenDialog(false);
    refetch();
  };

  const handleDeleteClick = (demand) => {
    setDemandToDelete(demand);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!demandToDelete) return;
    
    setIsDeletingInDialog(true);
    try {
      await deleteDemand(demandToDelete.demand_id).unwrap();
      setDeleteDialogOpen(false);
      setDemandToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting demand:", error);
    } finally {
      setIsDeletingInDialog(false);
    }
  };

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
    
    const index = cropName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length
    return gradients[index]
  }

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            {t('demandCrops', { en: 'Demand Crops', hi: 'फसल मांग' })}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            {t('browseDemands', { en: 'Browse available crop demands from buyers or create your own demand listing.', hi: 'खरीददारों से उपलब्ध फसल मांगों को देखें या अपनी मांग सूची बनाएं।' })}
          </p>
        </div>

        {/* Add Demand Button */}
        <Dialog
          open={openDialog}
          onOpenChange={(isOpen) => {
            setOpenDialog(isOpen);
            if (!isOpen) setEditingDemand(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px]">
              <Plus className="w-4 h-4 mr-2" />
              {t('createDemand', { en: 'Create Demand', hi: 'मांग बनाएं' })}
            </Button>
          </DialogTrigger>

          {/* Add/Edit Demand Modal */}
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-800">
                {editingDemand ? t('editDemand', { en: 'Edit Demand', hi: 'मांग संपादित करें' }) : t('createDemand', { en: 'Create Demand', hi: 'मांग बनाएं' })}
              </DialogTitle>
              <DialogDescription>
                {editingDemand
                  ? t('updateDemandDetails', { en: 'Update your crop demand details below.', hi: 'अपनी फसल मांग विवरण नीचे अपडेट करें।' })
                  : t('fillDemandDetails', { en: 'Fill in the details to create a new crop demand.', hi: 'नई फसल मांग बनाने के लिए विवरण भरें।' })}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="crop_name">{t('cropName', { en: 'Crop Name', hi: 'फसल का नाम' })}</Label>
                <Input
                  id="crop_name"
                  name="crop_name"
                  placeholder={t('enterCropName', { en: 'Enter crop name', hi: 'फसल का नाम दर्ज करें' })}
                  defaultValue={editingDemand?.crop_name}
                  className="focus-visible:ring-green-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crop_price">{t('price', { en: 'Price (₹)', hi: 'मूल्य (₹)' })}</Label>
                <Input
                  id="crop_price"
                  name="crop_price"
                  placeholder={t('enterPrice', { en: 'Enter price', hi: 'मूल्य दर्ज करें' })}
                  defaultValue={editingDemand?.crop_price}
                  className="focus-visible:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
    <Label htmlFor="contact_no">{t('contactNumber', { en: 'Contact Number', hi: 'संपर्क नंबर' })}</Label>
    <Input
      id="contact_no"
      name="contact_no"
      placeholder={t('enterContactNumber', { en: 'Enter contact number', hi: 'संपर्क नंबर दर्ज करें' })}
      defaultValue={editingDemand?.contact_no}
      className={`focus-visible:ring-green-500 ${contactError ? "border-red-500" : ""}`}
      required
      type="tel" // Change type to tel for better mobile keyboard
      maxLength={10} // Limit to 10 characters
      onChange={(e) => {
        // Validate on change to give immediate feedback
        if (e.target.value.length !== 10 && e.target.value.length > 0) {
          setContactError(t('contactNumberMust10Digits', { en: 'Contact number must be 10 digits', hi: 'संपर्क नंबर 10 अंकों का होना चाहिए' }));
        } else {
          setContactError("");
        }
      }}
    />
    {contactError && (
      <p className="text-red-500 text-sm mt-1">{contactError}</p>
    )}
  </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">{t('quantity', { en: 'Quantity', hi: 'मात्रा' })}</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder={t('enterQuantity', { en: 'Enter quantity', hi: 'मात्रा दर्ज करें' })}
                    defaultValue={editingDemand?.quantity}
                    className="focus-visible:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('description', { en: 'Description', hi: 'विवरण' })}</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t('enterCropDescription', { en: 'Enter crop description', hi: 'फसल विवरण दर्ज करें' })}
                  defaultValue={editingDemand?.description}
                  className="min-h-[100px] focus-visible:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">{t('location', { en: 'Location', hi: 'स्थान' })}</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder={t('enterLocation', { en: 'Enter location', hi: 'स्थान दर्ज करें' })}
                    defaultValue={editingDemand?.location}
                    className="focus-visible:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvested_time">{t('harvestedDate', { en: 'Harvested Date', hi: 'कटाई की तारीख' })}</Label>
                  <Input
                    id="harvested_time"
                    name="harvested_time"
                    type="date"
                    defaultValue={editingDemand?.harvested_time}
                    className="focus-visible:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                  disabled={isAdding || isUpdating}
                >
                  {(isAdding || isUpdating) && (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  )}
                  {editingDemand ? t('saveChanges', { en: 'Save Changes', hi: 'परिवर्तन सहेजें' }) : t('createDemand', { en: 'Create Demand', hi: 'मांग बनाएं' })}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  {t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List of Demands */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-lg text-gray-600">{t('loadingDemands', { en: 'Loading demands...', hi: 'मांगें लोड हो रही हैं...' })}</span>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">
            {t('errorFetchingDemands', { en: 'Error fetching demands. Please try again later.', hi: 'मांगें प्राप्त करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।' })}
          </p>
        </div>
      ) : demands?.data?.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">{t('noDemands', { en: 'No crop demands available yet.', hi: 'अभी तक कोई फसल मांग उपलब्ध नहीं।' })}</p>
          <Button
            onClick={() => setOpenDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            {t('createFirstDemand', { en: 'Create Your First Demand', hi: 'अपनी पहली मांग बनाएं' })}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demands?.data.map((demand) => (
            <Card
              key={demand.id}
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-md flex flex-col h-full bg-white"
            >
              {/* Gradient Header with Crop Name */}
              <CardHeader className="p-0 relative overflow-hidden">
                <div 
                  className="relative w-full h-48 bg-gradient-to-br from-green-400 via-green-500 to-green-700 group-hover:scale-105 transition-transform duration-500"
                  onClick={() => router.push(`/demand/${demand.demand_id}`)}
                >
                  {/* Decorative Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -ml-20 -mb-20" />
                  </div>
                  
                  {/* Crop Name Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20 shadow-2xl">
                        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                          {getTranslatedCropName(demand.crop_name, language)}
                        </h2>
                        <div className="h-1 w-16 bg-white/60 rounded-full mx-auto" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Price Tag */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                        <p className="text-gray-600 text-xs font-medium mb-0.5">Price per kg</p>
                        <p className="text-gray-900 text-2xl font-bold">₹{demand.crop_price}</p>
                      </div>
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg text-right">
                        <p className="text-gray-600 text-xs font-medium mb-0.5">Required</p>
                        <p className="text-gray-900 text-lg font-semibold">{demand.quantity} kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 flex-grow flex flex-col">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">
                  {getTranslatedCropName(demand.crop_name, language)}
                </h3>

                {/* Compact Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{demand.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{demand.quantity} kg</p>
                    </div>
                  </div>
                </div>

                {/* Secondary Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{new Date(demand.harvested_time).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Contact</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3 pt-0 pb-5">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  onClick={() => {
                    setEditingDemand(demand);
                    setOpenDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('edit', { en: 'Edit', hi: 'संपादित करें' })}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteClick(demand)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  {t('delete', { en: 'Delete', hi: 'हटाएं' })}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        if (!isDeletingInDialog) {
          setDeleteDialogOpen(open);
          if (!open) setDemandToDelete(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold text-gray-900">{demandToDelete?.crop_name}</span> from your demands.
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
  );
}
