"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-yellow-50"
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
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex border-green-600 text-green-700 hover:bg-green-50">
            Sign In
          </Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Join Now</Button>
        </div>
      </div>
    </header>
  )
}
