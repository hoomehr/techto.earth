"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "./auth-context"

type AdminContextType = {
  isAdmin: boolean
  checkIsAdmin: () => Promise<boolean>
  loading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const checkIsAdmin = async (): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false)
      return false
    }

    try {
      // First, try to use the dedicated function to check admin status
      const { data: isAdminData, error: functionError } = await supabase.rpc('is_admin', {
        user_id: user.id
      })

      if (!functionError && isAdminData !== null) {
        setIsAdmin(isAdminData)
        return isAdminData
      }

      // Fallback: query user role directly
      const { data: userData, error } = await supabase
        .from('auth.users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        // Further fallback: check user metadata (in case role is stored there)
        const isAdminFromMetadata = 
          user.user_metadata?.role === 'admin' || 
          user.app_metadata?.role === 'admin'
        
        setIsAdmin(isAdminFromMetadata)
        return isAdminFromMetadata
      }
      
      const isAdminRole = userData?.role === 'admin'
      setIsAdmin(isAdminRole)
      return isAdminRole
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  }

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true)
      await checkIsAdmin()
      setLoading(false)
    }

    if (user) {
      checkAdminStatus()
    } else {
      setIsAdmin(false)
      setLoading(false)
    }
  }, [user])

  return (
    <AdminContext.Provider value={{ isAdmin, checkIsAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
} 