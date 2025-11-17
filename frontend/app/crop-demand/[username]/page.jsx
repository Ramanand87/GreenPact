"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
            Demand Crops
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Browse available crop demands from buyers or create your own demand
            listing.
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
              Create Demand
            </Button>
          </DialogTrigger>

          {/* Add/Edit Demand Modal */}
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-800">
                {editingDemand ? "Edit Demand" : "Create Demand"}
              </DialogTitle>
              <DialogDescription>
                {editingDemand
                  ? "Update your crop demand details below."
                  : "Fill in the details to create a new crop demand."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="crop_name">Crop Name</Label>
                <Input
                  id="crop_name"
                  name="crop_name"
                  placeholder="Enter crop name"
                  defaultValue={editingDemand?.crop_name}
                  className="focus-visible:ring-green-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crop_price">Price (₹)</Label>
                <Input
                  id="crop_price"
                  name="crop_price"
                  placeholder="Enter price"
                  defaultValue={editingDemand?.crop_price}
                  className="focus-visible:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
    <Label htmlFor="contact_no">Contact Number</Label>
    <Input
      id="contact_no"
      name="contact_no"
      placeholder="Enter contact number"
      defaultValue={editingDemand?.contact_no}
      className={`focus-visible:ring-green-500 ${contactError ? "border-red-500" : ""}`}
      required
      type="tel" // Change type to tel for better mobile keyboard
      maxLength={10} // Limit to 10 characters
      onChange={(e) => {
        // Validate on change to give immediate feedback
        if (e.target.value.length !== 10 && e.target.value.length > 0) {
          setContactError("Contact number must be 10 digits");
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
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder="Enter quantity"
                    defaultValue={editingDemand?.quantity}
                    className="focus-visible:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter crop description"
                  defaultValue={editingDemand?.description}
                  className="min-h-[100px] focus-visible:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter location"
                    defaultValue={editingDemand?.location}
                    className="focus-visible:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvested_time">Harvested Date</Label>
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
                  {editingDemand ? "Save Changes" : "Create Demand"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Cancel
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
          <span className="ml-2 text-lg text-gray-600">Loading demands...</span>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">
            Error fetching demands. Please try again later.
          </p>
        </div>
      ) : demands?.data?.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No crop demands available yet.</p>
          <Button
            onClick={() => setOpenDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Create Your First Demand
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
                      Premium Quality
                    </p>
                    <div className="mt-3 px-5 py-1.5 bg-white/20 rounded-full inline-block backdrop-blur-sm text-sm">
                      Fresh Harvest
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
                      Quantity:{" "}
                      <span className="font-medium">{demand.quantity}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Contact:{" "}
                      <span className="font-medium">{demand.contact_no}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Location:{" "}
                      <span className="font-medium">{demand.location}</span>
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                    <p className="text-gray-700">
                      Harvested:{" "}
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
                  Edit
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
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
