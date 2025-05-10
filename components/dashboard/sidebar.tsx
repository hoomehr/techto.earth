"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Calendar, LayoutDashboard, Plus, Settings, Users, FileText } from "lucide-react"

export default function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "My Courses",
      href: "/dashboard/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "My Events",
      href: "/dashboard/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "My Groups",
      href: "/dashboard/groups",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "My Blog Posts",
      href: "/dashboard/blog",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Create Course",
      href: "/dashboard/courses/create",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      name: "Create Event",
      href: "/dashboard/events/create",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      name: "Create Group",
      href: "/dashboard/groups/create",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      name: "Create Blog Post",
      href: "/dashboard/blog/create",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="w-full md:w-64 shrink-0">
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isActive(item.href)
                ? "bg-green-100 text-green-900"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
