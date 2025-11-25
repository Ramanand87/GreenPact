"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, Bell, MessageSquare } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/redux/features/authFeature"
import FarmerLogo from "@/components/assets/FramerLogo"
import { cn } from "@/lib/utils"
import { useGetProfileQuery } from "@/redux/Service/profileApi"
import { LanguageSwitcher } from "./LanguageSwitcher"

// Fallback navbar without translations for non-localized routes
export function NavbarFallback() {
  const [isOpen, setIsOpen] = useState(false)
  const [totalUnread, setTotalUnread] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  
  const userInfo = useSelector((state) => state.auth.userInfo)
  const token = userInfo?.access
  const username = userInfo?.data?.username
  const {data:profile, isLoading,isError, refetch}=useGetProfileQuery(username, {
    skip: !username,
  })
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!token) return

    let ws = null

    try {
      ws = new WebSocket(`wss:${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/ws/notifications/`)

      ws.onopen = () => {
        console.log("WebSocket connected")
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ token }))
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data?.total_unread !== undefined) {
            setTotalUnread(data.total_unread)
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onclose = () => console.log("WebSocket disconnected")
      ws.onerror = (error) => console.error("WebSocket error:", error)
    } catch (err) {
      console.error("WebSocket setup error:", err)
    }

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [token])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Market", href: "/market" },
    { name: "Demands", href: "/demands" },
    { name: "Contracts", href: "/contracts" },
    { name: "Discover", href: "/discover" },
    { name: "Help & Support", href: "/help&support" },
  ]

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  const handleChatClick = () => {
    if (userInfo?.data?.username) {
      router.push(`/chat/${userInfo.data.username}`)
    }
  }

  const handleNotificationClick = () => {
    if (userInfo?.data?.username) {
      router.push(`/chat/${userInfo.data.username}`)
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-emerald-100 flex justify-center transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-emerald-100/20" 
          : "bg-white/98",
      )}
      style={{ WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none" }}
    >
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1 sm:space-x-2 group flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FarmerLogo width={32} height={32} className="sm:w-9 sm:h-9 drop-shadow-md" />
          </motion.div>
          <motion.span 
            className="hidden sm:inline text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
          >
            GreenPact
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        {userInfo && (
          <div className="hidden md:flex md:items-center md:gap-4 lg:gap-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-colors relative group py-1",
                    pathname === item.href 
                      ? "text-emerald-600 font-semibold" 
                      : "text-gray-700 hover:text-emerald-600",
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[5px] left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span
                    className="absolute -bottom-[5px] left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-lg opacity-0 transform scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-200 origin-left"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {userInfo ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Chat Icon */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 w-9 h-9 sm:w-10 sm:h-10"
                  onClick={handleChatClick}
                >
                  <MessageSquare className="h-4 sm:h-5 w-4 sm:w-5" />
                </Button>
              </motion.div>

              {/* Notification Icon */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 w-9 h-9 sm:w-10 sm:h-10"
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-4 sm:h-5 w-4 sm:w-5" />
                  {totalUnread > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1"
                    >
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* Mobile Profile Link */}
              <Link href={`/profile/${userInfo.data?.username || ""}`} className="flex md:hidden items-center">
                {profile?.data?.image ? (
                  <img
                    src={profile.data.image}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-emerald-200"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center border border-emerald-200">
                    <span className="text-emerald-600 font-semibold text-sm">
                      {userInfo?.data?.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-50">
                    <Menu className="h-6 w-6 text-gray-700" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 bg-white">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                      <div className="flex items-center space-x-2">
                        <FarmerLogo width={32} height={32} className="drop-shadow-md" />
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">GreenPact</span>
                      </div>
                    </div>

                    {userInfo && (
                      <div className="flex-1 overflow-auto py-4">
                        <div className="flex flex-col gap-1 px-2">
                          {navItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all",
                                pathname === item.href
                                  ? "bg-emerald-50 text-emerald-600 font-semibold"
                                  : "text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-600",
                              )}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {userInfo ? (
                      <div className="border-t border-emerald-100 p-4">
                        <Link
                          href={`/profile/${userInfo.data?.username || ""}`}
                          className="flex items-center gap-3 mb-4"
                        >
                          {profile?.data?.image ? (
                            <img
                              src={profile.data.image}
                              alt="Profile"
                              className="h-10 w-10 rounded-full object-cover border-2 border-emerald-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center border border-emerald-200">
                              <span className="text-emerald-600 font-semibold">
                                {userInfo?.data?.username?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-emerald-600">{profile?.data?.name || userInfo?.data?.username || "User"}</p>
                            <p className="text-sm text-gray-500">{userInfo.data?.username || ""}</p>
                          </div>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="border-t border-emerald-100 p-4 space-y-2">
                        <Button variant="outline" className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                          <Link href="/login" className="w-full">
                            Login
                          </Link>
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-lime-500 hover:shadow-lg hover:shadow-emerald-300/50 text-white">Shop Now</Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop User Profile */}
              <div className="hidden md:flex items-center gap-2 ml-1">
                {userInfo?.data?.username && (
                  <Link href={`/profile/${userInfo.data.username}`} className="flex items-center gap-2 group hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors">
                    {profile?.data?.image ? (
                      <img
                        src={profile.data.image}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border-2 border-emerald-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center border border-emerald-200">
                        <span className="text-emerald-600 font-semibold">{userInfo?.data?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                      </div>
                    )}
                    <span className="text-sm hidden md:block font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                      {profile?.data?.name || userInfo?.data?.username || "User"}
                    </span>
                  </Link>
                )}

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 ml-2"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          ) : (
            <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs sm:text-sm px-2 sm:px-4">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
