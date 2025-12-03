"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { useTranslate } from "@/lib/LanguageContext"

export default function EditContractDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  deliveryDate,
  onDeliveryDateChange,
  onAddTerm,
  onRemoveTerm,
  onUpdate,
  isUpdating,
}) {
  const { t } = useTranslate()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editContract', { en: 'Edit Contract', hi: 'अनुबंध संपादित करें' })}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('deliveryAddress', { en: 'Delivery Address', hi: 'डिलीवरी पता' })}</label>
            <Input
              name="delivery_address"
              value={formData.delivery_address}
              onChange={onFormChange}
              placeholder={t('enterDeliveryAddress', { en: 'Enter delivery address', hi: 'डिलीवरी पता दर्ज करें' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('deliveryDate', { en: 'Delivery Date', hi: 'डिलीवरी तिथि' })}</label>
            <Input
              type="date"
              value={deliveryDate ? format(deliveryDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : new Date()
                onDeliveryDateChange(date)
              }}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('quantity', { en: 'Quantity (kg)', hi: 'मात्रा (किलो)' })}</label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={onFormChange}
                placeholder={t('enterQuantity', { en: 'Enter quantity', hi: 'मात्रा दर्ज करें' })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('negotiatedPrice', { en: 'Negotiated Price (₹)', hi: 'निर्धारित मूल्य (₹)' })}</label>
              <Input
                type="number"
                name="nego_price"
                value={formData.nego_price}
                onChange={onFormChange}
                placeholder={t('enterPrice', { en: 'Enter price', hi: 'मूल्य दर्ज करें' })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('terms', { en: 'Terms', hi: 'शर्तें' })}</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={formData.newTerm}
                onChange={(e) =>
                  onFormChange({
                    target: {
                      name: 'newTerm',
                      value: e.target.value
                    }
                  })
                }
                placeholder={t('addNewTerm', { en: 'Add new term', hi: 'नई शर्त जोड़ें' })}
              />
              <Button onClick={onAddTerm} variant="outline">
                {t('add', { en: 'Add', hi: 'जोड़ें' })}
              </Button>
            </div>
            <div className="space-y-2">
              {formData.terms.map((term, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{term}</span>
                  <Button variant="ghost" size="sm" onClick={() => onRemoveTerm(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onUpdate} className="bg-green-600 hover:bg-green-700" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
