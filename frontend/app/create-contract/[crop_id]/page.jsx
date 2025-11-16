"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2, Send, ArrowLeft, HelpCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useGetSingleCropQuery } from "@/redux/Service/marketApi"
import { useCreateContractMutation } from "@/redux/Service/contract"

export default function CreateContractPage() {
  const router = useRouter()
  const { crop_id } = useParams()
  const [createContract, { isLoading }] = useCreateContractMutation()
  const { data: cropData, isLoading: isCropLoading } = useGetSingleCropQuery(crop_id)

  const crop = cropData?.data || {
    id: crop_id,
    name: "Loading...",
    publisher: {
      username: "",
      name: "Loading...",
    },
    basePrice: 0,
    unit: "kg",
  }

  const farmer_username = crop?.publisher?.username

  const standardTerms = [
    { id: "quality_standard", label: "Quality standards must be met" },
    { id: "delivery_timeframe", label: "Delivery within agreed timeframe" },
    { id: "payment_terms", label: "Payment as per agreed terms" },
    { id: "force_majeure", label: "Force majeure clause applies" },
  ]

  // Form state
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    negotiated_price: "",
    quantity: "",
    additionalTerms: [],
  })
  const [deliveryDate, setDeliveryDate] = useState()
  const [newTerm, setNewTerm] = useState("")
  const [formError, setFormError] = useState("")

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add new custom term
  const addCustomTerm = () => {
    if (newTerm.trim()) {
      setFormData((prev) => ({
        ...prev,
        additionalTerms: [...prev.additionalTerms, newTerm.trim()],
      }))
      setNewTerm("")
    }
  }

  // Remove custom term
  const removeCustomTerm = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalTerms: prev.additionalTerms.filter((_, i) => i !== index),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    // Form validation
    if (!formData.deliveryAddress.trim()) {
      setFormError("Delivery address is required")
      return
    }

    if (!formData.negotiated_price) {
      setFormError("Negotiated price is required")
      return
    }

    if (!formData.quantity) {
      setFormError("Quantity is required")
      return
    }

    if (!deliveryDate) {
      setFormError("Delivery date is required")
      return
    }

    const contract = {
      crop_id,
      farmer_username,
      delivery_address: formData.deliveryAddress,
      delivery_date: deliveryDate ? format(deliveryDate, "yyyy-MM-dd") : null,
      quantity: Number.parseInt(formData.quantity, 10),
      nego_price: Number.parseFloat(formData.negotiated_price),
      terms: formData.additionalTerms,
    }

    try {
      await createContract(contract).unwrap()
      router.push("/contracts")
    } catch (error) {
      console.error("Error creating contract:", error)
      setFormError(error?.data?.message || "Failed to create contract. Please try again.")
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/contracts" className="inline-flex items-center text-green-600 hover:text-green-700">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Contracts
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="lg:col-span-2" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-green-800 mb-6">Create New Contract</h1>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-6">
            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <Textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Enter full delivery address"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Negotiated Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <Input
                      type="number"
                      name="negotiated_price"
                      value={formData.negotiated_price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Base price: ₹{crop.basePrice}/kg
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={`Enter quantity in kg`}
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        initialFocus
                        fromDate={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Standard Terms</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">
                            These standard terms are included in all contracts and cannot be removed. You can add
                            additional terms below.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-4 rounded-md">
                    {standardTerms.map((term) => (
                      <div key={term.id} className="flex items-center space-x-2">
                        <Checkbox id={term.id} checked readOnly />
                        <label htmlFor={term.id} className="text-sm font-medium leading-none">
                          {term.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Terms</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      placeholder="Add custom term"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addCustomTerm} variant="outline" className="shrink-0">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2 mt-3">
                    {formData.additionalTerms.length > 0 ? (
                      formData.additionalTerms.map((term, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                        >
                          <span className="text-sm">{term}</span>
                          <Button
                            type="button"
                            onClick={() => removeCustomTerm(index)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic mt-2">No additional terms added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 min-w-[150px]" disabled={isLoading}>
                  {isLoading ? (
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Create Contract
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        <motion.div className="lg:col-span-1" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle>Contract Summary</CardTitle>
                <CardDescription>Review your contract details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Crop</h4>
                  <p className="font-medium">{crop.crop_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Farmer</h4>
                  <p className="font-medium">{crop.publisher_profile?.name}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Quantity</h4>
                  <p className="font-medium">
                    {formData.quantity ? `${formData.quantity} kg` : "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Price</h4>
                  <p className="font-medium">
                    {formData.negotiated_price ? `₹${formData.negotiated_price} per kg` : "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Total Value</h4>
                  <p className="font-medium text-green-700">
                    {formData.negotiated_price && formData.quantity
                      ? `₹${(Number.parseFloat(formData.negotiated_price) * Number.parseFloat(formData.quantity)).toLocaleString()}`
                      : "Not calculated"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Delivery Date</h4>
                  <p className="font-medium">{deliveryDate ? format(deliveryDate, "PPP") : "Not specified"}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 text-xs text-gray-500 rounded-b-xl">
                All contracts are subject to our terms and conditions.
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

