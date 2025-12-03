"use client"

import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useTranslate } from "@/lib/LanguageContext"

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
}

export default function ViewContractDialog({
  open,
  onOpenChange,
  contract,
  userRole,
  onApprove,
  isApproving,
}) {
  const { t } = useTranslate()

  if (!contract) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('contractDetails', { en: 'Contract Details', hi: 'अनुबंध विवरण' })}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col px-4">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">{contract.crop} Contract</h2>
            <Badge className={statusColors[contract.status]}>
              {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-500">{t('crop', { en: 'Crop', hi: 'फसल' })}</h3>
                <p className="font-semibold">{contract.crop}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">{t('quantity', { en: 'Quantity', hi: 'मात्रा' })}</h3>
                <p className="font-semibold">{contract.quantity} {t('kg', { en: 'kg', hi: 'किलो' })}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-500">{t('negotiatedPrice', { en: 'Negotiated Price', hi: 'निर्धारित मूल्य' })}</h3>
                <p className="font-semibold">₹{contract.price.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">{t('deliveryDate', { en: 'Delivery Date', hi: 'डिलीवरी तिथि' })}</h3>
                <p className="font-semibold">{new Date(contract.deliveryDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">{t('deliveryAddress', { en: 'Delivery Address', hi: 'डिलीवरी पता' })}</h3>
              <p className="font-semibold">{contract.delivery_address}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">{t('parties', { en: 'Parties', hi: 'पक्ष' })}</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <h4 className="text-sm text-gray-500">{t('farmer', { en: 'Farmer', hi: 'किसान' })}</h4>
                  <p className="font-semibold">{contract.farmer}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">{t('buyer', { en: 'Buyer', hi: 'खरीददार' })}</h4>
                  <p className="font-semibold">{contract.buyer}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">{t('termsConditions', { en: 'Terms & Conditions', hi: 'नियम और शर्तें' })}</h3>
              <div className="mt-2 space-y-2 bg-gray-50 p-4 rounded-lg">
                {contract.terms.length > 0 ? (
                  contract.terms.map((term, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-sm">•</span>
                      <span className="text-sm">{term}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">{t('noTermsSpecified', { en: 'No terms specified', hi: 'कोई शर्तें निर्दिष्ट नहीं' })}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-500">Created On</h3>
                <p className="font-semibold">{new Date(contract.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Approval button inside contract details */}
            {userRole === "farmer" && contract.status === "pending" && (
              <div className="mt-4">
                <Button
                  onClick={() => onApprove(contract.id)}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t('processing', { en: 'Processing...', hi: 'प्रसंस्करण हो रहा है...' })}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" /> {t('approveContract', { en: 'Approve Contract', hi: 'अनुबंध अनुमोदित करें' })}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
