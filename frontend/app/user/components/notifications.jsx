import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, DollarSign, FileText } from "lucide-react"

const notifications = [
  { id: 1, type: "contract", message: "New contract proposal from BuyerCo" },
  { id: 2, type: "payment", message: "Payment of $5000 received for Contract #CT001" },
  { id: 3, type: "document", message: "Your certification has been approved" },
]

export default function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Stay updated with the latest activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                {notification.type === "contract" && <FileText className="h-5 w-5 text-blue-600" />}
                {notification.type === "payment" && <DollarSign className="h-5 w-5 text-green-600" />}
                {notification.type === "document" && <Bell className="h-5 w-5 text-yellow-600" />}
              </div>
              <div>
                <p className="text-sm">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

