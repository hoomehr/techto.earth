import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { isUserAdmin } from "@/utils/admin-utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Server } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }
  
  // Check if user is admin
  const isAdmin = await isUserAdmin(session.user.id)
  
  if (!isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div>
      <div className="bg-yellow-50 border-b border-yellow-100 p-2 text-center">
        <div className="container flex gap-4 justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin" className="flex items-center">
              <Shield className="mr-1 h-4 w-4" />
              Admin Dashboard
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/server" className="flex items-center">
              <Server className="mr-1 h-4 w-4" />
              Server Admin
            </Link>
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
} 