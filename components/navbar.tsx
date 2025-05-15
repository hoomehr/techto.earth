"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X, Shield } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useAdmin } from "@/context/admin-context"
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
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold text-green-800">
            TechTo<span className="text-yellow-600">.Earth</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className={`px-4 py-2 rounded-md font-medium ${isActive("/")}`}>
            Home
          </Link>
          <Link href="/courses" className={`px-4 py-2 rounded-md font-medium ${isActive("/courses")}`}>
            Courses
          </Link>
          <Link href="/events" className={`px-4 py-2 rounded-md font-medium ${isActive("/events")}`}>
            Events
          </Link>
          <Link href="/groups" className={`px-4 py-2 rounded-md font-medium ${isActive("/groups")}`}>
            Groups
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && !user ? (
            <>
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
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
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <Shield className="mr-2 h-4 w-4" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile menu */}
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
            </nav>

            {/* Mobile auth buttons */}
            <div className="border-t pt-4">
              {!loading && !user ? (
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-center border-green-600 text-green-700 hover:bg-green-50"
                    onClick={() => {
                      router.push("/auth")
                      setMobileMenuOpen(false)
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full justify-center bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => {
                      router.push("/auth")
                      setMobileMenuOpen(false)
                    }}
                  >
                    Join Now
                  </Button>
                </div>
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
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        router.push("/admin")
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Shield className="mr-2 h-4 w-4" /> Admin Panel
                    </Button>
                  )}
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
