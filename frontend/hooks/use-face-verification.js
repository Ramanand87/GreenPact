import { useEffect, useState } from "react"
import * as faceapi from 'face-api.js'
import { toast } from "sonner"

export function useFaceVerification() {
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [storedDescriptor, setStoredDescriptor] = useState(null)
  const [verificationImage, setVerificationImage] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ])
        setModelsLoaded(true)
        console.log('Face-api.js models loaded successfully')
        
        const stored = localStorage.getItem('faceDescriptor')
        if (stored) {
          setStoredDescriptor(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading face-api.js models:', error)
        toast.error('Failed to load face recognition models')
      }
    }
    loadModels()
  }, [])

  const handleVerifyUser = async () => {
    if (!verificationImage || !modelsLoaded) {
      toast.error('Please wait for models to load or capture an image')
      return
    }

    setIsVerifying(true)
    try {
      const img = await faceapi.fetchImage(verificationImage)
      
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detection) {
        toast.error('No face detected. Please try again.')
        setVerificationStatus(false)
        setIsVerifying(false)
        return
      }

      if (!storedDescriptor) {
        const descriptorArray = Array.from(detection.descriptor)
        localStorage.setItem('faceDescriptor', JSON.stringify(descriptorArray))
        setStoredDescriptor(descriptorArray)
        setVerificationStatus(true)
        toast.success('Face registered successfully!')
      } else {
        const storedDescriptorFloat = new Float32Array(storedDescriptor)
        const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptorFloat)
        
        const threshold = 0.6
        const isMatch = distance < threshold
        
        console.log('Face comparison distance:', distance)
        
        if (isMatch) {
          setVerificationStatus(true)
          toast.success('Face verification successful!')
        } else {
          setVerificationStatus(false)
          toast.error(`Face doesn't match. Distance: ${distance.toFixed(2)}`)
        }
      }
    } catch (error) {
      console.error('Face verification error:', error)
      toast.error('Verification failed. Please try again.')
      setVerificationStatus(false)
    } finally {
      setIsVerifying(false)
    }
  }

  const retryVerification = () => {
    setVerificationImage(null)
    setVerificationStatus(null)
  }

  const resetFaceData = () => {
    localStorage.removeItem('faceDescriptor')
    setStoredDescriptor(null)
    toast.success('Face data reset successfully')
  }

  return {
    modelsLoaded,
    storedDescriptor,
    verificationImage,
    setVerificationImage,
    verificationStatus,
    setVerificationStatus,
    isVerifying,
    handleVerifyUser,
    retryVerification,
    resetFaceData,
  }
}
