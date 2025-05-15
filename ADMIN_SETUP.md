# TechTo.Earth Admin Setup Guide

This guide explains how to set up admin roles in the TechTo.Earth platform to enable privileged access to certain features and content management capabilities.

## Overview

The admin system provides:

1. A dedicated admin panel at `/admin`
2. Admin-only server routes
3. Role-based access control using Supabase
4. User management capabilities
5. Content approval and moderation

## Setting Up Admin Roles

### Step 1: Run the Migration Script

To add the required database structures for admin functionality, run:

```bash
node scripts/add-user-roles.js
```

This script will:
- Add a 'role' column to the auth.users table in Supabase
- Create helper functions for role management
- Set up default values

### Step 2: Assign Admin Roles

There are two ways to make a user an admin:

#### Option 1: Using the Supabase SQL Editor

Execute the following SQL in your Supabase SQL editor:

```sql
-- Replace YOUR_USER_ID with the actual user ID
SELECT set_user_role('YOUR_USER_ID', 'admin');
```

#### Option 2: Using the Admin Dashboard (if you already have an admin user)

1. Log in as an existing admin user
2. Navigate to `/admin`
3. Go to the "Users" tab
4. Find the user you want to make an admin
5. Click "Make Admin"

## Admin Features

### Admin Panel

The admin panel is available at `/admin` and includes:

- **Users Management**: View, search, and manage users, including changing roles
- **Courses Management**: Review, publish/unpublish, and manage courses
- **Events Management**: Manage upcoming and past events
- **Content Moderation**: Review and moderate user-generated content

### Auto-enrollment for Course Creators

Course creators are now automatically enrolled in their own courses when they create them. This allows creators to:

1. See how their course appears to learners
2. Track progress and test the learning experience
3. Access their own content from their dashboard

## Using Admin Functions in Code

### Client-Side (React Components)

```tsx
"use client"

import { useAdmin } from "@/context/admin-context"

function MyComponent() {
  const { isAdmin, loading } = useAdmin()
  
  if (loading) return <p>Loading...</p>
  
  return (
    <div>
      {isAdmin && (
        <div>
          {/* Admin-only UI elements */}
          <button>Special Admin Action</button>
        </div>
      )}
      {/* Regular content */}
    </div>
  )
}
```

### Server-Side (Next.js Server Components)

```tsx
import { createClient } from "@/utils/supabase/server"
import { isUserAdmin } from "@/utils/admin-utils"

export default async function ServerComponent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if the current user is an admin
  const isAdmin = await isUserAdmin(user?.id)
  
  // Admin-only data fetching
  let adminData = null
  if (isAdmin) {
    const { data } = await supabase.from('admin_only_table').select('*')
    adminData = data
  }
  
  return (
    <div>
      {isAdmin && (
        <div className="admin-section">
          {/* Admin-only content */}
        </div>
      )}
      {/* Regular content */}
    </div>
  )
}
```

## Security Considerations

1. **Row-Level Security (RLS)**: All admin-only tables should be protected with proper RLS policies
2. **Function Security**: Admin functions use `SECURITY DEFINER` to ensure they run with the necessary privileges
3. **Client-Side Validation**: All admin actions performed on the client still require server-side validation
4. **Rate Limiting**: Admin endpoints should implement rate limiting to prevent abuse

## Troubleshooting

If you encounter issues with admin functionality:

1. Check if the user has the correct role in the auth.users table
2. Verify that the migration script completed successfully
3. Check browser console for any JavaScript errors
4. Look at server logs for API or database errors
5. Try clearing the browser cache and refreshing

## Further Customization

To add more admin functionality:

1. Add new tabs to the admin panel in `/app/admin/page.tsx`
2. Create new admin-only API routes with proper authentication checks
3. Add server-side admin functions to `/utils/admin-utils.ts`
4. Update admin context provider for additional client-side functionality 