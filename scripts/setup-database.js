#!/usr/bin/env node

/**
 * This script creates the necessary tables in Supabase for the dashboard
 * Run with: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🛢️  TechTo.Earth Database Setup\n')

// Get Supabase credentials
const promptSupabaseCredentials = async () => {
  return new Promise((resolve) => {
    rl.question('Enter your Supabase URL: ', (supabaseUrl) => {
      rl.question('Enter your Supabase service role key (not anon key): ', (supabaseKey) => {
        resolve({ supabaseUrl, supabaseKey })
      })
    })
  })
}

const createTables = async (supabase) => {
  try {
    console.log('Creating course_enrollments table...')
    const { error: enrollmentsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'course_enrollments',
      table_definition: `
        id uuid default uuid_generate_v4() primary key,
        user_id uuid references auth.users(id) on delete cascade not null,
        course_id uuid not null,
        enrolled_at timestamp with time zone default now() not null,
        status text default 'active' not null,
        created_at timestamp with time zone default now() not null
      `
    })
    
    if (enrollmentsError) throw enrollmentsError
    
    console.log('Creating event_registrations table...')
    const { error: registrationsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'event_registrations',
      table_definition: `
        id uuid default uuid_generate_v4() primary key,
        user_id uuid references auth.users(id) on delete cascade not null,
        event_id uuid not null,
        registered_at timestamp with time zone default now() not null,
        status text default 'confirmed' not null,
        created_at timestamp with time zone default now() not null
      `
    })
    
    if (registrationsError) throw registrationsError
    
    console.log('Creating group_memberships table...')
    const { error: membershipsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'group_memberships',
      table_definition: `
        id uuid default uuid_generate_v4() primary key,
        user_id uuid references auth.users(id) on delete cascade not null,
        group_id uuid not null,
        joined_at timestamp with time zone default now() not null,
        role text default 'member' not null,
        created_at timestamp with time zone default now() not null
      `
    })
    
    if (membershipsError) throw membershipsError

    // Add create_table_if_not_exists function if it doesn't exist
    const { error: functionError } = await supabase.rpc('create_table_if_not_exists_function', {})
    if (functionError && !functionError.message.includes('already exists')) {
      console.log('Creating helper function for table creation...')
      const { error: createFunctionError } = await supabase.sql(`
        create or replace function create_table_if_not_exists(table_name text, table_definition text)
        returns void as $$
        begin
          execute format('create table if not exists %I (%s)', table_name, table_definition);
        end;
        $$ language plpgsql security definer;
      `)
      if (createFunctionError) throw createFunctionError
    }
    
    return true
  } catch (error) {
    console.error('Error creating tables:', error)
    return false
  }
}

const setupDatabase = async () => {
  try {
    const { supabaseUrl, supabaseKey } = await promptSupabaseCredentials()
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase URL and key are required')
      rl.close()
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('\n🔄 Setting up database tables...')
    const success = await createTables(supabase)
    
    if (success) {
      console.log('\n✅ Database setup completed successfully!')
      console.log('\nNow users can access the dashboard and see their enrollments, registrations, and memberships.')
    } else {
      console.log('\n❌ Database setup failed. Please check your credentials and try again.')
    }
    
    console.log('\n📝 Note: You might need to enable Row Level Security and set up appropriate policies for these tables.')
    console.log('For more information, see the Supabase documentation on RLS: https://supabase.com/docs/guides/auth/row-level-security')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    rl.close()
  }
}

setupDatabase() 