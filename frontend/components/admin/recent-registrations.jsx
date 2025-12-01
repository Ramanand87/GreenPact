"use client"

import { useState } from "react"
import { Eye, MoreHorizontal, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  useGetUsersQuery,
  useVerifyUserMutation,
  useRejectUserMutation,
} from "@/redux/Service/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RecentRegistrations() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [open, setOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState({
    open: false,
    url: "",
    title: ""
  })
  const [activeTab, setActiveTab] = useState("farmer")

  const { data: unverifiedUsers, isLoading, refetch } = useGetUsersQuery()
  const [verifyUser] = useVerifyUserMutation()
  const [rejectUser] = useRejectUserMutation()

  const handleView = (user) => {
    setSelectedUser(user)
    setOpen(true)
  }

  const handleVerify = async (userId) => {
    try {
      await verifyUser({
        id: userId,
        data: { is_verfied: true },
      }).unwrap()
      toast.success("User verified successfully!")
      refetch()
      setOpen(false)
    } catch (error) {
      toast.error("Verification failed.")
      console.log(error)
    }
  }

  const handleReject = async (userId) => {
    try {
      await rejectUser(userId).unwrap()
      toast.success("User has been rejected.")
      refetch()
      setOpen(false)
    } catch (error) {
      toast.error("Rejection failed.")
      console.log(error)
    }
  }

  const handlePreviewImage = (url, title) => {
    setImagePreview({
      open: true,
      url,
      title
    })
  }

  const renderUserTable = (users) => (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableRow className="border-b border-gray-200">
              <TableHead className="min-w-[150px] font-semibold text-gray-700">User</TableHead>
              <TableHead className="min-w-[120px] font-semibold text-gray-700">Username</TableHead>
              <TableHead className="min-w-[120px] font-semibold text-gray-700">Phone</TableHead>
              <TableHead className="min-w-[150px] font-semibold text-gray-700">Address</TableHead>
              <TableHead className="min-w-[150px] font-semibold text-gray-700">Documents</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-gray-700">Status</TableHead>
              <TableHead className="min-w-[80px] text-right font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && users
              ?.filter((user) => !user.is_verfied)
              .map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => user.image && handlePreviewImage(user.image, `${user.name}'s Profile`)}
                    >
                      <Avatar>
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.user.username}</TableCell>
                  <TableCell>{user.phoneno}</TableCell>
                  <TableCell className="truncate max-w-[150px]">{user.address}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.aadhar_image && (
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handlePreviewImage(user.aadhar_image, "Aadhaar Document")}
                        >
                          Aadhaar
                        </Badge>
                      )}
                      {user.signature && (
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handlePreviewImage(user.signature, "Signature")}
                        >
                          Signature
                        </Badge>
                      )}
                      {user.screenshot && (
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handlePreviewImage(user.screenshot, "Verification Screenshot")}
                        >
                          Screenshot
                        </Badge>
                      )}
                      {user.gstin && (
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          GSTIN
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleView(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleVerify(user.user.username)}>
                          <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                          Verify
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReject(user.user.username)}>
                          <ThumbsDown className="mr-2 h-4 w-4 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Pending Verification</h1>
        <p className="text-gray-600 mb-4 md:mb-6">Review and verify the details of recently registered users.</p>
        
        <Tabs defaultValue="farmer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="farmer" onClick={() => setActiveTab("farmer")}>
              Farmers
            </TabsTrigger>
            <TabsTrigger value="contractor" onClick={() => setActiveTab("contractor")}>
              Contractors
            </TabsTrigger>
          </TabsList>
          <TabsContent value="farmer">
            {renderUserTable(unverifiedUsers?.farmer || [])}
          </TabsContent>
          <TabsContent value="contractor">
            {renderUserTable(unverifiedUsers?.contractor || [])}
          </TabsContent>
        </Tabs>

        {/* User Details Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{activeTab === 'farmer' ? 'Farmer' : 'Contractor'} Details</DialogTitle>
              <DialogDescription>
                Complete information about the {activeTab}.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="cursor-pointer"
                    onClick={() => selectedUser.image && handlePreviewImage(selectedUser.image, `${selectedUser.name}'s Profile`)}
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={selectedUser.image || ""} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    <p className="text-gray-600">@{selectedUser.user.username}</p>
                    <Badge variant="outline" className="capitalize mt-1">
                      {activeTab}
                    </Badge>
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
                
                {selectedUser.gstin && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">GSTIN:</div>
                    <div className="col-span-3">{selectedUser.gstin}</div>
                  </div>
                )}
                
                {selectedUser.aadhar_image && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="font-medium">Aadhaar:</div>
                    <div className="col-span-3">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handlePreviewImage(selectedUser.aadhar_image, "Aadhaar Document")}
                      >
                        <img
                          src={selectedUser.aadhar_image}
                          alt="Aadhaar"
                          className="rounded border w-full h-auto max-h-40 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.signature && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="font-medium">Signature:</div>
                    <div className="col-span-3">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handlePreviewImage(selectedUser.signature, "Signature")}
                      >
                        <img
                          src={selectedUser.signature}
                          alt="Signature"
                          className="rounded border w-full h-auto max-h-40 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.screenshot && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="font-medium">Screenshot:</div>
                    <div className="col-span-3">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handlePreviewImage(selectedUser.screenshot, "Verification Screenshot")}
                      >
                        <img
                          src={selectedUser.screenshot}
                          alt="Screenshot"
                          className="rounded border w-full h-auto max-h-40 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    className="w-[48%]"
                    onClick={() => handleReject(selectedUser.user.username)}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    className="w-[48%] bg-green-600 hover:bg-green-700"
                    onClick={() => handleVerify(selectedUser.user.username)}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Preview Dialog */}
        <Dialog open={imagePreview.open} onOpenChange={(open) => setImagePreview(prev => ({...prev, open}))}>
          <DialogContent className="max-w-[90vw] max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <DialogTitle>{imagePreview.title}</DialogTitle>
              {/* <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setImagePreview(prev => ({...prev, open: false}))}
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
            <div className="flex items-center justify-center h-full">
              <img
                src={imagePreview.url}
                alt={imagePreview.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}