"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Edit, FileText, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useTranslate } from "@/lib/LanguageContext"

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
}

export default function ContractCard({
  contract,
  index,
  userRole,
  onView,
  onEdit,
  onDelete,
  onApprove,
  isDeleting,
  isApproving,
}) {
  const { t } = useTranslate()

  return (
    <motion.div
      key={contract.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        className={`h-full hover:shadow-lg transition-shadow duration-300 border-l-4 ${
          contract.status === "pending" ? "border-l-yellow-500" : "border-l-green-500"
        }`}
      >
        {contract.status === "active" ? (
          <Link href={`/contract/${contract.id}`} className="block">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{contract.crop}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={statusColors[contract.status]}>
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-500">{t('farmer', { en: 'Farmer', hi: 'किसान' })}</p>
                  <p className="font-medium">{contract.farmer}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('quantity', { en: 'Quantity', hi: 'मात्रा' })}</p>
                  <p className="font-medium">{contract.quantity} {t('kg', { en: 'kg', hi: 'किलो' })}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('price', { en: 'Price', hi: 'मूल्य' })}</p>
                  <p className="font-medium">₹{contract.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('delivery', { en: 'Delivery', hi: 'डिलीवरी' })}</p>
                  <p className="font-medium">{new Date(contract.deliveryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Link>
        ) : (
          <>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{contract.crop}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={statusColors[contract.status]}>
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-500">{t('farmer', { en: 'Farmer', hi: 'किसान' })}</p>
                  <p className="font-medium">{contract.farmer}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('quantity', { en: 'Quantity', hi: 'मात्रा' })}</p>
                  <p className="font-medium">{contract.quantity} {t('kg', { en: 'kg', hi: 'किलो' })}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('price', { en: 'Price', hi: 'मूल्य' })}</p>
                  <p className="font-medium">₹{contract.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('delivery', { en: 'Delivery', hi: 'डिलीवरी' })}</p>
                  <p className="font-medium">{new Date(contract.deliveryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="flex justify-between pt-2">
          <span className="text-xs text-gray-500">
            {t('createdOn', { en: 'Created on', hi: 'बनाया गया' })} {new Date(contract.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(contract)}
              className="hover:bg-gray-100"
            >
              <FileText className="h-4 w-4" />
            </Button>

            {/* Show edit/delete only for buyers */}
            {userRole === "contractor" && contract.status === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(contract)}
                  className="hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(contract.id)}
                  disabled={isDeleting}
                  className="hover:bg-gray-100"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  )}
                </Button>
              </>
            )}

            {/* Show approve button only for farmers on pending contracts */}
            {userRole === "farmer" && contract.status === "pending" && (
              <Button
                onClick={() => onApprove(contract.id)}
                className="bg-green-600 text-xs hover:bg-green-700"
                disabled={isApproving}
              >
                {isApproving ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  t('approve', { en: 'Approve', hi: 'अनुमोदित करें' })
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
