import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressTable } from "@/components/admin/progress-table"

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-4  px-12 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Progress Tracking</h1>
      
      </div>
      <Tabs defaultValue="farmers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="farmers">Farmers Progress</TabsTrigger>
          <TabsTrigger value="contractors">Contractors Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="farmers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Farmers Progress</CardTitle>
              <CardDescription>
                Track the progress of farmers including planting, harvesting, and delivery status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressTable userType="farmer" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contractors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contractors Progress</CardTitle>
              <CardDescription>
                Track the progress of contractors including payments and transaction receipts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressTable userType="contractor" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

