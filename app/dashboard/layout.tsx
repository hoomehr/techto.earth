import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import DashboardSidebar from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <DashboardSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
