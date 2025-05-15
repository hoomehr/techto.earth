import { createClient } from "@/utils/supabase/server"

/**
 * Check if a user is an admin (server-side)
 * This function should be used in server components
 */
export async function isUserAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) return false
  
  try {
    const supabase = await createClient()
    
    // Try to use the dedicated function to check admin status
    const { data: isAdminData, error: functionError } = await supabase.rpc('is_admin', {
      user_id: userId
    })
    
    if (!functionError && isAdminData !== null) {
      return isAdminData
    }
    
    // Fallback: query user role directly
    const { data: userData, error } = await supabase
      .from('auth.users')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (error) {
      // Further fallback: get user data and check metadata
      const { data: { user } } = await supabase.auth.admin.getUserById(userId)
      
      if (user) {
        return (
          user.user_metadata?.role === 'admin' || 
          user.app_metadata?.role === 'admin'
        )
      }
      
      return false
    }
    
    return userData?.role === 'admin'
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

/**
 * Get a list of all users (admin only function)
 * This function should be used in server components
 */
export async function getAllUsers(adminUserId: string | undefined): Promise<any[]> {
  if (!adminUserId) return []
  
  const isAdmin = await isUserAdmin(adminUserId)
  if (!isAdmin) return []
  
  try {
    const supabase = await createClient()
    
    // Try to use the dedicated function to get all users
    const { data: usersData, error: functionError } = await supabase.rpc('get_all_users')
    
    if (!functionError && usersData) {
      return usersData
    }
    
    // Fallback: try to get users from profiles table
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
    
    return profilesData || []
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
} 