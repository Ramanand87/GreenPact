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
import { useTranslate } from "@/lib/LanguageContext"

export default function CreateContractPage() {
  const router = useRouter()
  const { crop_id } = useParams()
  const { t } = useTranslate()
  const [createContract, { isLoading }] = useCreateContractMutation()
  const { data: cropData, isLoading: isCropLoading } = useGetSingleCropQuery(crop_id)

  const crop = cropData?.data || {
    id: crop_id,
    name: t('loading', { en: 'Loading...', hi: 'लोड हो रहा है...' }),
    publisher: {
      username: "",
      name: t('loading', { en: 'Loading...', hi: 'लोड हो रहा है...' }),
    },
    basePrice: 0,
    unit: "kg",
  }

  const farmer_username = crop?.publisher?.username

  const standardTerms = [
    { id: "quality_standard", label: t('qualityStandards', { en: 'Quality standards must be met', hi: 'गुणवत्ता मानकों को पूरा किया जाना चाहिए' }) },
    { id: "delivery_timeframe", label: t('deliveryTimeframe', { en: 'Delivery within agreed timeframe', hi: 'सहमत समय सीमा के भीतर डिलीवरी' }) },
    { id: "payment_terms", label: t('paymentTerms', { en: 'Payment as per agreed terms', hi: 'सहमत शर्तों के अनुसार भुगतान' }) },
    { id: "force_majeure", label: t('forceMajeure', { en: 'Force majeure clause applies', hi: 'बल प्रमुख खंड लागू होता है' }) },
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
      setFormError(t('deliveryAddressRequired', { en: 'Delivery address is required', hi: 'डिलीवरी पता आवश्यक है' }))
      return
    }

    if (!formData.negotiated_price) {
      setFormError(t('priceRequired', { en: 'Negotiated price is required', hi: 'मूल्य आवश्यक है' }))
      return
    }

    if (!formData.quantity) {
      setFormError(t('quantityRequired', { en: 'Quantity is required', hi: 'मात्रा आवश्यक है' }))
      return
    }

    if (!deliveryDate) {
      setFormError(t('deliveryDateRequired', { en: 'Delivery date is required', hi: 'डिलीवरी तारीख आवश्यक है' }))
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
      setFormError(error?.data?.message || t('contractCreationFailed', { en: 'Failed to create contract. Please try again.', hi: 'अनुबंध बनाने में विफल। कृपया पुनः प्रयास करें।' }))
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
    <div className="mx-auto max-w-7xl px-4 py-8 ">
      <div className="mb-6">
        <Link href="/contracts" className="inline-flex items-center text-green-600 hover:text-green-700">
          <ArrowLeft className="h-4 w-4 mr-1" /> {t('backToContracts', { en: 'Back to Contracts', hi: 'अनुबंधों पर वापस जाएं' })}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="lg:col-span-2" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-green-800 mb-6">{t('createNewContract', { en: 'Create New Contract', hi: 'नया अनुबंध बनाएं' })}</h1>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-6">
            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('deliveryAddress', { en: 'Delivery Address', hi: 'डिलीवरी पता' })}</label>
                  <Textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder={t('enterDeliveryAddress', { en: 'Enter full delivery address', hi: 'पूरा डिलीवरी पता दर्ज करें' })}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('negotiatedPrice', { en: 'Negotiated Price (₹)', hi: 'मूल्य (₹)' })}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <Input
                      type="number"
                      name="negotiated_price"
                      value={formData.negotiated_price}
                      onChange={handleChange}
                      placeholder={t('enterPrice', { en: 'Enter price', hi: 'मूल्य दर्ज करें' })}
                      min="0"
                      step="0.01"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('basePrice', { en: 'Base price:', hi: 'आधार मूल्य:' })} ₹{crop.basePrice}/kg
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity', { en: 'Quantity (kg)', hi: 'मात्रा (kg)' })}</label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={t('enterQuantity', { en: 'Enter quantity in kg', hi: 'किलो में मात्रा दर्ज करें' })}
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('deliveryDate', { en: 'Delivery Date', hi: 'डिलीवरी तारीख' })}</label>
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
                        {deliveryDate ? format(deliveryDate, "PPP") : <span>{t('pickDate', { en: 'Pick a date', hi: 'तारीख चुनें' })}</span>}
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
                    <h3 className="text-lg font-medium text-gray-900">{t('standardTerms', { en: 'Standard Terms', hi: 'मानक शर्तें' })}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">
                            {t('standardTermsInfo', { en: 'These standard terms are included in all contracts and cannot be removed. You can add additional terms below.', hi: 'ये मानक शर्तें सभी अनुबंधों में शामिल हैं और हटाई नहीं जा सकतीं। आप नीचे अतिरिक्त शर्तें जोड़ सकते हैं।' })}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('additionalTerms', { en: 'Additional Terms', hi: 'अतिरिक्त शर्तें' })}</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      placeholder={t('addCustomTerm', { en: 'Add custom term', hi: 'कस्टम शर्त जोड़ें' })}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addCustomTerm} variant="outline" className="shrink-0">
                      <Plus className="h-4 w-4 mr-1" /> {t('add', { en: 'Add', hi: 'जोड़ें' })}
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
                      <p className="text-sm text-gray-500 italic mt-2">{t('noAdditionalTerms', { en: 'No additional terms added yet.', hi: 'अभी तक कोई अतिरिक्त शर्त नहीं जोड़ी गई।' })}</p>
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
                      {t('creating', { en: 'Creating...', hi: 'बनाया जा रहा है...' })}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> {t('createContract', { en: 'Create Contract', hi: 'अनुबंध बनाएं' })}
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
                <CardTitle>{t('contractSummary', { en: 'Contract Summary', hi: 'अनुबंध सारांश' })}</CardTitle>
                <CardDescription>{t('reviewContractDetails', { en: 'Review your contract details', hi: 'अपने अनुबंध विवरण की समीक्षा करें' })}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{t('crop', { en: 'Crop', hi: 'फसल' })}</h4>
                  <p className="font-medium">{crop.crop_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{t('farmer', { en: 'Farmer', hi: 'किसान' })}</h4>
                  <p className="font-medium">{crop.publisher_profile?.name}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{t('quantity', { en: 'Quantity', hi: 'मात्रा' })}</h4>
                  <p className="font-medium">
                    {formData.quantity ? `${formData.quantity} kg` : t('notSpecified', { en: 'Not specified', hi: 'निर्दिष्ट नहीं' })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{t('price', { en: 'Price', hi: 'मूल्य' })}</h4>
                  <p className="font-medium">
                    {formData.negotiated_price ? `₹${formData.negotiated_price} ${t('perKg', { en: 'per kg', hi: 'प्रति किलो' })}` : t('notSpecified', { en: 'Not specified', hi: 'निर्दिष्ट नहीं' })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{t('totalValue', { en: 'Total Value', hi: 'कुल मूल्य' })}</h4>
                  <p className="font-medium text-green-700">
                    {formData.negotiated_price && formData.quantity
                      ? `₹${(Number.parseFloat(formData.negotiated_price) * Number.parseFloat(formData.quantity)).toLocaleString()}`
                      : t('notCalculated', { en: 'Not calculated', hi: 'गणना नहीं की गई' })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{t('deliveryDate', { en: 'Delivery Date', hi: 'डिलीवरी तारीख' })}</h4>
                  <p className="font-medium">{deliveryDate ? format(deliveryDate, "PPP") : t('notSpecified', { en: 'Not specified', hi: 'निर्दिष्ट नहीं' })}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 text-xs text-gray-500 rounded-b-xl">
                {t('contractsTermsNote', { en: 'All contracts are subject to our terms and conditions.', hi: 'सभी अनुबंध हमारे नियमों और शर्तों के अधीन हैं।' })}
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

