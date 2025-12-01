"use client"

import { ComplaintButton } from "./ComplaintButton"
import { ComplaintHistoryDialog } from "./ComplaintHistoryDialog"

export function ComplaintActions({ currentUser, role }) {
  return (
    <div className="flex justify-end mb-4 gap-2">
      <ComplaintHistoryDialog currentUser={currentUser} />
      <ComplaintButton currentUser={currentUser} role={role} />
    </div>
  )
}
