"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function ConcernsTable({ status }) {
  const [complaints, setComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [open, setOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:7000/complaints")
      const data = await res.json()
      console.log(data)
      const enriched = data.map((c, index) => ({
        ...c,
        id: `CMP-${index + 1}`,
        raisedBy: c.name,
        userType: c.userType==="farmer" ? "Farmer" : "Contractor",
        concernType: c.complaint.length > 30 ? "Detailed Issue" : "Quick Feedback",
        raisedOn: new Date(c.createdAt).toLocaleDateString(),
        status: c.status.toLowerCase() || "pending",
        response: c.response || [],
        description: c.complaint,
        _id: c._id,
      }))
      setComplaints(enriched)
    } catch (err) {
      console.error("Failed to fetch complaints", err)
      toast.error("Failed to fetch complaints")
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const filteredComplaints = complaints.filter((c) => c.status?.toLowerCase() === status?.toLowerCase())

  const handleView = (complaint) => {
    setSelectedComplaint(complaint)
    setResponseMessage("")
    setOpen(true)
  }

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === "resolved" && !responseMessage.trim()) {
      toast.error("Please provide a response before resolving")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`http://localhost:7000/complaints/${selectedComplaint._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), // Capitalize first letter
          responseMessage: responseMessage.trim(),
        }),
      })

      if (!res.ok) throw new Error("Update failed")

      toast.success(`Marked as ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`)
      setOpen(false)
      fetchComplaints()
    } catch (err) {
      console.error("Failed to update complaint status", err)
      toast.error("Failed to update complaint status")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) {
      toast.error("Please enter a response message")
      return
    }

    // When sending a response, automatically mark as Resolved
    await handleStatusUpdate("resolved")
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Raised By</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Concern Type</TableHead>
            <TableHead>Raised On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredComplaints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No {status.toLowerCase()} concerns found
              </TableCell>
            </TableRow>
          ) : (
            filteredComplaints.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.raisedBy}</TableCell>
                <TableCell>
                  <Badge variant={c.userType === "Farmer" ? "outline" : "secondary"}>{c.userType}</Badge>
                </TableCell>
                <TableCell>{c.concernType}</TableCell>
                <TableCell>{c.raisedOn}</TableCell>
                <TableCell>
                  <Badge variant={c.status === "pending" ? "destructive" : "success"}>
                    {c.status === "pending" ? "Pending" : "Resolved"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleView(c)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Concern Details</DialogTitle>
            <DialogDescription>Complete information about the concern.</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-3">{selectedComplaint.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Raised By:</div>
                <div className="col-span-3">{selectedComplaint.raisedBy}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3">{selectedComplaint.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Concern Type:</div>
                <div className="col-span-3">{selectedComplaint.concernType}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Raised On:</div>
                <div className="col-span-3">{selectedComplaint.raisedOn}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge variant={selectedComplaint.status === "pending" ? "destructive" : "success"}>
                    {selectedComplaint.status === "pending" ? "Pending" : "Resolved"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Description:</div>
                <div className="col-span-3 whitespace-pre-wrap">{selectedComplaint.description}</div>
              </div>

              {/* Previous responses */}
              {selectedComplaint.response?.length > 0 && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">Past Responses:</div>
                  <div className="col-span-3 space-y-2">
                    {selectedComplaint.response.map((r, idx) => (
                      <div key={idx} className="p-2 border rounded">
                        {r.updatedAt && (
                          <p className="text-sm text-muted-foreground">{new Date(r.updatedAt).toLocaleString()}</p>
                        )}
                        <p>{r.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedComplaint.status !== "resolved" && (
                <>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="font-medium">Response:</div>
                    <div className="col-span-3">
                      <Textarea
                        placeholder="Enter your response..."
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleSendResponse}
                      disabled={isSubmitting || !responseMessage.trim()}
                    >
                      {isSubmitting ? "Sending..." : "Send Response & Resolve"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
