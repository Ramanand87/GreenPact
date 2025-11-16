"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, Bell, MessageSquare } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/redux/features/authFeature"
import FarmerLogo from "@/components/assets/FramerLogo"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [totalUnread, setTotalUnread] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()

  // Get user info from Redux store
  const userInfo = useSelector((state) => state.auth.userInfo)
  const token = userInfo?.access

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // WebSocket connection for notifications
  useEffect(() => {
    if (!token) return

    let ws = null

    try {
      ws = new WebSocket("ws://localhost:5000/ws/notifications/")

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
        "sticky top-0 z-50 w-full border-b flex justify-center transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white",
      )}
      style={{ WebkitBackdropFilter: isScrolled ? "blur(8px)" : "none" }} // For Safari compatibility
    >
      <div className="container flex h-16 items-center justify-between px-4  max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <FarmerLogo width={38} height={38} className="drop-shadow-md" />
          <span className="text-xl md:text-2xl font-bold text-green-700">GreenPact</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors relative group py-1",
                pathname === item.href ? "text-green-700 font-semibold" : "text-gray-700 hover:text-green-700",
              )}
            >
              {item.name}
              {pathname === item.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-[5px] left-0 right-0 h-0.5 bg-green-700 rounded-lg"
                  style={{ width: "100%" }}
                />
              )}
              <span
                className="absolute -bottom-[5px] left-0 right-0 h-0.5 bg-green-700 rounded-lg opacity-0 transform scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-200 origin-left"
                style={{ width: "100%" }}
              />
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {userInfo ? (
            <div className="flex items-center gap-2">
              {/* Chat Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative hover:bg-green-50"
                onClick={handleChatClick}
              >
                <MessageSquare className="h-5 w-5 text-gray-700 hover:text-green-700" />
              </Button>

              {/* Notification Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative hover:bg-green-50"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5 text-gray-700 hover:text-green-700" />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </Button>

              {/* Mobile Profile Link */}
              <Link href={`/profile/${userInfo.data?.username || ""}`} className="flex md:hidden items-center">
                {userInfo?.profile?.image ? (
                  <img
                    src={userInfo.profile.image || "/placeholder.svg"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-green-100"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-semibold">{userInfo.profile?.name?.charAt(0) || "U"}</span>
                  </div>
                )}
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center space-x-2">
                        <FarmerLogo width={32} height={32} className="drop-shadow-md" />
                        <span className="text-xl font-bold text-green-700">GreenPact</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-auto py-4">
                      <div className="flex flex-col gap-1 px-2">
                        {navItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors",
                              pathname === item.href
                                ? "bg-green-50 text-green-700 font-semibold"
                                : "hover:bg-green-50/50 hover:text-green-700",
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {userInfo ? (
                      <div className="border-t p-4">
                        <Link
                          href={`/profile/${userInfo.data?.username || ""}`}
                          className="flex items-center gap-3 mb-4"
                        >
                          {userInfo?.profile?.image ? (
                            <img
                              src={userInfo.profile.image || "/placeholder.svg"}
                              alt="Profile"
                              className="h-10 w-10 rounded-full object-cover border-2 border-green-100"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-700 font-semibold">
                                {userInfo.profile?.name?.charAt(0) || "U"}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-green-700">{userInfo.profile?.name || "User"}</p>
                            <p className="text-sm text-gray-500">{userInfo.data?.username || ""}</p>
                          </div>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 border-green-200"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="border-t p-4 space-y-2">
                        <Button variant="outline" className="w-full">
                          <Link href="/login" className="w-full">
                            Login
                          </Link>
                        </Button>
                        <Button className="w-full bg-green-700 hover:bg-green-800">Shop Now</Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop User Profile */}
              <div className="hidden md:flex items-center gap-2 ml-1">
                {userInfo?.data?.username && (
                  <Link href={`/profile/${userInfo.data.username}`} className="flex items-center gap-2">
                    {userInfo?.profile?.image ? (
                      <img
                        src={userInfo.profile.image || "/placeholder.svg"}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border-2 border-green-100"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 font-semibold">{userInfo.profile?.name?.charAt(0) || "U"}</span>
                      </div>
                    )}
                    <span className="text-sm hidden md:block font-medium text-green-700">
                      {userInfo.profile?.name || "User"}
                    </span>
                  </Link>
                )}

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2 border-green-200 ml-2"
                  size="sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button variant="outline" className="hidden md:flex border-green-200">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-green-700 hover:bg-green-800 transition-colors">Shop Now</Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
