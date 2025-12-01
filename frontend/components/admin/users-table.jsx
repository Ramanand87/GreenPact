"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { useGetAllUsersQuery } from "@/redux/Service/auth"

export function AllUsers({ status = "pending" }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [open, setOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState({
    open: false,
    url: "",
    title: "",
  })
  const [activeTab, setActiveTab] = useState("farmer")

  const { data: users, isLoading } = useGetAllUsersQuery()

  const handlePreviewImage = (url, title) => {
    setImagePreview({ open: true, url, title })
  }

  const getStatusBadge = (user) => {
    
    return <Badge className="bg-green-500">Verified</Badge>
  }

  const filterUsers = (userList) => {
    if (!userList) return []
    
    return userList.filter(user => {
      if (status === "verified") return user.is_verified
      if (status === "rejected") return user.is_rejected
      return !user.is_verified && !user.is_rejected
    })
  }

  const renderUserTable = (userList) => {
    const filteredUsers = filterUsers(userList)
    
    if (filteredUsers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">No {status} users found</p>
        </div>
      )
    }

    return (
      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">User</TableHead>
                <TableHead className="font-semibold text-gray-700">Username</TableHead>
                <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                <TableHead className="font-semibold text-gray-700">Address</TableHead>
                <TableHead className="font-semibold text-gray-700">Documents</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedUser(user)
                setOpen(true)
              }}
            >
              <TableCell>
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (user.image) handlePreviewImage(user.image, `${user.name}'s Profile`)
                  }}
                >
                  <Avatar>
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{user.name}</div>
                </div>
              </TableCell>
              <TableCell>{user.user.username}</TableCell>
              <TableCell>{user.phoneno}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.aadhar_image && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreviewImage(user.aadhar_image, "Aadhaar Document")
                      }}
                    >
                      Aadhaar
                    </Badge>
                  )}
                  {user.signature && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreviewImage(user.signature, "Signature")
                      }}
                    >
                      Signature
                    </Badge>
                  )}
                  {user.screenshot && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreviewImage(user.screenshot, "Verification Screenshot")
                      }}
                    >
                      Verification
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(user)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </div>
      </div>
    )
  }

  const getTitle = () => {
    switch(status) {
      case "verified": return "Verified Users"
      case "rejected": return "Rejected Registrations"
      default: return "Pending Verification"
    }
  }

  const getDescription = () => {
    switch(status) {
      case "verified": return "All users with verified Aadhaar details"
      case "rejected": return "Registrations that were rejected due to invalid details"
      default: return "Review and verify the Aadhaar details of recently registered users"
    }
  }

  return (
    <div className="p-4 md:p-6">
      

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="farmer">Farmers</TabsTrigger>
          <TabsTrigger value="contractor">Contractors</TabsTrigger>
        </TabsList>

        <TabsContent value="farmer">
          {!isLoading && renderUserTable(users?.farmer || [])}
        </TabsContent>

        <TabsContent value="contractor">
          {!isLoading && renderUserTable(users?.contractor || [])}
        </TabsContent>
      </Tabs>

      {/* User details dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete information about the user.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.image || ""} />
                  <AvatarFallback>
                    {selectedUser.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-600">@{selectedUser.user.username}</p>
                  {getStatusBadge(selectedUser)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Phone:</div>
                <div className="col-span-3">{selectedUser.phoneno}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Address:</div>
                <div className="col-span-3">{selectedUser.address}</div>
              </div>
              {selectedUser?.gstin && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">GSTIN:</div>
                  <div className="col-span-3">{selectedUser.gstin}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image preview dialog */}
      <Dialog open={imagePreview.open} onOpenChange={(open) => setImagePreview({...imagePreview, open})}>
        <DialogContent className="sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>{imagePreview.title}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={imagePreview.url} 
              alt={imagePreview.title}
              className="max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}