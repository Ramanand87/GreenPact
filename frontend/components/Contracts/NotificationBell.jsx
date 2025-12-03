"use client"

import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
}

export default function NotificationBell({
  pendingContracts,
  showNotifications,
  setShowNotifications,
  onContractClick,
  onViewAll,
}) {
  const pendingCount = pendingContracts.length

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="rounded-full h-10 w-10 p-0"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </Button>

      {/* Pending Contracts Dropdown */}
      <AnimatePresence>
        {showNotifications && pendingContracts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="p-3 bg-green-50 border-b border-green-100">
              <h3 className="font-medium text-green-800">Pending Contracts</h3>
              <p className="text-xs text-green-600">Contracts waiting for your approval</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {pendingContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => onContractClick(contract)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{contract.crop}</p>
                      <p className="text-sm text-gray-500">From: {contract.buyer}</p>
                    </div>
                    <Badge className={statusColors.pending}>Pending</Badge>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>₹{contract.price.toLocaleString()}</span>
                    <span>{new Date(contract.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 bg-gray-50 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 text-xs w-full"
                onClick={onViewAll}
              >
                View All Pending Contracts
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
