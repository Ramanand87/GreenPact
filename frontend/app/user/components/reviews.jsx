'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const reviews = [
  { id: 1, name: "Alice Smith", rating: 5, comment: "Excellent produce and timely delivery!" },
  { id: 2, name: "Bob Johnson", rating: 4, comment: "Good quality, but slightly delayed delivery." },
  { id: 3, name: "Carol Williams", rating: 5, comment: "Outstanding service and communication." },
]

export default function Reviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews & Ratings</CardTitle>
        <CardDescription>See what others are saying about your service</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                <AvatarFallback>
                  {review.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h4 className="font-semibold">{review.name}</h4>
                  <div className="ml-2 flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

