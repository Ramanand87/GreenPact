"use client"

import { useState } from "react"
import { Eye, Loader2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useGetComplaintsQuery, useUpdateComplaintStatusMutation } from "@/redux/Service/complaintApi"
import { format } from "date-fns"

export function ConcernsTable({ status }) {
  const { data: complaintsData = [], isLoading } = useGetComplaintsQuery()
  const [updateComplaintStatus, { isLoading: isUpdating }] = useUpdateComplaintStatusMutation()
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("")

  const complaints = complaintsData || []
  const filteredComplaints = complaints.filter((c) => c.status?.toLowerCase() === status?.toLowerCase())

  const handleView = (complaint) => {
    setSelectedComplaint(complaint)
    setSelectedStatus(complaint.status)
    setSelectedPriority(complaint.priority)
    setOpen(true)
  }

  const handleStatusUpdate = async () => {
    if (!selectedComplaint) return

    try {
      await updateComplaintStatus({
        id: selectedComplaint.id,
        status: selectedStatus,
        priority: selectedPriority,
      }).unwrap()

      toast.success("Complaint status updated successfully")
      setOpen(false)
    } catch (err) {
      console.error("Failed to update complaint status", err)
      toast.error("Failed to update complaint status")
    }
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase()
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-800 border-yellow-300"
    if (statusLower === "resolved") return "bg-green-100 text-green-800 border-green-300"
    return "bg-gray-100 text-gray-800 border-gray-300"
  }

  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase()
    if (priorityLower === "high") return "bg-red-100 text-red-800 border-red-300"
    if (priorityLower === "medium") return "bg-orange-100 text-orange-800 border-orange-300"
    if (priorityLower === "low") return "bg-blue-100 text-blue-800 border-blue-300"
    return "bg-gray-100 text-gray-800 border-gray-300"
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Complainant</TableHead>
                <TableHead className="font-semibold text-gray-700">Accused</TableHead>
                <TableHead className="font-semibold text-gray-700">Category</TableHead>
                <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                <TableHead className="font-semibold text-gray-700">Raised On</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium">No {status.toLowerCase()} complaints found</p>
                      <p className="text-sm">Check back later for updates</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredComplaints.map((c) => (
                  <TableRow key={c.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">#{c.id}</TableCell>
                    <TableCell className="text-gray-700">{c.complainant}</TableCell>
                    <TableCell className="text-gray-700">{c.accused || <span className="text-gray-400 italic">N/A</span>}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">{c.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getPriorityColor(c.priority)} font-medium`}>
                        {c.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">{format(new Date(c.created_at), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(c.status)} font-medium`}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleView(c)} className="hover:bg-green-50 hover:text-green-700">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>Complete information about the complaint.</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <div className="font-medium text-sm">ID:</div>
                <div className="sm:col-span-3 text-sm">#{selectedComplaint.id}</div>
              </div>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <div className="font-medium text-sm">Complainant:</div>
                <div className="sm:col-span-3 text-sm break-all">@{selectedComplaint.complainant}</div>
              </div>
              {selectedComplaint.accused && (
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                  <div className="font-medium text-sm">Accused:</div>
                  <div className="sm:col-span-3 text-sm break-all">@{selectedComplaint.accused}</div>
                </div>
              )}
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <div className="font-medium text-sm">Category:</div>
                <div className="sm:col-span-3">
                  <Badge variant="outline" className="text-xs">{selectedComplaint.category}</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <div className="font-medium text-sm">Priority:</div>
                <div className="sm:col-span-3">
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <div className="font-medium text-sm">Status:</div>
                <div className="sm:col-span-3">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <div className="font-medium text-sm">Raised On:</div>
                <div className="sm:col-span-3 text-sm break-words">{format(new Date(selectedComplaint.created_at), "MMM dd, yyyy 'at' hh:mm a")}</div>
              </div>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-start sm:gap-4">
                <div className="font-medium text-sm">Description:</div>
                <div className="sm:col-span-3 text-sm whitespace-pre-wrap break-words">{selectedComplaint.description}</div>
              </div>

              {selectedComplaint.proof && (
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-start sm:gap-4">
                  <div className="font-medium text-sm">Proof:</div>
                  <div className="sm:col-span-3">
                    <img 
                      src={selectedComplaint.proof} 
                      alt="Complaint proof" 
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}

              <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
