"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TractorIcon as Farmer,
  Factory,
  HelpCircle,
  BookOpen,
  ThumbsUp,
  VolumeX,
  Volume2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { FeedbackForm } from "../../components/helpandsupport/feedback-form"
import { ResourcesSection } from "../../components/helpandsupport/resource-section"
import { FAQSection } from "../../components/helpandsupport/faqs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

export default function HelpAndSupport() {
  const userInfo = useSelector((state) => state.auth.userInfo)
  const role = userInfo?.role
  console.log(userInfo)
  const currentUser = userInfo?.data?.username
  console.log(currentUser)

  const [audioEnabled, setAudioEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState("farmer")
  const [complaintOpen, setComplaintOpen] = useState(false)
  const [complaintData, setComplaintData] = useState({
    name: "",
    email: "",
    complaint: "",
    username: currentUser || "",
    userType: role || "", // make sure role is available
  })

  const [complaintHistoryOpen, setComplaintHistoryOpen] = useState(false)
  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (complaintHistoryOpen) {
      fetchComplaints()
    }
  }, [complaintHistoryOpen])

  const fetchComplaints = async () => {
    if (!currentUser) return

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:7000/complaintsAttachment?username=${currentUser}`)
      if (response.ok) {
        const data = await response.json()
        setComplaints(data)
      } else {
        toast("Error fetching complaints", {
          description: "Failed to load your complaint history.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
      toast("Error", {
        description: "Something went wrong while loading your complaints.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }

  const handleComplaintSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:7000/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      })

      if (response.ok) {
        setComplaintData({
          name: "",
          email: "",
          username: currentUser,
          userType: role,
          complaint: "",
        })
        setComplaintOpen(false)
        toast("Complaint Submitted Successfully", {
          description: "We have received your complaint and will address it soon.",
          action: <CheckCircle2 className="text-green-500" />,
        })
      } else {
        throw new Error("Failed to submit complaint")
      }
    } catch (error) {
      toast("Error Submitting Complaint", {
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
        action: <AlertCircle className="text-red-500" />,
      })
      console.log(error)
    }
  }

  const handleComplaintChange = (e) => {
    const { name, value } = e.target
    setComplaintData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Complaint Button at the top */}
      <div className="flex justify-end mb-4 gap-2">
        <Dialog open={complaintHistoryOpen} onOpenChange={setComplaintHistoryOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Complaint History
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Complaint History
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Loading complaints...</p>
                    </div>
                  ) : complaints.filter((c) => c.status === "Pending").length > 0 ? (
                    <div className="space-y-4">
                      {complaints
                        .filter((complaint) => complaint.status === "Pending")
                        .map((complaint) => (
                          <Card key={complaint._id} className="overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">{complaint.name}</CardTitle>
                                  <CardDescription>{complaint.email}</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  {complaint.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <p className="text-sm mb-2">{complaint.complaint}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Submitted: {format(new Date(complaint.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                                
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <CheckCircle2 className="w-12 h-12 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">No pending complaints</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="resolved" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Loading complaints...</p>
                    </div>
                  ) : complaints.filter((c) => c.status === "Resolved").length > 0 ? (
                    <div className="space-y-4">
                      {complaints
                        .filter((complaint) => complaint.status === "Resolved")
                        .map((complaint) => (
                          <Card key={complaint._id} className="overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">{complaint.name}</CardTitle>
                                  <CardDescription>{complaint.email}</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                  {complaint.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <p className="text-sm mb-2">{complaint.complaint}</p>
                              {complaint.response && complaint.response.length > 0 && (
                                <div className="bg-muted p-3 rounded-md mt-2">
                                  <p className="text-sm font-medium">Response:</p>
                                  <p className="text-sm">{complaint.response[0].message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {format(new Date(complaint.response[0].respondedAt), "MMM d, yyyy 'at' h:mm a")}
                                  </p>
                                </div>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Submitted: {format(new Date(complaint.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                                
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <AlertCircle className="w-12 h-12 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">No resolved complaints</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        <Dialog open={complaintOpen} onOpenChange={setComplaintOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              File a Complaint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Submit Your Complaint
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={complaintData.name} onChange={handleComplaintChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={complaintData.email}
                  onChange={handleComplaintChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complaint">Complaint Details</Label>
                <Textarea
                  id="complaint"
                  name="complaint"
                  value={complaintData.complaint}
                  onChange={handleComplaintChange}
                  rows={5}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setComplaintOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive">
                  Submit Complaint
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        className="flex flex-col items-center justify-between mb-8 space-y-4 md:flex-row md:space-y-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/20">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Help & Support</h1>
        </div>
      </motion.div>

      <Tabs defaultValue="farmer" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-auto bg-accent/20 p-1 border-2 border-primary/20">
          <TabsTrigger
            value="farmer"
            className="py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <div className="flex flex-col items-center space-y-2">
              <Farmer className="w-8 h-8" />
              <span className="text-lg">For Farmers</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="contractor"
            className="py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <div className="flex flex-col items-center space-y-2">
              <Factory className="w-8 h-8" />
              <span className="text-lg">For Contractors</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="farmer">
          <motion.div
            className="grid gap-6 mt-6 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader className="bg-primary/20 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-6 h-6" />
                    <span>Farmer Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResourcesSection userType="farmer" />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="contractor">
          <motion.div
            className="grid gap-6 mt-6 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader className="bg-primary/20 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-6 h-6" />
                    <span>Contractor Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResourcesSection userType="contractor" />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
      <motion.div
        className="mt-12 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Card>
          <CardHeader className="bg-primary/20 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <ThumbsUp className="w-6 h-6" />
              <span>FAQs</span>
            </CardTitle>
            <CardDescription>Help us improve our platform by sharing your experience</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FAQSection userType={activeTab} />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        className="mt-12 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Card>
          <CardHeader className="bg-primary/20 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <ThumbsUp className="w-6 h-6" />
              <span>Share Your Feedback</span>
            </CardTitle>
            <CardDescription>Help us improve our platform by sharing your experience</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FeedbackForm userType={activeTab} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
