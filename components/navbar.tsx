"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X, ChevronDown } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-yellow-50"
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const isOnCareerPath = pathname.startsWith("/career-path")
  const isOnEcoLog = pathname.startsWith("/ecolog")
  const isOnHome = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold text-green-800">
            Techto<span className="text-emerald-600">.Earth</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-2 items-center">
          <Link href="/" className={`px-4 py-2 rounded-md font-medium text-sm ${isActive("/")}`}>
            Home
          </Link>

          <DropdownMenu open={productsOpen} onOpenChange={setProductsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm text-gray-700 hover:bg-yellow-50">
                Products <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/career-path" className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">EarthBridge</span>
                    <span className="text-xs text-gray-500">Bridging Tech to Earth Careers</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/ecolog" className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">EcoLog</span>
                    <span className="text-xs text-gray-500">Smart Environment Management</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Product-specific navigation links */}
          {isOnCareerPath && (
            <>
              <Link
                href="/career-path/courses"
                className={`px-4 py-2 rounded-md font-medium text-sm ${isActive("/career-path/courses")}`}
              >
                Courses
              </Link>
              <Link
                href="/career-path/events"
                className={`px-4 py-2 rounded-md font-medium text-sm ${isActive("/career-path/events")}`}
              >
                Events
              </Link>
              <Link
                href="/career-path/groups"
                className={`px-4 py-2 rounded-md font-medium text-sm ${isActive("/career-path/groups")}`}
              >
                Groups
              </Link>
            </>
          )}

          {isOnEcoLog && (
            <>
              <Link href="/ecolog" className={`px-4 py-2 rounded-md font-medium text-sm ${isActive("/ecolog")}`}>
                Dashboard
              </Link>
            </>
          )}

          {/* Show all original navigation on home */}
          {isOnHome && (
            <>
              <Link href="/courses" className={`px-4 py-2 rounded-md font-medium text-sm ${isActive("/courses")}`}>
                Courses
              </Link>
              <Link href="/events" className={`px-4 py-2 rounded-md font-medium text-sm ${isActive("/events")}`}>
                Events
              </Link>
              <Link href="/groups" className={`px-4 py-2 rounded-md font-medium text-sm ${isActive("/groups")}`}>
                Groups
              </Link>
            </>
          )}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && !user ? (
            <>
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 bg-transparent"
                onClick={() => router.push("/auth")}
              >
                Sign In
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => router.push("/auth")}>
                Join Now
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {user?.user_metadata?.full_name
                        ? getInitials(user.user_metadata.full_name)
                        : user?.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md font-medium ${isActive("/")}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <div className="px-4 py-2 rounded-md font-medium text-gray-700 space-y-2">
                <p className="font-medium">Products</p>
                <Link
                  href="/career-path"
                  className="block px-4 py-2 text-sm text-gray-600 hover:text-green-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  EarthBridge
                </Link>
                <Link
                  href="/ecolog"
                  className="block px-4 py-2 text-sm text-gray-600 hover:text-green-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  EcoLog
                </Link>
              </div>

              {isOnCareerPath && (
                <>
                  <Link
                    href="/career-path/courses"
                    className={`px-4 py-2 rounded-md font-medium ${isActive("/career-path/courses")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Courses
                  </Link>
                  <Link
                    href="/career-path/events"
                    className={`px-4 py-2 rounded-md font-medium ${isActive("/career-path/events")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Events
                  </Link>
                  <Link
                    href="/career-path/groups"
                    className={`px-4 py-2 rounded-md font-medium ${isActive("/career-path/groups")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Groups
                  </Link>
                </>
              )}

              {isOnHome && (
                <>
                  <Link
                    href="/courses"
                    className={`px-4 py-2 rounded-md font-medium ${isActive("/courses")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Courses
                  </Link>
                  <Link
                    href="/events"
                    className={`px-4 py-2 rounded-md font-medium ${isActive("/events")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Events
                  </Link>
                  <Link
                    href="/groups"
                    className={`px-4 py-2 rounded-md font-medium ${isActive("/groups")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Groups
                  </Link>
                </>
              )}
            </nav>

            <div className="flex flex-col space-y-2">
              {!loading && !user ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-700 hover:bg-green-50 bg-transparent"
                    onClick={() => {
                      router.push("/auth")
                      setMobileMenuOpen(false)
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => {
                      router.push("/auth")
                      setMobileMenuOpen(false)
                    }}
                  >
                    Join Now
                  </Button>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium">{user?.user_metadata?.full_name || "User"}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push("/dashboard")
                      setMobileMenuOpen(false)
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push("/dashboard/profile")
                      setMobileMenuOpen(false)
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                  >
                    Sign out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
