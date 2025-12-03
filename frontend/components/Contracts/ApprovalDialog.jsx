"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Check, FileText, Loader2, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Webcam from "react-webcam"
import { useTranslate } from "@/lib/LanguageContext"

export default function ApprovalDialog({
  open,
  onOpenChange,
  verificationStatus,
  setVerificationStatus,
  verificationImage,
  setVerificationImage,
  isVerifying,
  modelsLoaded,
  storedDescriptor,
  handleVerifyUser,
  handleQrCodeUpload,
  qrCodeUploading,
  qrCodeUploaded,
  onApprove,
  onRetry,
  existingQrCode,
  hasExistingQrCode,
}) {
  const { t } = useTranslate()
  const webcamRef = useRef(null)
  const [showUploadNewQr, setShowUploadNewQr] = useState(false)

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setVerificationImage(imageSrc)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {verificationStatus === null
              ? t('identityVerificationRequired', { en: 'Identity Verification Required', hi: 'पहचान सत्यापन आवश्यक' })
              : verificationStatus
                ? t('confirmContractApproval', { en: 'Confirm Contract Approval', hi: 'अनुबंध अनुमोदन की पुष्टि करें' })
                : t('verificationFailed', { en: 'Verification Failed', hi: 'सत्यापन विफल' })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {verificationStatus === null
              ? t('verifyIdentityBeforeApproval', { en: 'Please verify your identity before approving this contract.', hi: 'कृपया इस अनुबंध को अनुमोदित करने से पहले अपनी पहचान सत्यापित करें।' })
              : verificationStatus
                ? t('confirmApprovalMessage', { en: 'Are you sure you want to approve this contract? This action cannot be undone.', hi: 'क्या आप वाकई इस अनुबंध को अनुमोदित करना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।' })
                : t('faceDoesntMatch', { en: 'Face doesn\'t match our records. Please try again.', hi: 'चेहरा हमारे रिकॉर्ड से मेल नहीं खाता। कृपया पुनः प्रयास करें।' })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {verificationStatus === null ? (
          <div className="my-4">
            {!modelsLoaded && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t('loadingFaceRecognition', { en: 'Loading face recognition models...', hi: 'चेहरा पहचान मॉडल लोड हो रहे हैं...' })}
                </p>
              </div>
            )}
            {!storedDescriptor && modelsLoaded && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {t('firstTimeRegistration', { en: 'First time: Your face will be registered for future verifications.', hi: 'पहली बार: आपका चेहरा भविष्य के सत्यापन के लिए पंजीकृत किया जाएगा।' })}
                </p>
              </div>
            )}
            {!verificationImage ? (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full"
                  />
                </div>
                <Button onClick={captureImage} className="w-full" disabled={!modelsLoaded}>
                  <Camera className="h-4 w-4 mr-2" />
                  {t('capturePhoto', { en: 'Capture Photo', hi: 'फोटो खींचें' })}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <img src={verificationImage || "/placeholder.svg"} alt="Verification capture" className="w-full" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={onRetry} variant="outline" className="w-full">
                    {t('retakePhoto', { en: 'Retake Photo', hi: 'फिर से फोटो लें' })}
                  </Button>
                  <Button onClick={handleVerifyUser} className="w-full" disabled={isVerifying}>
                    {isVerifying ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {t('verifyIdentity', { en: 'Verify Identity', hi: 'पहचान सत्यापित करें' })}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : verificationStatus ? (
          <div className="my-4 space-y-4">
            {hasExistingQrCode && !showUploadNewQr ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-center">{t('existingQrCode', { en: 'Your QR Code', hi: 'आपका QR कोड' })}</h3>
                <div className="border-2 border-green-300 rounded-lg overflow-hidden p-6 bg-green-50">
                  <img 
                    src={existingQrCode} 
                    alt="Existing QR Code" 
                    className="w-full max-w-sm mx-auto rounded"
                  />
                </div>
               
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowUploadNewQr(true)}
                >
                  {t('uploadNewQrCode', { en: 'Upload New QR Code', hi: 'नया QR कोड अपलोड करें' })}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">{t('uploadQrCodeImage', { en: 'Upload QR Code Image', hi: 'QR कोड छवि अपलोड करें' })}</h3>
                  {hasExistingQrCode && showUploadNewQr && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowUploadNewQr(false)}
                    >
                      {t('useExisting', { en: 'Use Existing', hi: 'मौजूदा उपयोग करें' })}
                    </Button>
                  )}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Input
                    type="file"
                    id="qr_code_image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleQrCodeUpload}
                  />
                  <label
                    htmlFor="qr_code_image"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="bg-gray-100 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium">
                      {qrCodeUploaded ? t('qrCodeUploaded', { en: 'QR Code Uploaded ✓', hi: 'QR कोड अपलोड ✓' }) : t('clickToUploadQr', { en: 'Click to upload QR code', hi: 'QR कोड अपलोड करने के लिए क्लिक करें' })}
                    </span>
                    <span className="text-xs text-gray-500">{t('qrCodeFileSize', { en: 'PNG, JPG up to 5MB', hi: 'PNG, JPG 5MB तक' })}</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <AlertDialogCancel>{t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}</AlertDialogCancel>
              <AlertDialogAction
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700"
                disabled={qrCodeUploading || (!hasExistingQrCode && !qrCodeUploaded) || (showUploadNewQr && !qrCodeUploaded)}
              >
                {qrCodeUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('uploading', { en: 'Uploading...', hi: 'अपलोड हो रहा है...' })}
                  </>
                ) : (
                  t('yesApproveContract', { en: 'Yes, Approve Contract', hi: 'हां, अनुबंध अनुमोदित करें' })
                )}
              </AlertDialogAction>
            </div>
          </div>
        ) : (
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}</AlertDialogCancel>
            <Button onClick={onRetry}>{t('tryAgain', { en: 'Try Again', hi: 'पुनः प्रयास करें' })}</Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
