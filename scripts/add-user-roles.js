#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Function to prompt the user for Supabase credentials
const promptSupabaseCredentials = () => {
  return new Promise((resolve) => {
    console.log('📝 Please enter your Supabase credentials')
    
    rl.question('Supabase URL: ', (supabaseUrl) => {
      rl.question('Supabase Service Key (anon key with RLS bypassing): ', (supabaseKey) => {
        resolve({ supabaseUrl, supabaseKey })
      })
    })
  })
}

// Function to add user roles functionality
const addUserRoles = async (supabase) => {
  try {
    console.log('\n🔍 Checking current user role structure...')
    
    // First, check if we need to set up custom claims for roles
    console.log('Setting up user roles functionality...')
    
    // Create a SQL function to add the role column to auth.users if it doesn't exist
    console.log('Creating add_role_to_users function...')
    const { error: functionError } = await supabase.rpc('create_sql_function', {
      function_name: 'add_role_to_users_function',
      function_definition: `
        CREATE OR REPLACE FUNCTION add_role_to_users()
        RETURNS void AS $$
        BEGIN
          -- Check if the column already exists
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'auth'
              AND table_name = 'users'
              AND column_name = 'role'
          ) THEN
            -- Add the role column with default 'user'
            ALTER TABLE auth.users ADD COLUMN role text DEFAULT 'user';
          END IF;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    })
    
    if (functionError) {
      console.log('Failed to create function. Using alternative approach...')
      console.log('Creating raw SQL function for adding roles...')
      
      // Execute raw SQL instead if the RPC fails
      const { error: rawSqlError } = await supabase.rpc('execute_sql', {
        sql_query: `
          DO $$
          BEGIN
            -- Check if the column already exists
            IF NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_schema = 'auth'
                AND table_name = 'users'
                AND column_name = 'role'
            ) THEN
              -- Add the role column with default 'user'
              ALTER TABLE auth.users ADD COLUMN role text DEFAULT 'user';
            END IF;
          END
          $$;
        `
      })
      
      if (rawSqlError) {
        console.log('Failed to use execute_sql RPC. Will now create function to use later...')
        // Create SQL migration script that admins can run directly
        console.log(`
        -- ⚠️ Execute this SQL in the Supabase SQL Editor:
        
        ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
        
        -- Create a function to check and set admin role
        CREATE OR REPLACE FUNCTION public.set_user_role(user_id uuid, new_role text)
        RETURNS void AS $$
        BEGIN
          UPDATE auth.users SET role = new_role WHERE id = user_id;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Create a function to get user role
        CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
        RETURNS text AS $$
        DECLARE
          user_role text;
        BEGIN
          SELECT role INTO user_role FROM auth.users WHERE id = user_id;
          RETURN user_role;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        `)
      }
    } else {
      // Call the function to add the role column
      console.log('Executing add_role_to_users function...')
      const { error: execError } = await supabase.rpc('add_role_to_users')
      
      if (execError) {
        console.error('Error adding role column:', execError)
      }
    }
    
    // Create helper functions for role management
    console.log('Creating role management functions...')
    const { error: roleManagementError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Create a function to check and set admin role
        CREATE OR REPLACE FUNCTION public.set_user_role(user_id uuid, new_role text)
        RETURNS void AS $$
        BEGIN
          UPDATE auth.users SET role = new_role WHERE id = user_id;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Create a function to get user role
        CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
        RETURNS text AS $$
        DECLARE
          user_role text;
        BEGIN
          SELECT role INTO user_role FROM auth.users WHERE id = user_id;
          RETURN user_role;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Create a function to check if a user is an admin
        CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
        RETURNS boolean AS $$
        DECLARE
          user_role text;
        BEGIN
          SELECT role INTO user_role FROM auth.users WHERE id = user_id;
          RETURN user_role = 'admin';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    })
    
    if (roleManagementError) {
      console.error('Error creating role management functions:', roleManagementError)
    }
    
    return true
  } catch (error) {
    console.error('Error adding user roles:', error)
    return false
  }
}

// Main function to run the migration
const runMigration = async () => {
  try {
    const { supabaseUrl, supabaseKey } = await promptSupabaseCredentials()
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase URL and key are required')
      rl.close()
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('\n🔄 Adding user roles functionality...')
    const success = await addUserRoles(supabase)
    
    if (success) {
      console.log('\n✅ User roles functionality added successfully!')
      console.log('\nYou can now use the following SQL functions:')
      console.log('- set_user_role(user_id, role): Set a user\'s role (e.g., \'admin\', \'user\')')
      console.log('- get_user_role(user_id): Get a user\'s current role')
      console.log('- is_admin(user_id): Check if a user is an admin')
      
      console.log('\nTo make a user an admin, run this SQL in the Supabase SQL Editor:')
      console.log('SELECT set_user_role(\'YOUR_USER_ID\', \'admin\');')
    } else {
      console.log('\n❌ Failed to add user roles functionality. Please check the logs.')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    rl.close()
  }
}

// Run the migration
runMigration() 