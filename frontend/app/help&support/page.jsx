"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { ComplaintActions } from "../../components/helpandsupport/ComplaintActions"
import { HelpHeader } from "../../components/helpandsupport/HelpHeader"
import { UserTypeTabs } from "../../components/helpandsupport/UserTypeTabs"
import { FAQCard } from "../../components/helpandsupport/FAQCard"
import { FeedbackCard } from "../../components/helpandsupport/FeedbackCard"

export default function HelpAndSupport() {
  const userInfo = useSelector((state) => state.auth.userInfo)
  const role = userInfo?.role
  const currentUser = userInfo?.data?.username
  const [activeTab, setActiveTab] = useState("farmer")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ComplaintActions currentUser={currentUser} role={role} />
      
      <HelpHeader />

      <UserTypeTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <FAQCard activeTab={activeTab} />
      
      <FeedbackCard activeTab={activeTab} />
    </div>
  )
}
