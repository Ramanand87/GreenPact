"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Search, Phone, Shield, Users, Wheat, Briefcase, ChevronRight, X } from "lucide-react"
import { useGetAllUsersQuery } from "@/redux/Service/auth"
import Link from "next/link"
import { useTranslate } from "@/lib/LanguageContext"

export default function UsersPage() {
  const { t } = useTranslate()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const { data: userData, isLoading, error } = useGetAllUsersQuery(undefined)

  const filterUsers = (users = [], query) => {
    if (!query.trim()) return users
    const lowerCaseQuery = query.toLowerCase().trim()
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerCaseQuery) ||
        user.user?.username?.toLowerCase().includes(lowerCaseQuery) ||
        user.address?.toLowerCase().includes(lowerCaseQuery),
    )
  }

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "UN"
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  }

  const UserCard = ({ user, type }) => (
    <motion.div variants={item} className="group">
      <Link href={`/profile/${user?.user?.username}`}>
        <div className="relative bg-card border border-border rounded-xl p-5 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300 cursor-pointer">
          {user.is_verfied && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}

          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border-2 border-border group-hover:border-green-500/50 transition-colors">
              {user.image ? (
                <AvatarImage className="object-cover" src={user.image || "/placeholder.svg"} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-secondary text-foreground text-lg font-semibold">
                  {getInitials(user.name || "U N")}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate mb-1">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">@{user.user?.username}</p>
              <Badge
                variant="outline"
                className={`text-xs ${
                  type === "farmer"
                    ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                    : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                }`}
              >
                {type === "farmer" ? (
                  <>
                    <Wheat className="h-3 w-3 mr-1" />
                    {t("farmer", { en: "Farmer", hi: "किसान" })}
                  </>
                ) : (
                  <>
                    <Briefcase className="h-3 w-3 mr-1" />
                    {t("contractor", { en: "Contractor", hi: "ठेकेदार" })}
                  </>
                )}
              </Badge>
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {user.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
                <span className="truncate">{user.address}</span>
              </div>
            )}
            {user.phoneno && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
                <span>{user.phoneno}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading community...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive mb-2">
            {t("failedToLoadUsers", {
              en: "Failed to load users. Please try again later.",
              hi: "उपयोगकर्ता लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",
            })}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const farmers = filterUsers(userData?.farmer, searchQuery)
  const contractors = filterUsers(userData?.contractor, searchQuery)
  const farmersWithType = (userData?.farmer ?? []).map((user) => ({ ...user, userType: "farmer" }))
  const contractorsWithType = (userData?.contractor ?? []).map((user) => ({ ...user, userType: "contractor" }))
  const allUsers = filterUsers([...farmersWithType, ...contractorsWithType], searchQuery)

  const stats = [
    { label: t("totalUsers", { en: "Total Users", hi: "कुल उपयोगकर्ता" }), value: allUsers.length, icon: Users },
    { label: t("farmers", { en: "Farmers", hi: "किसान" }), value: farmers.length, icon: Wheat },
    { label: t("contractors", { en: "Contractors", hi: "ठेकेदार" }), value: contractors.length, icon: Briefcase },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t("userDirectory", { en: "Discover Community", hi: "समुदाय खोजें" })}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("browseOurCommunity", {
                en: "Connect with verified farmers and contractors in your area",
                hi: "अपने क्षेत्र में सत्यापित किसानों और ठेकेदारों से जुड़ें",
              })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center gap-8 mt-10"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("searchUsersPlaceholder", {
                en: "Search by name, username or location...",
                hi: "नाम, उपयोगकर्ता नाम या स्थान से खोजें...",
              })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-green-500/10 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8 bg-card border border-border p-1 rounded-xl h-auto">
            <TabsTrigger
              value="all"
              className="flex-1 py-2.5 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 rounded-lg hover:bg-green-500/5"
            >
              <Users className="h-4 w-4 mr-2" />
              {t("allUsers", { en: "All", hi: "सभी" })}
            </TabsTrigger>
            <TabsTrigger
              value="farmers"
              className="flex-1 py-2.5 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 rounded-lg hover:bg-green-500/5"
            >
              <Wheat className="h-4 w-4 mr-2" />
              {t("farmers", { en: "Farmers", hi: "किसान" })}
            </TabsTrigger>
            <TabsTrigger
              value="contractors"
              className="flex-1 py-2.5 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 rounded-lg hover:bg-green-500/5"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              {t("contractors", { en: "Contractors", hi: "ठेकेदार" })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {allUsers.length > 0 ? (
              <motion.div
                key="all"
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {allUsers.map((user) => (
                  <UserCard key={user.id} user={user} type={user.userType} />
                ))}
              </motion.div>
            ) : (
              <EmptyState searchQuery={searchQuery} t={t} type="users" />
            )}
          </TabsContent>

          <TabsContent value="farmers" className="mt-0">
            {farmers.length > 0 ? (
              <motion.div
                key="farmers"
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {farmers.map((user) => (
                  <UserCard key={user.id} user={user} type="farmer" />
                ))}
              </motion.div>
            ) : (
              <EmptyState searchQuery={searchQuery} t={t} type="farmers" />
            )}
          </TabsContent>

          <TabsContent value="contractors" className="mt-0">
            {contractors.length > 0 ? (
              <motion.div
                key="contractors"
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {contractors.map((user) => (
                  <UserCard key={user.id} user={user} type="contractor" />
                ))}
              </motion.div>
            ) : (
              <EmptyState searchQuery={searchQuery} t={t} type="contractors" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function EmptyState({ searchQuery, t, type }) {
  const messages = {
    users: t("noUsersFound", { en: "No users found", hi: "कोई उपयोगकर्ता नहीं मिले" }),
    farmers: t("noFarmersFound", { en: "No farmers found", hi: "कोई किसान नहीं मिले" }),
    contractors: t("noContractorsFound", { en: "No contractors found", hi: "कोई ठेकेदार नहीं मिले" }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-center">
        {messages[type]}
        {searchQuery && <span className="block mt-1 text-foreground font-medium">"{searchQuery}"</span>}
      </p>
    </motion.div>
  )
}