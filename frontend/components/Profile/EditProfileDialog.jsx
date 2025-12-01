"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Webcam from "react-webcam"
import { useTranslate } from "@/lib/LanguageContext"
import { Camera, X, User, Phone, MapPin, Loader2, QrCode, Upload } from "lucide-react"

export function EditProfileDialog({ 
  editOpen, 
  setEditOpen, 
  phone, 
  setPhone, 
  address, 
  setAddress,
  profilePic,
  setProfilePic,
  qrCodeImage,
  setQrCodeImage,
  handleProfileSubmit,
  isUpdatingProfile
}) {
  const { t } = useTranslate()
  const webcamRef = useRef(null)
  const [showWebcam, setShowWebcam] = useState(false)

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setProfilePic(imageSrc)
    setShowWebcam(false)
  }

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setQrCodeImage(file)
    }
  }

  const handleRemovePhoto = () => {
    setProfilePic("")
    setShowWebcam(false)
  }

  const handleRemoveQrCode = () => {
    setQrCodeImage("")
  }

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-semibold text-green-800 flex items-center gap-2">
            <User className="w-6 h-6" />
            {t('editProfile', { en: 'Edit Profile', hi: 'प्रोफ़ाइल संपादित करें' })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Profile Picture and QR Code Section - Side by Side on Large Screens */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Profile Picture Section */}
            <div className="flex-1 flex flex-col items-center space-y-4 bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
              <Label className="text-base font-semibold text-gray-700">
                {t('profilePicture', { en: 'Profile Picture', hi: 'प्रोफ़ाइल चित्र' })}
              </Label>
            
            {/* Current Profile Picture */}
            {profilePic && !showWebcam && (
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={profilePic || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  title={t('removePhoto', { en: 'Remove Photo', hi: 'फोटो हटाएं' })}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Webcam View */}
            {showWebcam && (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden shadow-lg border-4 border-white">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-64 h-64 object-cover"
                    videoConstraints={{
                      width: 640,
                      height: 640,
                      facingMode: "user"
                    }}
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handleCapture}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {t('capturePhoto', { en: 'Capture Photo', hi: 'फोटो खींचें' })}
                  </Button>
                  <Button
                    onClick={() => setShowWebcam(false)}
                    variant="outline"
                    className="border-gray-300"
                  >
                    {t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!showWebcam && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowWebcam(true)}
                  variant="outline"
                  className="border-green-300 hover:bg-green-50 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {t('useCamera', { en: 'Use Camera', hi: 'कैमरा उपयोग करें' })}
                </Button>
              </div>
            )}
          </div>

          {/* QR Code Image Upload */}
          <div className="flex-1 space-y-3 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
            <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              {t('qrCodeImage', { en: 'QR Code / Payment Image', hi: 'QR कोड / भुगतान छवि' })}
            </Label>
            <p className="text-xs text-gray-600">
              {t('qrCodeDescription', { en: 'Upload your payment QR code or UPI image', hi: 'अपना भुगतान QR कोड या UPI छवि अपलोड करें' })}
            </p>

            <div className="flex flex-col items-center space-y-3">
              {qrCodeImage && (
                <div className="relative group">
                  <div className="w-48 h-48 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={typeof qrCodeImage === 'string' ? qrCodeImage : URL.createObjectURL(qrCodeImage)}
                      alt="QR Code"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRemoveQrCode}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    title={t('removeQrCode', { en: 'Remove QR Code', hi: 'QR कोड हटाएं' })}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <Label htmlFor="qr-code-upload">
                <div className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-100 hover:border-blue-500 transition-all text-sm font-medium bg-white shadow-sm">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">
                    {qrCodeImage 
                      ? t('changeQrCode', { en: 'Change QR Code', hi: 'QR कोड बदलें' })
                      : t('uploadQrCode', { en: 'Upload QR Code', hi: 'QR कोड अपलोड करें' })
                    }
                  </span>
                </div>
                <input
                  id="qr-code-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleQrCodeUpload}
                  className="hidden"
                />
              </Label>
            </div>
          </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              {t('phoneNumber', { en: 'Phone Number', hi: 'फ़ोन नंबर' })}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('enterPhoneNumber', { en: 'Enter phone number', hi: 'फ़ोन नंबर दर्ज करें' })}
              className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              {t('address', { en: 'Address', hi: 'पता' })}
            </Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('enterAddress', { en: 'Enter your complete address', hi: 'अपना पूरा पता दर्ज करें' })}
              className="min-h-[100px] border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="border-t pt-4 gap-2">
          <Button
            onClick={() => setEditOpen(false)}
            variant="outline"
            className="border-gray-300"
            disabled={isUpdatingProfile}
          >
            {t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}
          </Button>
          <Button
            onClick={handleProfileSubmit}
            className="bg-green-600 hover:bg-green-700 px-6"
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('saving', { en: 'Saving...', hi: 'सहेजा जा रहा है...' })}
              </>
            ) : (
              t('saveChanges', { en: 'Save Changes', hi: 'परिवर्तन सहेजें' })
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

