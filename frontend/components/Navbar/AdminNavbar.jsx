"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  AlertTriangle,
  Bell,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  User,
  Users,
  X
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/redux/features/authFeature"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AdminNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.userInfo)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      label: "Registrations",
      icon: FileText,
      href: "/admin/registrations",
    },
    {
      label: "Progress Tracking",
      icon: ListChecks,
      href: "/admin/progress",
    },
    {
      label: "Concerns & Disputes",
      icon: AlertTriangle,
      href: "/admin/concerns",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
    }
  ]

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-4 lg:px-6">
        {/* Mobile Menu Button (Only shown on small screens) */}
        <div className="flex items-center gap-4 md:gap-6">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-[280px] sm:w-[300px]">
              <nav className="flex flex-col gap-2 pt-6">
                {routes.map((route) => {
                  const active = pathname === route.href
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                        active
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <route.icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5 text-green-600" />
            <span className="text-lg whitespace-nowrap">Farm Contract</span>
          </Link>

          {/* Desktop Navigation (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {routes.map((route) => {
              const active = pathname === route.href
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-all whitespace-nowrap",
                    active
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {route.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="rounded-full md:h-9 md:w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button> */}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:h-9 md:w-9">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {userInfo?.name || "Admin"}
                
              </DropdownMenuLabel>
             
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}