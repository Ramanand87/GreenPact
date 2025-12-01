"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, FileText } from "lucide-react"
import { useTranslate } from "@/lib/LanguageContext"

export function PaymentsTab({ payments, paymentLoading, userRole, currentUser, router }) {
  const { t } = useTranslate()

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <CardTitle className="flex items-center text-green-800">
          <CreditCard className="w-5 h-5 mr-2" />
          {t('paymentHistory', { en: 'Payment History', hi: 'भुगतान इतिहास' })}
        </CardTitle>
        <CardDescription>
          {t('viewAllPayments', { en: 'View all payment transactions made and received', hi: 'किए गए और प्राप्त सभी भुगतान लेन-देन देखें' })}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {paymentLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : payments?.data && payments.data.length > 0 ? (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-3 text-gray-700">
                      {t('paymentID', { en: 'Payment ID', hi: 'भुगतान ID' })}
                    </th>
                    <th className="text-left p-3 text-gray-700">
                      {t('date', { en: 'Date', hi: 'तारीख' })}
                    </th>
                    <th className="text-left p-3 text-gray-700">
                      {t('description', { en: 'Description', hi: 'विवरण' })}
                    </th>
                    <th className="text-left p-3 text-gray-700">
                      {t('amount', { en: 'Amount', hi: 'राशि' })}
                    </th>
                    {userRole === "farmer" && (
                      <th className="text-left p-3 text-gray-700">
                        {t('buyer', { en: 'Buyer', hi: 'खरीददार' })}
                      </th>
                    )}
                    {userRole === "contractor" && (
                      <th className="text-left p-3 text-gray-700">
                        {t('farmer', { en: 'Farmer', hi: 'किसान' })}
                      </th>
                    )}
                    {userRole !== "farmer" && userRole !== "contractor" && (
                      <>
                        <th className="text-left p-3 text-gray-700">
                          {t('from', { en: 'From', hi: 'से' })}
                        </th>
                        <th className="text-left p-3 text-gray-700">
                          {t('to', { en: 'To', hi: 'तक' })}
                        </th>
                      </>
                    )}
                    <th className="text-left p-3 text-gray-700">
                      {t('receipt', { en: 'Receipt', hi: 'रसीद' })}
                    </th>
                    <th className="text-left p-3 text-gray-700">
                      {t('actions', { en: 'Actions', hi: 'कार्रवाई' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.data.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3 text-gray-700">
                        PAY-{payment.id.toString().slice(-6)}
                      </td>
                      <td className="p-3 text-gray-700">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-700">
                        {payment.description}
                      </td>
                      <td className="p-3 text-gray-700 font-medium">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      {userRole === "farmer" && (
                        <td className="p-3 text-gray-700">
                          <Badge variant="outline" className="border-blue-200">
                            {payment.buyer}
                          </Badge>
                        </td>
                      )}
                      {userRole === "contractor" && (
                        <td className="p-3 text-gray-700">
                          <Badge variant="outline" className="border-green-200">
                            {payment.farmer}
                          </Badge>
                        </td>
                      )}
                      {userRole !== "farmer" && userRole !== "contractor" && (
                        <>
                          <td className="p-3 text-gray-700">
                            <Badge variant="outline" className="border-blue-200">
                              {payment.buyer}
                            </Badge>
                          </td>
                          <td className="p-3 text-gray-700">
                            <Badge variant="outline" className="border-green-200">
                              {payment.farmer}
                            </Badge>
                          </td>
                        </>
                      )}
                      <td className="p-3">
                        {payment.receipt ? (
                          <a
                            href={payment.receipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {t('viewReceipt', { en: 'View Receipt', hi: 'रसीद देखें' })}
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            {t('noReceipt', { en: 'No receipt', hi: 'कोई रसीद नहीं' })}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size=""
                          className="text-gray-900 hover:text-green-700"
                          onClick={() => router.push(`/contract/${payment.contract}`)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          {t('viewContract', { en: 'View Contract', hi: 'अनुबंध देखें' })}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRole !== "farmer" && (
                <Card className="border border-green-100">
                  <CardHeader className="bg-green-50 p-4">
                    <CardTitle className="text-green-800 text-lg">
                      {t('totalPaymentsMade', { en: 'Total Payments Made', hi: 'कुल भुगतान किया गया' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-green-700">
                      ₹
                      {payments.data
                        .filter((p) => p.buyer === currentUser)
                        .reduce((sum, payment) => sum + payment.amount, 0)
                        .toLocaleString()}
                    </div>
                    <p className="text-gray-500 mt-2">
                      {payments.data.filter((p) => p.buyer === currentUser).length}{" "}
                      {t('transactions', { en: 'transactions', hi: 'लेन-देन' })}
                    </p>
                  </CardContent>
                </Card>
              )}

              {userRole !== "contractor" && (
                <Card className="border border-blue-100">
                  <CardHeader className="bg-blue-50 p-4">
                    <CardTitle className="text-blue-800 text-lg">
                      {t('totalPaymentsReceived', { en: 'Total Payments Received', hi: 'कुल भुगतान प्राप्त हुआ' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-blue-700">
                      ₹
                      {payments.data
                        .filter((p) => p.farmer === currentUser)
                        .reduce((sum, payment) => sum + payment.amount, 0)
                        .toLocaleString()}
                    </div>
                    <p className="text-gray-500 mt-2">
                      {payments.data.filter((p) => p.farmer === currentUser).length}{" "}
                      transactions
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {t('noPaymentHistory', { en: 'No Payment History', hi: 'कोई भुगतान इतिहास नहीं' })}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {t('noPaymentHistoryDesc', { en: 'There are no payment transactions recorded yet.', hi: 'अभी तक कोई भुगतान लेन-देन दर्ज नहीं किया गया है।' })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
