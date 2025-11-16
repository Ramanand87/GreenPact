"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Upload, Sun, Wheat, CheckCircle2, Loader2, Trash, Droplets, Cloud, Camera, X } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import FarmerLogo from "@/components/assets/FramerLogo"
import { useRegisterMutation, useLoginMutation } from "@/redux/Service/auth"
import Webcam from "react-webcam"
import { useDispatch, useSelector } from "react-redux"
import { setCredentials } from "@/redux/features/authFeature"

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupStep, setSignupStep] = useState(1)
  const [document, setDocument] = useState(null) // Single document
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [aadharDocument, setAadharDocument] = useState(null)
  const [verificationScreenshot, setVerificationScreenshot] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [activeTab, setActiveTab] = useState("login") // Add this near your other state declarations
  const [showVerificationPopup, setShowVerificationPopup] = useState(false)
  const webcamRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState("")
  // Add state variables for validation errors after the existing state declarations
  const [gstinError, setGstinError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  // Retrieve user info from Redux state
  const userInfo = useSelector((state) => state.auth.userInfo)

  // Redirect authenticated users
  useEffect(() => {
    if (userInfo) {
      router.push("/") // Redirect to home page or dashboard
    }
  }, [userInfo, router])

  const [formData, setFormData] = useState({
    role: "farmer", // Set farmer as default role
    name: "",
    username: "",
    address: "",
    phone: "",
    gstin: "", // Added GSTIN field
    password: "",
    confirmPassword: "",
    document: null, // Single document
    profileImage: null,
    aadharDocument: null,
    verificationScreenshot: null,
  })

  const [register] = useRegisterMutation()
  const [login] = useLoginMutation()

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setPreviewImage(imageSrc)
    setFormData({ ...formData, profileImage: imageSrc })
    setIsCameraActive(false) // Close the camera after capturing
  }

  // Handle document upload
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0] // Only take the first file
    if (file) {
      setFormData({ ...formData, document: file })
      setDocument(file)
    }
  }

  // Remove document
  const removeDocument = () => {
    setFormData({ ...formData, document: null })
    setDocument(null)
  }

  const handleAadharDocumentUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, aadharDocument: file })
      setAadharDocument(file)
    }
  }

  const handleVerificationScreenshotUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, verificationScreenshot: file })
      setVerificationScreenshot(file)
    }
  }

  const removeAadharDocument = () => {
    setFormData({ ...formData, aadharDocument: null })
    setAadharDocument(null)
  }

  const removeVerificationScreenshot = () => {
    setFormData({ ...formData, verificationScreenshot: null })
    setVerificationScreenshot(file)
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    // Validate role selection
    if (!formData.role) {
      alert("Please select a role (Farmer or Buyer).")
      return
    }

    // Validate phone number
    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits")
      return
    }

    // Validate GSTIN for contractors
    if (formData.role === "contractor" && formData.gstin && formData.gstin.length !== 15) {
      setGstinError("GSTIN must be exactly 15 digits")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const data = new FormData()
      data.append("role", formData.role) // Append role to FormData
      data.append("name", formData.name)
      data.append("username", formData.username)
      data.append("address", formData.address)
      data.append("phoneno", formData.phone)
      data.append("password", formData.password)

      // Add GSTIN for buyers/contractors
      if (formData.role === "contractor" && formData.gstin) {
        data.append("gstin", formData.gstin)
      }

      if (formData.profileImage) {
        // If profileImage is a base64 string (from webcam), it might be too large
        // Convert it to a smaller format or resize it before sending
        const imageBlob = await fetch(formData.profileImage).then((r) => r.blob())
        // Create a smaller version if needed
        data.append("image", imageBlob, "profile-image.jpg")
      }
      if (formData.aadharDocument) {
        data.append("aadhar_image", formData.aadharDocument)
      }
      if (formData.document) {
        data.append("signature", formData.document) // Append single document
      }
      // Only append verification screenshot for farmers
      if (formData.role === "farmer" && formData.verificationScreenshot) {
        data.append("screenshot", formData.verificationScreenshot)
      }

      const response = await register(data).unwrap()
      console.log("Registration successful:", response)
      setShowVerificationPopup(true) // Show the verification popup
      setShowSuccess(true)
      setActiveTab("login")
    } catch (error) {
      console.error("Registration failed:", error)
      // Display the error message to the user
      if (error.data && error.data.error) {
        setErrorMessage(error.data.error)
      } else {
        setErrorMessage("Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const username = e.target.loginId.value
    const password = e.target.loginPassword.value

    if (!username || !password) {
      alert("Please enter both username and password.")
      return
    }

    setIsLoading(true)

    try {
      const response = await login({ username, password }).unwrap()
      console.log("Login successful:", response)

      // Dispatch setCredentials to store user info in Redux and local storage
      dispatch(setCredentials(response))

      // Redirect to the home page or dashboard
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
      alert(error.data.Error || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const AnimatedBackgroundElements = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-10 left-10"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Wheat className="text-green-400 h-12 w-12" />
      </motion.div>
      <motion.div
        className="absolute top-20 right-20"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Sun className="text-yellow-400 h-16 w-16" />
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-1/4"
        animate={{
          y: [0, -30, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Cloud className="text-blue-300 h-20 w-20" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4"
        animate={{
          y: [0, 40, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Droplets className="text-blue-400 h-10 w-10" />
      </motion.div>
    </div>
  )

  // If the user is logged in, don't render the login/signup page
  if (userInfo) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-50 flex items-center justify-center p-4 relative">
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setShowVerificationPopup(false)}
              className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Registration Successful!</h3>

              <div className="text-gray-600 space-y-2">
                <p>Your account is under verification.</p>
                <p>Please wait up to 24 hours for our team to verify your details.</p>
                <p>You'll receive a notification once your account is approved.</p>
              </div>

              <Button onClick={() => setShowVerificationPopup(false)} className="mt-4 bg-green-600 hover:bg-green-700">
                Continue to Login
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AnimatedBackgroundElements />
      </div>

      <Card className="w-full max-w-md bg-white/90 backdrop-blur">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-6">
            <FarmerLogo width={80} height={80} className="drop-shadow-md" />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-green-800">
            Secure Your Harvest,
            <br />
            Connect with Buyers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Section */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginId">Username</Label>
                  <Input
                    id="loginId"
                    className="border-green-200 focus:ring-green-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      className="border-green-200 focus:ring-green-500 pr-10"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="link" className="text-green-600">
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Section */}
            <TabsContent value="signup" className="space-y-4">
              <div className="relative w-full h-2 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-700 transition-all duration-300 ease-in-out rounded-full"
                  style={{ width: `${signupStep * 25}%` }}
                />
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {signupStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <Label>Select Your Role</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.role === "farmer" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, role: "farmer" })}
                          className="w-full"
                        >
                          Farmer
                        </Button>
                        <Button
                          type="button"
                          variant={formData.role === "contractor" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, role: "contractor" })}
                          className="w-full"
                        >
                          Buyer
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        className="border-green-200 focus:ring-green-500"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        maxLength={250}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        className="border-green-200 focus:ring-green-500"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        className="border-green-200 focus:ring-green-500"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        maxLength={250} // Limit to 250 characters to be safe
                        required
                      />
                    </div>

                    {/* GSTIN field for buyers/contractors */}
                    {formData.role === "contractor" && (
                      <div className="space-y-2">
                        <Label htmlFor="gstin">GSTIN Number {"(15-digit)"}</Label>
                        <Input
                          id="gstin"
                          className="border-green-200 focus:ring-green-500"
                          placeholder="e.g. 561651651112345"
                          value={formData.gstin}
                          onChange={(e) => {
                            const value = e.target.value
                            setFormData({ ...formData, gstin: value })
                            if (value && value.length !== 15) {
                              setGstinError("GSTIN must be exactly 15 digits")
                            } else {
                              setGstinError("")
                            }
                          }}
                          maxLength={15}
                          required
                        />
                        {gstinError && <p className="text-sm text-red-500 mt-1">{gstinError}</p>}
                      </div>
                    )}
                  </div>
                )}
                {signupStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <Label>Profile Image</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4 text-center">
                        {isCameraActive ? (
                          <div className="flex flex-col items-center">
                            <Webcam
                              audio={false}
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              className="w-full h-auto"
                            />
                            <Button onClick={captureImage} className="mt-2 bg-green-600 hover:bg-green-700 text-white">
                              Capture Photo
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            {previewImage ? (
                              <div className="flex flex-col items-center">
                                <Image
                                  src={previewImage || "/placeholder.svg"}
                                  alt="Profile preview"
                                  width={400}
                                  height={400}
                                  className="mx-auto h-32 w-32 rounded-full object-cover"
                                />
                                <Button
                                  onClick={() => setIsCameraActive(true)}
                                  className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Retake Photo
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => setIsCameraActive(true)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Camera className="mr-2 h-4 w-4" />
                                Capture Photo
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Aadhar Card Upload</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          id="aadharDocument"
                          onChange={handleAadharDocumentUpload}
                        />
                        <Label htmlFor="aadharDocument" className="cursor-pointer block text-center">
                          <Upload />
                          <span className="mt-2 text-sm text-gray-600 block">Upload Aadhar card (PDF or Image)</span>
                        </Label>

                        {aadharDocument && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{aadharDocument.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(aadharDocument.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(URL.createObjectURL(aadharDocument))}
                                  className="text-green-600 border-green-200"
                                >
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={removeAadharDocument}
                                  className="text-red-600 border-red-200"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {signupStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <Label>{formData.role === "farmer" ? "Signature Document" : "Signature Document"}</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          id="document"
                          onChange={handleDocumentUpload}
                        />
                        <Label htmlFor="document" className="cursor-pointer block text-center">
                          <Upload />
                          <span className="mt-2 text-sm text-gray-600 block">
                            Upload document (PDF or Image)
                            {formData.role === "contractor" && " (Optional)"}
                          </span>
                        </Label>

                        {/* Document Preview Section */}
                        {document && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{document.name}</span>
                                <span className="text-xs text-gray-500">({(document.size / 1024).toFixed(1)} KB)</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(URL.createObjectURL(document))}
                                  className="text-green-600 border-green-200"
                                >
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={removeDocument}
                                  className="text-red-600 border-red-200"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {signupStep === 4 && formData.role === "farmer" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <Label>Aadhar Card Verification</Label>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Please verify your Aadhar card using the official UIDAI website. Follow these steps:
                        </p>
                        <ol className="list-decimal list-inside text-sm text-gray-600 mt-2">
                          <li>
                            Visit the official UIDAI website:{" "}
                            <a
                              href="https://uidai.gov.in/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 underline"
                            >
                              https://uidai.gov.in/
                            </a>
                            .
                          </li>
                          <li>Use the "Verify Aadhar" feature to verify your Aadhar card.</li>
                          <li>Once verified, take a screenshot of the verification page.</li>
                          <li>Upload the screenshot below as proof of verification.</li>
                        </ol>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Verification Screenshot</Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="verificationScreenshot"
                          onChange={handleVerificationScreenshotUpload}
                        />
                        <Label htmlFor="verificationScreenshot" className="cursor-pointer block text-center">
                          <Upload />
                          <span className="mt-2 text-sm text-gray-600 block">
                            Upload verification screenshot (Image)
                          </span>
                        </Label>

                        {verificationScreenshot && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{verificationScreenshot.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(verificationScreenshot.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(URL.createObjectURL(verificationScreenshot))}
                                  className="text-green-600 border-green-200"
                                >
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={removeVerificationScreenshot}
                                  className="text-red-600 border-red-200"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Skip step 4 for buyers and go directly to step 5 */}
                {signupStep === 4 && formData.role === "contractor" && (
                  <div className="space-y-4 animate-fadeIn">
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-2">
                        <div className="mb-4 space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            className="border-green-200 focus:ring-green-500"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value
                              setFormData({
                                ...formData,
                                phone: value,
                              })
                              if (value && value.length !== 10) {
                                setPhoneError("Phone number must be exactly 10 digits")
                              } else {
                                setPhoneError("")
                              }
                            }}
                            maxLength={10}
                            required
                          />
                          {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
                        </div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="border-green-200 focus:ring-green-500 pr-10"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? (
                              <Eye className="h-4 w-4 text-gray-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="border-green-200 focus:ring-green-500 pr-10"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showConfirmPassword ? (
                              <Eye className="h-4 w-4 text-gray-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                    {errorMessage && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-600">{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    {showSuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertDescription>Registration successful! Welcome to our farming community.</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {signupStep === 5 && formData.role === "farmer" && (
                  <div className="space-y-4 animate-fadeIn">
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-2">
                        <div className="mb-4 space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            className="border-green-200 focus:ring-green-500"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value
                              setFormData({
                                ...formData,
                                phone: value,
                              })
                              if (value && value.length !== 10) {
                                setPhoneError("Phone number must be exactly 10 digits")
                              } else {
                                setPhoneError("")
                              }
                            }}
                            maxLength={10}
                            required
                          />
                          {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
                        </div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="border-green-200 focus:ring-green-500 pr-10"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? (
                              <Eye className="h-4 w-4 text-gray-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="border-green-200 focus:ring-green-500 pr-10"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showConfirmPassword ? (
                              <Eye className="h-4 w-4 text-gray-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                    {errorMessage && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-600">{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    {showSuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertDescription>Registration successful! Welcome to our farming community.</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  {signupStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSignupStep((step) => step - 1)}
                      className="border-green-200 text-green-600"
                    >
                      Previous
                    </Button>
                  )}

                  {(signupStep < 5 && formData.role === "farmer") ||
                  (signupStep < 4 && formData.role === "contractor") ? (
                    <Button
                      type="button"
                      onClick={() => setSignupStep((step) => step + 1)}
                      className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        "Complete Signup"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthPage
