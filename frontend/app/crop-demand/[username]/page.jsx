"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/lib/LanguageContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  DollarSign,
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
  const { t } = useTranslate();

  const {
    data: demands = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllDemandsQuery(username);
  const [addDemand, { isLoading: isAdding }] = useAddDemandMutation();
  const [updateDemand, { isLoading: isUpdating }] = useUpdateDemandMutation();
  const [deleteDemand] = useDeleteDemandMutation();
  const [deletingId, setDeletingId] = useState(null);

  const [editingDemand, setEditingDemand] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteDemand(id).unwrap();
    setDeletingId(null);
    refetch();
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demands?.data.map((demand) => (
            <Card
              key={demand.id}
              className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader
                onClick={() => router.push(`/demand/${demand.demand_id}`)}
                className="p-0"
              >
                <div
                  className={`w-full h-52 cursor-pointer  flex items-center justify-center bg-gradient-to-br ${generateColor(
                    demand.crop_name
                  )} text-white group-hover:scale-[1.02] transition-transform duration-300 ease-out`}
                >
                  <div className="text-center p-6 backdrop-blur-[2px] backdrop-brightness-90 w-full h-full flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-bold tracking-tight mb-1">
                      {demand.crop_name}
                    </h2>
                    <p className="text-lg opacity-90 font-medium">
                      {t('premiumQuality', { en: 'Premium Quality', hi: 'प्रीमियम गुणवत्ता' })}
                    </p>
                    <div className="mt-3 px-5 py-1.5 bg-white/20 rounded-full inline-block backdrop-blur-sm text-sm">
                      {t('freshHarvest', { en: 'Fresh Harvest', hi: 'ताज़ा कटाई' })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-green-800">
                    {demand.crop_name}
                  </CardTitle>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                    ₹{demand.crop_price}
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <Package className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      {t('quantity', { en: 'Quantity:', hi: 'मात्रा:' })}{" "}
                      <span className="font-medium">{demand.quantity}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      {t('contact', { en: 'Contact:', hi: 'संपर्क:' })}{" "}
                      <span className="font-medium">{demand.contact_no}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      {t('location', { en: 'Location:', hi: 'स्थान:' })}{" "}
                      <span className="font-medium">{demand.location}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      {t('harvested', { en: 'Harvested:', hi: 'कटाई:' })}{" "}
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
                  className={cn(
                    "flex-1 transition-colors",
                    deletingId === demand.demand_id
                      ? "bg-red-400"
                      : "bg-red-500 hover:bg-red-600"
                  )}
                  onClick={() => handleDelete(demand.demand_id)}
                  disabled={deletingId === demand.demand_id}
                >
                  {deletingId === demand.demand_id ? (
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
