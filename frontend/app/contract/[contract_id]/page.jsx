"use client"

import { useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  useGetContractQuery,
  useGetAllPaymentsQuery,
  useCreatePaymentMutation,
  useGetFramerProgressQuery,
  useCreateFarmerProgressMutation,
  useGetContractPdfQuery,
} from "@/redux/Service/contract"

// Add this import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Upload,
  Leaf,
  Sprout,
  TreesIcon as Plant,
  Truck,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  FileTextIcon,
  Download,
  X,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import Image from "next/image"

// Harvest status options
const harvestStatusOptions = [
  {
    value: "planted",
    label: "Planted",
    icon: <Sprout className="h-4 w-4 mr-2" />,
  },
  {
    value: "growing",
    label: "Growing",
    icon: <Plant className="h-4 w-4 mr-2" />,
  },
  {
    value: "harvested",
    label: "Harvested",
    icon: <Leaf className="h-4 w-4 mr-2" />,
  },
  {
    value: "ready_for_delivery",
    label: "Ready for Delivery",
    icon: <PackageCheck className="h-4 w-4 mr-2" />,
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: <Truck className="h-4 w-4 mr-2" />,
  },
]
const handleDownload = (imageUrl, fileName) => {
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = fileName || "receipt"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    })
    .catch((error) => console.error("Error downloading image:", error))
}

// Function to open image in new tab
const handleOpenImage = (imageUrl) => {
  window.open(imageUrl, "_blank")
}
// Function to get progress percentage based on harvest status
const getProgressPercentage = (status) => {
  const statusMap = {
    planted: 20,
    growing: 40,
    harvested: 60,
    ready_for_delivery: 80,
    delivered: 100,
  }
  return statusMap[status] || 0
}

