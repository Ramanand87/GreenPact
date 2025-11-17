"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Search } from "lucide-react"
import { useGetAllUsersQuery } from "@/redux/Service/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleCardClick = () => {
    const username = user.user?.username
    if (username) {
      router.push(`/profile/${username}`)
    }
  }

  const { data: userData, isLoading, error } = useGetAllUsersQuery(undefined)

  const filterUsers = (users = [], query) => {
    if (!query.trim()) return users

    const lowerCaseQuery = query.toLowerCase().trim()
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerCaseQuery) ||
        user.user?.username?.toLowerCase().includes(lowerCaseQuery) ||
        user.address?.toLowerCase().includes(lowerCaseQuery)
    )
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const UserCard = ({ user, type }) => (
    <motion.div
      variants={item}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      }}
      className="w-full"

    >
      <Card className="overflow-hidden border-none shadow-lg cursor-pointer">
      <Link href={`/profile/${user?.user?.username}`}  
      >
        <CardContent className="p-0">
          <div className="relative">
            <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            <div className="absolute -bottom-12 left-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                {user.image ? (
                  <AvatarImage className="object-cover" src={user.image || "/placeholder.svg"} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xl">
                    {getInitials(user.name || "U N")}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                {type === "farmer" ? "Farmer" : "Contractor"}
              </Badge>
            </div>
          </div>

          <div className="pt-14 pb-6 px-6">
            <h3 className="text-xl font-semibold mb-1">{user.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <User className="h-4 w-4 mr-1" />
              <span>@{user.user?.username}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.address}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      </Card>
    </motion.div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-12">
        Failed to load users. Please try again later.
      </div>
    )
  }

  const farmers = filterUsers(userData?.farmer, searchQuery)
  const contractors = filterUsers(userData?.contractor, searchQuery)
  const allUsers = filterUsers([...userData?.farmer ?? [], ...userData?.contractor ?? []], searchQuery)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          User Directory
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse through our community of farmers and contractors
        </p>
      </motion.div>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, username or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="all" className="flex-1">
            All Users
          </TabsTrigger>
          <TabsTrigger value="farmers" className="flex-1">
            Farmers
          </TabsTrigger>
          <TabsTrigger value="contractors" className="flex-1">
            Contractors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {allUsers.map((user) => (
              <UserCard key={user.id} user={user} type={userData.farmer?.some(f => f.id === user.id) ? "farmer" : "contractor"} />
            ))}
          </motion.div>
          {allUsers.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">No users found matching "{searchQuery}"</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="farmers">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {farmers.map((user) => (
              <UserCard key={user.id} user={user} type="farmer" />
            ))}
          </motion.div>
          {farmers.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">No farmers found matching "{searchQuery}"</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="contractors">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {contractors.map((user) => (
              <UserCard key={user.id} user={user} type="contractor" />
            ))}
          </motion.div>
          {contractors.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">No contractors found matching "{searchQuery}"</p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
