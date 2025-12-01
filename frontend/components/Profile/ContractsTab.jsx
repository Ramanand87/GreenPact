"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Calendar, Clock, CreditCard, Package, MapPin, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function ContractsTab({ contracts }) {
  const { t } = useTranslate()

  const getStatusColor = (status) => {
    return status 
      ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
      : "bg-amber-100 text-amber-800 border-amber-200"
  }

  const getStatusIcon = (status) => {
    return status ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-2xl text-green-800">
                <FileText className="w-6 h-6 mr-3" />
                {t('contractDetails', { en: 'Contract Management', hi: 'अनुबंध प्रबंधन' })}
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {t('manageContracts', { en: 'Track and manage your ongoing and completed contracts', hi: 'अपने चल रहे और पूर्ण अनुबंधों को ट्रैक और प्रबंधित करें' })}
              </CardDescription>
            </div>
            {contracts?.data && contracts.data.length > 0 && (
              <div className="hidden md:flex items-center gap-4 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{contracts.data.length}</div>
                  <div className="text-xs text-gray-600">{t('totalContracts', { en: 'Total', hi: 'कुल' })}</div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Contracts List */}
      {contracts?.data && contracts.data.length > 0 ? (
        <div className="grid gap-6">
          {contracts.data.map((contract) => (
            <Card
              key={contract.contract_id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Header with Status */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {t('contract', { en: 'Contract', hi: 'अनुबंध' })} #{contract.contract_id.substring(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {contract.crop_name}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(contract.status)} border flex items-center gap-1.5 px-3 py-1 font-medium`}>
                    {getStatusIcon(contract.status)}
                    {contract.status ? t('active', { en: 'Active', hi: 'सक्रिय' }) : t('pending', { en: 'Pending', hi: 'लंबित' })}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Parties Involved */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
                      <User className="w-4 h-4 text-green-600" />
                      {t('parties', { en: 'Parties Involved', hi: 'शामिल पक्ष' })}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                        <div className="bg-green-100 p-2 rounded-full">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">{t('farmer', { en: 'Farmer', hi: 'किसान' })}</div>
                          <div className="font-medium text-gray-800">{contract.farmer_name}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">{t('buyer', { en: 'Buyer', hi: 'खरीददार' })}</div>
                          <div className="font-medium text-gray-800">{contract.buyer_name}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contract Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      {t('contractInfo', { en: 'Contract Information', hi: 'अनुबंध जानकारी' })}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{t('price', { en: 'Total Price', hi: 'कुल मूल्य' })}</span>
                        </div>
                        <span className="font-bold text-green-600 text-lg">₹{contract.nego_price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{t('quantity', { en: 'Quantity', hi: 'मात्रा' })}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{contract.quantity} {t('units', { en: 'units', hi: 'इकाइयां' })}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">{t('deliveryDate', { en: 'Delivery', hi: 'डिलीवरी' })}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{new Date(contract.delivery_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {t('deliveryAddress', { en: 'Delivery Address', hi: 'डिलीवरी पता' })}
                      </div>
                      <p className="text-gray-600">{contract.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{t('created', { en: 'Created on', hi: 'बनाया गया' })}: {new Date(contract.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  ID: <span className="font-mono text-gray-800">{contract.contract_id}</span>
                </div>
                <Link href={`/contract/${contract.contract_id}`}>
                  <Button className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
                    <FileText className="w-4 h-4 mr-2" />
                    {t('viewDetails', { en: 'View Full Details', hi: 'पूर्ण विवरण देखें' })}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('noContractsFound', { en: 'No Contracts Found', hi: 'कोई अनुबंध नहीं मिला' })}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('noContractsDesc', { en: 'There are no contracts associated with this account yet. Start creating contracts to see them here.', hi: 'इस खाते से अभी तक कोई अनुबंध नहीं जुड़ा है। उन्हें यहां देखने के लिए अनुबंध बनाना शुरू करें।' })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