export default function ContractPage() {
  const { contract_id } = useParams()
  const fileInputRef = useRef(null)
  const cropImageRef = useRef(null)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const userRole = userInfo?.role
  const [contractPdfUrl, setContractPdfUrl] = useState(null)
  const [showQrPopup, setShowQrPopup] = useState(false)
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
const [currentReceipt, setCurrentReceipt] = useState(null);
  // Fetch contract details
  const { data: contractData, isLoading: isLoadingContract, error: contractError } = useGetContractQuery(contract_id)

  // Fetch all payments for this contract
  const { data: paymentsData, isLoading: isLoadingPayments } = useGetAllPaymentsQuery(contract_id)
  const { data: farmerProgress, isLoading: isLoadingFarmProgress } = useGetFramerProgressQuery(contract_id)

  // Create payment mutation
  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation()

  const [createFarmerProgress, { isLoading: isCreatingProgress }] = useCreateFarmerProgressMutation()
  // Hardcoded farmer progress data

  const { data: farmerProgressData, isLoading: isLoadingProgress } = useGetFramerProgressQuery(contract_id)

  const { data: contractPdf, isLoading: isLoadingPdf, error } = useGetContractPdfQuery(contract_id)
  console.log(contractPdf)
  console.log(error)

  useEffect(() => {
    if (contractPdf?.data?.document) {
      setContractPdfUrl(contractPdf.data.document)
    }
  }, [contractPdf]) // Only runs when contractPdf changes

  console.log(contractPdf)

  // Mock function for updating farmer progress

  const [paymentDate, setPaymentDate] = useState(new Date())
  const [harvestDate, setHarvestDate] = useState(new Date())
  const [paymentForm, setPaymentForm] = useState({
    description: "",
    amount: "",
    receipt: null,
    receiptName: "",
    reference_number: "",
  })
  const [paymentError, setPaymentError] = useState("")

  const [progressForm, setProgressForm] = useState({
    status: "planted",
    notes: "",
    cropImage: null,
    cropImageName: "",
  })

  // Set active tab based on user role
  const [activeTab, setActiveTab] = useState("payment")

  // 2. Add state for tracking current card index in both history sections
  const [currentProgressIndex, setCurrentProgressIndex] = useState(0)
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState(0)

  useEffect(() => {
    // Set default tab based on user role
    if (userRole === "farmer") {
      setActiveTab("farmer")
    } else {
      setActiveTab("payment")
    }

    // Pre-fill progress form if data exists

    if (farmerProgressData?.data && farmerProgressData.data.length > 0) {
      // Get the latest progress entry (assuming data is sorted by date)
      const latestProgress = farmerProgressData.data[0]

      setProgressForm({
        status: latestProgress.current_status.toLowerCase() || "planted",
        notes: latestProgress.notes || "",
        cropImage: null,
        cropImageName: latestProgress.image ? "Current image" : "",
      })

      if (latestProgress.date) {
        setHarvestDate(new Date(latestProgress.date))
      }
    }
  }, [userRole])

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentForm({
      ...paymentForm,
      [name]: value,
    })

    // Clear previous error when user is typing
    if (name === "amount") {
      setPaymentError("")
    }
  }

  const handleProgressChange = (e) => {
    const { name, value } = e.target
    setProgressForm({
      ...progressForm,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPaymentForm({
        ...paymentForm,
        receipt: file,
        receiptName: file.name,
      })
    }
  }

  const handleCropImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProgressForm({
        ...progressForm,
        cropImage: file,
        cropImageName: file.name,
      })
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()

    // Calculate remaining amount
    const remainingAmount = totalContractValue - totalPaid

    // Validate payment amount
    if (Number(paymentForm.amount) <= 0) {
      setPaymentError("Payment amount must be greater than zero")
      return
    }

    if (Number(paymentForm.amount) > remainingAmount) {
      setPaymentError(`Payment amount cannot exceed the remaining amount (₹${remainingAmount.toLocaleString()})`)
      return
    }

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("contract_id", contract_id)
      formData.append("description", paymentForm.description)
      formData.append("date", format(paymentDate, "yyyy-MM-dd"))
      formData.append("amount", paymentForm.amount)
      formData.append("reference_number", paymentForm.reference_number)

      if (paymentForm.receipt) {
        formData.append("receipt", paymentForm.receipt)
      }

      await createPayment(formData).unwrap()

      // Reset form
      setPaymentForm({
        description: "",
        amount: "",
        receipt: null,
        receiptName: "",
        reference_number: "",
      })
      setPaymentError("")

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast.success("Payment added successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed to add payment. Please try again.")
    }
  }

  const handleProgressSubmit = async (e) => {
    e.preventDefault()

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("contract_id", contract_id)
      formData.append("current_status", progressForm.status)
      formData.append("date", format(harvestDate, "yyyy-MM-dd"))
      formData.append("notes", progressForm.notes)

      if (progressForm.cropImage) {
        formData.append("image", progressForm.cropImage)
      }

      await createFarmerProgress(formData).unwrap()

      // Reset form fields completely after successful submission
      setProgressForm({
        status: "planted",
        notes: "",
        cropImage: null,
        cropImageName: "",
      })
      setHarvestDate(new Date())

      if (cropImageRef.current) {
        cropImageRef.current.value = ""
      }

      toast.success("Crop progress updated successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed to update progress. Please try again.")
    }
  }

  if (isLoadingContract || isLoadingPayments || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading contract details...</span>
      </div>
    )
  }

  if (contractError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Contract</h2>
          <p className="mt-2">Failed to load contract details. Please try again later.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const contract = contractData?.data
  if (!contract) return null

  // Get payments array or empty array if no payments
  const payments = paymentsData?.data || []
  const hasPayments = payments.length > 0

  // Get farmer progress data

  // Calculate total contract value
  const totalContractValue = contract.nego_price * contract.quantity

  // Calculate total paid amount
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0)

  // Calculate payment progress percentage
  const paymentProgressPercentage = Math.min(100, (totalPaid / totalContractValue) * 100)

  // Calculate crop progress percentage
  // Get all farmer progress data
  const progressEntries = farmerProgressData?.data || []

  // Find the highest status in the progress entries
  const getHighestProgressStatus = () => {
    if (!progressEntries.length) return null

    const statusValues = {
      planted: 20,
      growing: 40,
      harvested: 60,
      ready_for_delivery: 80,
      delivered: 100,
    }

    let highestStatus = "planted"
    let highestValue = 0

    progressEntries.forEach((entry) => {
      const status = entry.current_status.toLowerCase()
      const value = statusValues[status] || 0

      if (value > highestValue) {
        highestValue = value
        highestStatus = status
      }
    })

    return {
      status: highestStatus,
      percentage: highestValue,
    }
  }

  // Get the highest progress status and percentage
  const highestProgress = getHighestProgressStatus()

  // Calculate crop progress percentage based on highest status
  const cropProgressPercentage = highestProgress ? highestProgress.percentage : 0

  // Get the current progress for display (first/most recent entry)
  const progress =
    progressEntries.length > 0
      ? {
          status: progressEntries[0].current_status.toLowerCase(),
          notes: progressEntries[0].notes,
          image: progressEntries[0].image,
          harvest_date: progressEntries[0].date,
        }
      : null

  // Calculate overall progress percentage
  const progressPercentage = (paymentProgressPercentage + cropProgressPercentage) / 2

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contract Summary Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-2xl font-bold">Contract Details</CardTitle>
                <CardDescription>Contract ID: {contract.contract_id}</CardDescription>
              </div>
              <Badge variant={hasPayments ? "secondary" : "outline"}>{hasPayments ? "In Progress" : "Active"}</Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Farmer</h3>
                  <p className="text-lg font-semibold">{contract.farmer_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Buyer</h3>
                  <p className="text-lg font-semibold">{contract.buyer_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Crop</h3>
                  <p className="text-lg font-semibold">{contract.crop_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
                  <p className="text-lg font-semibold">{contract.quantity} kg</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Price per kg</h3>
                  <p className="text-lg font-semibold">₹{contract.nego_price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
                  <p className="text-lg font-semibold">₹{totalContractValue.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Delivery Address</h3>
                  <p className="text-lg font-semibold">{contract.delivery_address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Delivery Date</h3>
                  <p className="text-lg font-semibold">{new Date(contract.delivery_date).toLocaleDateString()}</p>
                </div>
              </div>
              {contract.qr_code && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">QR Code</h3>
                  <div
                    className="w-32 h-32 relative cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setShowQrPopup(true)}
                  >
                    <Image
                      src={contract.qr_code || "/placeholder.svg"}
                      alt="Field QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Click to view larger QR code</p>
                </div>
              )}
              {/* Receipt Popup */}
{showReceiptPopup && currentReceipt && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Payment Receipt</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowReceiptPopup(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-full relative" style={{ minHeight: '300px' }}>
        {typeof currentReceipt === 'string' && (
          currentReceipt.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <Image
              src={currentReceipt}
              alt="Payment Receipt"
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">Receipt document</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.open(currentReceipt, '_blank')}
              >
                Open in new tab
              </Button>
            </div>
          )
        )}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button 
          variant="outline"
          onClick={() => {
            handleDownload(
              currentReceipt,
              typeof currentReceipt === 'string' 
                ? currentReceipt.split('/').pop() 
                : 'receipt'
            )
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={() => setShowReceiptPopup(false)}>
          Close
        </Button>
      </div>
    </div>
  </div>
)}
              {/* QR Code Popup */}
              {showQrPopup && contract.qr_code && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Field QR Code</h3>
                      {/* <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowQrPopup(false)}
        >
          <X className="h-4 w-4" />
        </Button> */}
                    </div>
                    <div className="w-full aspect-square relative">
                      <Image
                        src={contract.qr_code || "/placeholder.svg"}
                        alt="Field QR Code"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => setShowQrPopup(false)}>Close</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Contract Terms</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {contract.terms.map((term, index) => (
                    <li key={index} className="text-sm">
                      {term}
                    </li>
                  ))}
                </ul>
              </div>

              {contractPdfUrl && (
                <div className="mt-6">
                  <Button variant="outline" className="w-full" onClick={() => window.open(contractPdfUrl, "_blank")}>
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    View Contract PDF
                  </Button>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>₹{totalPaid.toLocaleString()} paid</span>
                    <span>₹{totalContractValue.toLocaleString()} total</span>
                  </div>
                  <Progress value={paymentProgressPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {paymentProgressPercentage.toFixed(0)}% of contract value paid
                  </p>
                </div>
              </div>

              {progressEntries.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Crop Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Planted</span>
                      <span>Delivered</span>
                    </div>
                    <Progress value={cropProgressPercentage} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>
                        Current:{" "}
                        {harvestStatusOptions.find((option) => option.value === highestProgress.status)?.label ||
                          "Not started"}
                      </span>
                      <span className="text-muted-foreground">{cropProgressPercentage}% complete</span>
                    </div>
                    {highestProgress && highestProgress.status !== progress.status && (
                      <p className="text-xs text-muted-foreground">
                        Highest status achieved:{" "}
                        {harvestStatusOptions.find((option) => option.value === highestProgress.status)?.label}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side Section - Tabs for Payment/Progress */}
        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payment">{userRole === "farmer" ? "Payment History" : "Payments"}</TabsTrigger>
              <TabsTrigger value="farmer">Crop Progress</TabsTrigger>
            </TabsList>

            {/* Payment Tab Content */}
            <TabsContent value="payment" className="mt-4 space-y-6">
              {/* For Farmers: Only show payment history */}
              {userRole === "farmer" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>View all payments made for this contract</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {payments.length > 0 ? (
                      <div className="space-y-4">
                        {payments.map((payment) => (
                          <div key={payment.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">₹{Number(payment.amount).toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(payment.date).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Confirmed
                              </Badge>
                            </div>
                            <div className="mt-2 text-sm">
                              <p>{payment.description}</p>
                              {payment.receipt && (
                                <p className="flex items-center gap-1 text-muted-foreground mt-1">
                                  <FileText className="h-3 w-3" />
                                  {typeof payment.receipt === "string"
                                    ? payment.receipt.split("/").pop()
                                    : "Receipt attached"}
                                </p>
                                
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">No payments have been made yet.</div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Paid:</span>
                      <span className="font-medium">₹{totalPaid.toLocaleString()}</span>
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                /* For Contractors: Show payment form and history */
                <>
                  {!hasPayments ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Advance Payment Required</CardTitle>
                        <CardDescription>An advance payment is required to start this contract</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Alert className="mb-6">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Attention</AlertTitle>
                          <AlertDescription>Please make an advance payment to activate this contract.</AlertDescription>
                        </Alert>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Advance Payment Amount (₹)</Label>
                            <Input
                              id="amount"
                              name="amount"
                              type="number"
                              placeholder="Enter amount"
                              value={paymentForm.amount}
                              onChange={handlePaymentChange}
                              required
                            />
                            {paymentError && <p className="text-sm text-red-500 mt-1">{paymentError}</p>}
                            <p className="text-xs text-muted-foreground">
                              Recommended: ₹{Math.round(totalContractValue * 0.25).toLocaleString()} (25% of total)
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Payment Description</Label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder="Advance payment details"
                              value={paymentForm.description}
                              onChange={handlePaymentChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Payment Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {paymentDate ? format(paymentDate, "PPP") : "Select date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={paymentDate}
                                  onSelect={(date) => date && setPaymentDate(date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="receipt">Payment Receipt</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                ref={fileInputRef}
                                id="receipt"
                                name="receipt"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full justify-start"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                {paymentForm.receiptName || "Upload receipt"}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reference_number">Reference Number</Label>
                            <Input
                              id="reference_number"
                              name="reference_number"
                              type="text"
                              placeholder="Enter payment reference number"
                              value={paymentForm.reference_number}
                              onChange={handlePaymentChange}
                            />
                          </div>

                          <Button type="submit" className="w-full" disabled={isCreatingPayment}>
                            {isCreatingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Advance Payment
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  ) : (
                    <Tabs defaultValue="history" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="history">Payment History</TabsTrigger>
                        <TabsTrigger value="add">Add Payment</TabsTrigger>
                      </TabsList>

                      <TabsContent value="history" className="mt-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                              <CardTitle>Payment History</CardTitle>
                              <CardDescription>
                                {payments.length > 0
                                  ? `${currentPaymentIndex + 1} of ${payments.length}`
                                  : "No payments yet"}
                              </CardDescription>
                            </div>
                            {payments.length > 1 && (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setCurrentPaymentIndex(Math.max(0, currentPaymentIndex - 1))}
                                  disabled={currentPaymentIndex === 0}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    setCurrentPaymentIndex(Math.min(payments.length - 1, currentPaymentIndex + 1))
                                  }
                                  disabled={currentPaymentIndex === payments.length - 1}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </CardHeader>
                          <CardContent>
                            {payments.length > 0 ? (
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      ₹{Number(payments[currentPaymentIndex].amount).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(payments[currentPaymentIndex].date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Confirmed
                                  </Badge>
                                </div>
                                <div className="mt-2 text-sm">
                                  <p>{payments[currentPaymentIndex].description}</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Reference: {payments[currentPaymentIndex].reference_number}
                                  </p>
                                  {payments[currentPaymentIndex].receipt && (
  <div className="mt-3">
    <p className="flex items-center gap-1 text-muted-foreground mb-2">
      <FileText className="h-3 w-3" />
      {typeof payments[currentPaymentIndex].receipt === "string"
        ? payments[currentPaymentIndex].receipt.split("/").pop()
        : "Receipt attached"}
    </p>
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={() => {
          setCurrentReceipt(payments[currentPaymentIndex].receipt);
          setShowReceiptPopup(true);
        }}
      >
        <FileText className="h-4 w-4 mr-2" />
        View Receipt
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          handleDownload(
            payments[currentPaymentIndex].receipt,
            payments[currentPaymentIndex].receipt.split("/").pop()
          )
        }
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  </div>
)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6 text-muted-foreground">
                                No payments have been made yet.
                              </div>
                            )}
                          </CardContent>
                          <CardFooter>
                            <div className="w-full flex justify-between text-sm">
                              <span className="text-muted-foreground">Total Paid:</span>
                              <span className="font-medium">₹{totalPaid.toLocaleString()}</span>
                            </div>
                          </CardFooter>
                        </Card>
                      </TabsContent>

                      <TabsContent value="add" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Add New Payment</CardTitle>
                            <CardDescription>Record a new payment for this contract</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="amount">Payment Amount (₹)</Label>
                                <Input
                                  id="amount"
                                  name="amount"
                                  type="number"
                                  placeholder="Enter amount"
                                  value={paymentForm.amount}
                                  onChange={handlePaymentChange}
                                  required
                                />
                                {paymentError && <p className="text-sm text-red-500 mt-1">{paymentError}</p>}
                                <p className="text-xs text-muted-foreground">
                                  Remaining: ₹{(totalContractValue - totalPaid).toLocaleString()}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="description">Payment Description</Label>
                                <Textarea
                                  id="description"
                                  name="description"
                                  placeholder="Payment details"
                                  value={paymentForm.description}
                                  onChange={handlePaymentChange}
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Payment Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {paymentDate ? format(paymentDate, "PPP") : "Select date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={paymentDate}
                                      onSelect={(date) => date && setPaymentDate(date)}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="receipt">Payment Receipt</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    ref={fileInputRef}
                                    id="receipt"
                                    name="receipt"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full justify-start"
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {paymentForm.receiptName || "Upload receipt"}
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="reference_number">Reference Number</Label>
                                <Input
                                  id="reference_number"
                                  name="reference_number"
                                  type="text"
                                  placeholder="Enter payment reference number"
                                  value={paymentForm.reference_number}
                                  onChange={handlePaymentChange}
                                />
                              </div>

                              <Button type="submit" className="w-full" disabled={isCreatingPayment}>
                                {isCreatingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Record Payment
                              </Button>
                            </form>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  )}
                </>
              )}
            </TabsContent>

            {/* Farmer Progress Tab Content */}
            <TabsContent value="farmer" className="mt-4 space-y-6">
              {/* Current Progress Display */}
              {farmerProgressData?.data && farmerProgressData.data.length > 0 ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Crop Progress History</CardTitle>
                      <CardDescription>
                        {currentProgressIndex + 1} of {farmerProgressData.data.length}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentProgressIndex(Math.max(0, currentProgressIndex - 1))}
                        disabled={currentProgressIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentProgressIndex(
                            Math.min(farmerProgressData.data.length - 1, currentProgressIndex + 1),
                          )
                        }
                        disabled={currentProgressIndex === farmerProgressData.data.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Planted</span>
                          <span>Delivered</span>
                        </div>
                        <Progress
                          value={getProgressPercentage(
                            farmerProgressData.data[currentProgressIndex].current_status.toLowerCase(),
                          )}
                          className="h-2"
                        />

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            {
                              harvestStatusOptions.find(
                                (option) =>
                                  option.value ===
                                  farmerProgressData.data[currentProgressIndex].current_status.toLowerCase(),
                              )?.icon
                            }
                            <span className="font-medium">
                              {harvestStatusOptions.find(
                                (option) =>
                                  option.value ===
                                  farmerProgressData.data[currentProgressIndex].current_status.toLowerCase(),
                              )?.label || "Not started"}
                            </span>
                          </div>
                          <Badge variant="outline">
                            {farmerProgressData.data[currentProgressIndex].date
                              ? format(new Date(farmerProgressData.data[currentProgressIndex].date), "PPP")
                              : "No date set"}
                          </Badge>
                        </div>
                      </div>

                      {farmerProgressData.data[currentProgressIndex].notes && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Farmer Notes:</h4>
                          <p className="text-sm bg-muted p-3 rounded-md">
                            {farmerProgressData.data[currentProgressIndex].notes}
                          </p>
                        </div>
                      )}

                      {farmerProgressData.data[currentProgressIndex].image && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Crop Image:</h4>
                          <div className="relative h-48 w-full rounded-md overflow-hidden">
                            <Image
                              src={farmerProgressData.data[currentProgressIndex].image || "/placeholder.svg"}
                              alt="Crop status"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Crop Progress</CardTitle>
                    <CardDescription>Current status of crop cultivation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      No progress information has been added yet.
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress Update Form - Only for Farmers */}
              {userRole === "farmer" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Update Crop Progress</CardTitle>
                    <CardDescription>Keep the buyer updated on your crop status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProgressSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Current Status</Label>
                        <Select
                          value={progressForm.status}
                          onValueChange={(value) => setProgressForm({ ...progressForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {harvestStatusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                  {option.icon}
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Harvest/Update Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {harvestDate ? format(harvestDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={harvestDate}
                              onSelect={(date) => date && setHarvestDate(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Add details about current crop condition"
                          value={progressForm.notes}
                          onChange={handleProgressChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cropImage">Crop Image</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            ref={cropImageRef}
                            id="cropImage"
                            name="cropImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCropImageChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => cropImageRef.current?.click()}
                            className="w-full justify-start"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {progressForm.cropImageName || "Upload crop image"}
                          </Button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isCreatingProgress}>
                        {isCreatingProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Progress
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Contract Status Card */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle>Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Payment Progress</span>
                    <span>{paymentProgressPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={paymentProgressPercentage} className="h-2" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="rounded-full p-1 bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Contract Created</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`rounded-full p-1 ${
                      hasPayments ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hasPayments ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Advance Payment</h4>
                    <p className="text-xs text-muted-foreground">25% of total value</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`rounded-full p-1 ${
                      progressPercentage >= 50 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {progressPercentage >= 50 ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Partial Payment</h4>
                    <p className="text-xs text-muted-foreground">50% of total value</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`rounded-full p-1 ${
                      paymentProgressPercentage >= 100
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {paymentProgressPercentage >= 100 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Full Payment</h4>
                    <p className="text-xs text-muted-foreground">100% of total value</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
