import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConcernsTable } from "@/components/admin/concerns-table"

export default function ConcernsPage() {
  return (
    <div className="flex flex-col gap-4  px-12 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Concerns & Disputes</h1>
        
      </div>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Concerns</CardTitle>
              <CardDescription>Concerns and disputes that need your attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <ConcernsTable status="pending" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inProgress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Concerns and disputes that are currently being addressed.</CardDescription>
            </CardHeader>
            <CardContent>
              <ConcernsTable status="inProgress" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved</CardTitle>
              <CardDescription>Concerns and disputes that have been resolved.</CardDescription>
            </CardHeader>
            <CardContent>
              <ConcernsTable status="resolved" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

