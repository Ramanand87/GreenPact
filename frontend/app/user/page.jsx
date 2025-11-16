"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Upload } from "lucide-react"
import ProfileInfo from "./components/profile-info.jsx"
import ContractDetails from "./components/contract-details.jsx"
import Documents from "./components/documents.jsx"
import Reviews from "./components/reviews.jsx"
import Notifications from "./components/notifications.jsx"
import PaymentDetails from "./components/payment-details.jsx"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="container mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile Picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">John Doe</h1>
                  <p className="text-gray-500">Farmer</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Change Picture
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileInfo isEditing={isEditing} />
          </TabsContent>
          <TabsContent value="contracts">
            <ContractDetails />
          </TabsContent>
          <TabsContent value="documents">
            <Documents />
          </TabsContent>
          <TabsContent value="reviews">
            <Reviews />
          </TabsContent>
          <TabsContent value="notifications">
            <Notifications />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentDetails />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

