import { useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useUpdateContractMutation, useDeleteContractMutation } from "@/redux/Service/contract"
import { useUpdateProfileMutation, useGetProfileQuery } from "@/redux/Service/profileApi"

export function useContractOperations(ws, token, currentUser) {
    
  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation()
  const [deleteContract, { isLoading: isDeleting }] = useDeleteContractMutation()
  const [updateProfile] = useUpdateProfileMutation()
  const { data: profileData } = useGetProfileQuery(currentUser)
  
  const [deletingIds, setDeletingIds] = useState([])
  const [approvingIds, setApprovingIds] = useState([])
  const [qrCodeUploading, setQrCodeUploading] = useState(false)
  const [qrCodeUploaded, setQrCodeUploaded] = useState(false)
  
  // Check if user already has QR code in profile
  const existingQrCode = profileData?.data?.qr_code_image || null
  const hasExistingQrCode = !!existingQrCode

  const handleUpdate = async (contractId, formData, deliveryDate, currentStatus) => {
    try {
      const updatedData = {
        delivery_address: formData.delivery_address,
        delivery_date: format(deliveryDate, "yyyy-MM-dd"),
        quantity: Number(formData.quantity),
        nego_price: Number(formData.nego_price),
        terms: formData.terms,
        status: currentStatus === "active",
      }

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            token: token,
            action: "update_contract",
            contract_id: contractId,
            data: updatedData,
          }),
        )
      }

      await updateContract({
        contract_id: contractId,
        updatedData: updatedData,
      }).unwrap()

      toast.success("Contract Updated", {
        description: "The contract has been successfully updated.",
      })
      return true
    } catch (error) {
      console.error("Failed to update contract:", error)
      toast.error("Update Failed", {
        description: "There was an error updating the contract.",
      })
      return false
    }
  }

  const handleDelete = async (contractId) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      try {
        setDeletingIds((prev) => [...prev, contractId])

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(
            JSON.stringify({
              token: token,
              action: "delete_contract",
              contract_id: contractId,
            }),
          )
        }

        await deleteContract(contractId).unwrap()

        toast.success("Contract Deleted", {
          description: "The contract has been successfully deleted.",
        })
      } catch (error) {
        console.error("Failed to delete contract:", error)
        toast.error("Delete Failed", {
          description: "There was an error deleting the contract.",
        })
      } finally {
        setDeletingIds((prev) => prev.filter((id) => id !== contractId))
      }
    }
  }

  const handleApprove = (contractId, verificationStatus, qrCodeUploaded, onSuccess) => {
    if (!verificationStatus) {
      toast.error("Please complete verification first")
      return
    }

    // Only require QR code upload if user doesn't have one in their profile
    if (!hasExistingQrCode && !qrCodeUploaded) {
      toast.error("Please upload QR code first")
      return
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      setApprovingIds((prev) => [...prev, contractId])

      ws.current.send(
        JSON.stringify({
          token: token,
          contract_id: contractId,
          action: "approve_contracts",
        }),
      )

      toast.success("Contract Approved", {
        description: "The contract has been successfully approved.",
      })

      setTimeout(() => {
        setApprovingIds((prev) => prev.filter((id) => id !== contractId))
      }, 1000)

      if (onSuccess) onSuccess()
    }
  }

  const handleQrCodeUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setQrCodeUploading(true)

      try {
        const formData = new FormData()
        formData.append("qr_code_image", file)

        await updateProfile(formData).unwrap()
        toast.success("QR code uploaded successfully")
        setQrCodeUploaded(true)
      } catch (error) {
        console.error("Failed to upload QR code:", error)
        toast.error("Failed to upload QR code")
      } finally {
        setQrCodeUploading(false)
      }
    }
  }

  const resetQrCode = () => {
    setQrCodeUploaded(false)
  }

  return {
    handleUpdate,
    handleDelete,
    handleApprove,
    handleQrCodeUpload,
    isUpdating,
    isDeleting,
    deletingIds,
    approvingIds,
    qrCodeUploading,
    qrCodeUploaded,
    setQrCodeUploaded,
    resetQrCode,
    existingQrCode,
    hasExistingQrCode,
  }
}
