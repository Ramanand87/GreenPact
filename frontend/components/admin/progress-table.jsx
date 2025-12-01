"use client"

import { useState, useMemo } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useGetAllContractorProgressQuery, useGetAllFramerProgressQuery } from "@/redux/Service/contract"

// Status priority order (higher index = higher priority)
const statusPriority = {
  planted: 0,
  growing: 1,
  harvested: 2,
  ready_for_delivery: 3,
  delivered: 4,
}

// Helper function to format status for display
const formatStatus = (status) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function ProgressTable({ userType }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [open, setOpen] = useState(false)
  const { data: farmerData, isLoading: cropLoading, error: farmerError } = useGetAllFramerProgressQuery()
  const { data: contractorData, isLoading, error } = useGetAllContractorProgressQuery()

  // Process farmer data to get highest status per contract
  const processedFarmerData = useMemo(() => {
    if (!farmerData?.data) return []

    // Group by contract_id
    const groupedByContract = farmerData.data.reduce((acc, item) => {
      if (!acc[item.contract_id]) {
        acc[item.contract_id] = []
      }
      acc[item.contract_id].push(item)
      return acc
    }, {})

    // For each contract, get the item with highest status priority
    return Object.values(groupedByContract).map((items) => {
      return items.reduce((highest, current) => {
        const highestPriority = statusPriority[highest.current_status] || 0
        const currentPriority = statusPriority[current.current_status] || 0

        return currentPriority > highestPriority ? current : highest
      }, items[0])
    })
  }, [farmerData])

  // Process contractor data to calculate total payment per contract
  const processedContractorData = useMemo(() => {
    if (!contractorData?.data) return []

    // Group by contract_id
    const groupedByContract = contractorData.data.reduce((acc, item) => {
      if (!acc[item.contract_id]) {
        acc[item.contract_id] = {
          contract_id: item.contract_id,
          buyer_name: item.buyer_name,
          date: item.date,
          totalAmount: 0,
          transactions: [],
        }
      }
      acc[item.contract_id].totalAmount += item.amount
      acc[item.contract_id].transactions.push(item)
      // Use the most recent date
      if (new Date(item.date) > new Date(acc[item.contract_id].date)) {
        acc[item.contract_id].date = item.date
      }
      return acc
    }, {})

    return Object.values(groupedByContract)
  }, [contractorData])

  const handleView = (item) => {
    setSelectedItem(item)
    setOpen(true)
  }

  if (userType === "farmer" && cropLoading) return <div>Loading farmer data...</div>
  if (userType === "contractor" && isLoading) return <div>Loading contractor data...</div>
  if (userType === "farmer" && farmerError) return <div>Error loading farmer data</div>
  if (userType === "contractor" && error) return <div>Error loading contractor data</div>

  return (
    <>
      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              {userType === "farmer" ? (
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Contract ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Farmer Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Crop</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              ) : (
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Contract ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Buyer Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Payment</TableHead>
                  <TableHead className="font-semibold text-gray-700">Last Transaction</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              )}
            </TableHeader>
        <TableBody>
          {userType === "farmer"
            ? processedFarmerData.map((item) => (
                <TableRow key={item.contract_id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{item.contract_id.substring(0, 8)}...</TableCell>
                  <TableCell className="text-gray-700">{item.farmer_name}</TableCell>
                  <TableCell className="text-gray-700">{item.crop_name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.current_status === "delivered"
                          ? "success"
                          : item.current_status === "ready_for_delivery"
                            ? "outline"
                            : "secondary"
                      }
                      className="font-medium"
                    >
                      {formatStatus(item.current_status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{item.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleView(item)} className="hover:bg-green-50 hover:text-green-700">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : processedContractorData.map((item) => (
                <TableRow key={item.contract_id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{item.contract_id.substring(0, 8)}...</TableCell>
                  <TableCell className="text-gray-700">{item.buyer_name}</TableCell>
                  <TableCell className="text-gray-700">₹{item.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-700">{item.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleView(item)} className="hover:bg-green-50 hover:text-green-700">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {userType === "farmer" ? "Farmer Progress Details" : "Contractor Progress Details"}
            </DialogTitle>
            <DialogDescription>Complete information about the progress.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              {userType === "farmer" ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Contract ID:</div>
                    <div className="col-span-3">{selectedItem.contract_id}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Farmer:</div>
                    <div className="col-span-3">{selectedItem.farmer_name}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Crop:</div>
                    <div className="col-span-3">{selectedItem.crop_name}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Status:</div>
                    <div className="col-span-3">
                      <Badge
                        variant={
                          selectedItem.current_status === "delivered"
                            ? "success"
                            : selectedItem.current_status === "ready_for_delivery"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {formatStatus(selectedItem.current_status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Date:</div>
                    <div className="col-span-3">{selectedItem.date}</div>
                  </div>
                  {selectedItem.image && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="font-medium">Image:</div>
                      <div className="col-span-3">
                        <img
                          src={selectedItem.image || "/placeholder.svg"}
                          alt="Crop status"
                          className="max-w-full h-auto rounded-md"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Contract ID:</div>
                    <div className="col-span-3">{selectedItem.contract_id}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Buyer:</div>
                    <div className="col-span-3">{selectedItem.buyer_name}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Total Amount:</div>
                    <div className="col-span-3">₹{selectedItem.totalAmount.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Last Transaction:</div>
                    <div className="col-span-3">{selectedItem.date}</div>
                  </div>
                  <div className="font-medium mt-2">Transaction History:</div>
                  {selectedItem.transactions.map((transaction, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium">Date:</div>
                        <div className="col-span-2">{transaction.date}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium">Amount:</div>
                        <div className="col-span-2">₹{transaction.amount.toLocaleString()}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium">Reference:</div>
                        <div className="col-span-2">{transaction.reference_number}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium">Description:</div>
                        <div className="col-span-2">{transaction.description}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
