"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, CheckCircle2, AlertCircle, Image as ImageIcon, Calendar, User, FileText } from "lucide-react"
import { format } from "date-fns"
import { useTranslate } from "@/lib/LanguageContext"
import { useGetComplaintsQuery } from "@/redux/Service/complaintApi"

export function ComplaintHistoryDialog({ currentUser }) {
  const { t } = useTranslate()
  const [complaintHistoryOpen, setComplaintHistoryOpen] = useState(false)
  const { data: complaintsData, isLoading, error } = useGetComplaintsQuery(undefined, {
    skip: !complaintHistoryOpen,
  })

  const complaints = complaintsData || []
  const userComplaints = complaints.filter(c => c.complainant === currentUser)

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === "pending") {
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    } else if (statusLower === "resolved") {
      return "bg-green-100 text-green-800 border-green-300"
    } else {
      return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPriorityBadge = (priority) => {
    const priorityLower = priority.toLowerCase()
    if (priorityLower === "high") {
      return "bg-red-100 text-red-800 border-red-300"
    } else if (priorityLower === "medium") {
      return "bg-orange-100 text-orange-800 border-orange-300"
    } else {
      return "bg-blue-100 text-blue-800 border-blue-300"
    }
  }

  return (
    <Dialog open={complaintHistoryOpen} onOpenChange={setComplaintHistoryOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          {t('complaintHistory', { en: 'Complaint History', hi: 'शिकायत इतिहास' })}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {t('complaintHistory', { en: 'Complaint History', hi: 'शिकायत इतिहास' })}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="all" className="w-full overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="all">{t('all', { en: 'All', hi: 'सभी' })}</TabsTrigger>
            <TabsTrigger value="pending">{t('pending', { en: 'Pending', hi: 'लंबित' })}</TabsTrigger>
            <TabsTrigger value="resolved">{t('resolved', { en: 'Resolved', hi: 'हल हो गया' })}</TabsTrigger>
          </TabsList>
          
          {/* All Tab */}
          <TabsContent value="all" className="mt-4 overflow-hidden">
            <ScrollArea className="h-[450px] pr-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : userComplaints.length > 0 ? (
                <div className="space-y-4">
                  {userComplaints.map((complaint) => (
                    <Card key={complaint.id} className="overflow-hidden border-l-4 border-l-green-500">
                      <CardHeader className="p-4 pb-2 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <CardTitle className="text-base font-semibold">{complaint.category}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(complaint.created_at), "MMM dd, yyyy 'at' hh:mm a")}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant="outline" className={getStatusBadge(complaint.status)}>
                              {complaint.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityBadge(complaint.priority)}>
                              {complaint.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">{t('description', { en: 'Description', hi: 'विवरण' })}:</p>
                            <p className="text-sm text-gray-600">{complaint.description}</p>
                          </div>
                          
                          {complaint.accused && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">
                                {t('accused', { en: 'Accused', hi: 'आरोपी' })}: <span className="font-medium text-gray-900">@{complaint.accused}</span>
                              </span>
                            </div>
                          )}

                          {complaint.proof && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">{t('proof', { en: 'Proof', hi: 'सबूत' })}:</span>
                              </div>
                              <img 
                                src={complaint.proof} 
                                alt="Complaint proof" 
                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}

                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              {t('complaintId', { en: 'Complaint ID', hi: 'शिकायत ID' })}: #{complaint.id}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">{t('noComplaints', { en: 'No complaints found', hi: 'कोई शिकायत नहीं मिली' })}</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="mt-4 overflow-hidden">
            <ScrollArea className="h-[450px] pr-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : userComplaints.filter((c) => c.status.toLowerCase() === "pending").length > 0 ? (
                <div className="space-y-4">
                  {userComplaints
                    .filter((complaint) => complaint.status.toLowerCase() === "pending")
                    .map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden border-l-4 border-l-yellow-500">
                        <CardHeader className="p-4 pb-2 bg-gradient-to-r from-yellow-50 to-white">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <CardTitle className="text-base font-semibold">{complaint.category}</CardTitle>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-3 h-3" />
                                <span>{format(new Date(complaint.created_at), "MMM dd, yyyy 'at' hh:mm a")}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge variant="outline" className={getStatusBadge(complaint.status)}>
                                {complaint.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityBadge(complaint.priority)}>
                                {complaint.priority}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">{t('description', { en: 'Description', hi: 'विवरण' })}:</p>
                              <p className="text-sm text-gray-600">{complaint.description}</p>
                            </div>
                            
                            {complaint.accused && (
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">
                                  {t('accused', { en: 'Accused', hi: 'आरोपी' })}: <span className="font-medium text-gray-900">@{complaint.accused}</span>
                                </span>
                              </div>
                            )}

                            {complaint.proof && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <ImageIcon className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">{t('proof', { en: 'Proof', hi: 'सबूत' })}:</span>
                                </div>
                                <img 
                                  src={complaint.proof} 
                                  alt="Complaint proof" 
                                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}

                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500">
                                {t('complaintId', { en: 'Complaint ID', hi: 'शिकायत ID' })}: #{complaint.id}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <CheckCircle2 className="w-12 h-12 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">{t('noPendingComplaints', { en: 'No pending complaints', hi: 'कोई लंबित शिकायतें नहीं' })}</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Resolved Tab */}
          <TabsContent value="resolved" className="mt-4 overflow-hidden">
            <ScrollArea className="h-[450px] pr-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : userComplaints.filter((c) => c.status.toLowerCase() === "resolved").length > 0 ? (
                <div className="space-y-4">
                  {userComplaints
                    .filter((complaint) => complaint.status.toLowerCase() === "resolved")
                    .map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden border-l-4 border-l-green-500">
                        <CardHeader className="p-4 pb-2 bg-gradient-to-r from-green-50 to-white">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <CardTitle className="text-base font-semibold">{complaint.category}</CardTitle>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-3 h-3" />
                                <span>{format(new Date(complaint.created_at), "MMM dd, yyyy 'at' hh:mm a")}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge variant="outline" className={getStatusBadge(complaint.status)}>
                                {complaint.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityBadge(complaint.priority)}>
                                {complaint.priority}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">{t('description', { en: 'Description', hi: 'विवरण' })}:</p>
                              <p className="text-sm text-gray-600">{complaint.description}</p>
                            </div>
                            
                            {complaint.accused && (
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">
                                  {t('accused', { en: 'Accused', hi: 'आरोपी' })}: <span className="font-medium text-gray-900">@{complaint.accused}</span>
                                </span>
                              </div>
                            )}

                            {complaint.proof && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <ImageIcon className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">{t('proof', { en: 'Proof', hi: 'सबूत' })}:</span>
                                </div>
                                <img 
                                  src={complaint.proof} 
                                  alt="Complaint proof" 
                                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}

                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500">
                                {t('complaintId', { en: 'Complaint ID', hi: 'शिकायत ID' })}: #{complaint.id} • {t('resolved', { en: 'Resolved on', hi: 'हल किया गया' })} {format(new Date(complaint.updated_at), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <CheckCircle2 className="w-12 h-12 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">{t('noResolvedComplaints', { en: 'No resolved complaints', hi: 'कोई हल हुई शिकायतें नहीं' })}</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
