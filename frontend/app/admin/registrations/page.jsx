"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentRegistrations } from "@/components/admin/recent-registrations"
import { Toaster } from "@/components/ui/toaster"

export default function RegistrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col gap-4 px-12 py-4">
      <div className="flex items-center justify-between">
       
       
      </div>
      <Tabs defaultValue="pending" className="space-y-4">
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            
            <CardContent>
              <RecentRegistrations />
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
      <Toaster />
    </div>
  )
}
