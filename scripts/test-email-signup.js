#!/usr/bin/env node

/**
 * Test script for email signup and profile creation
 * This helps verify the complete flow from signup to profile completion
 */

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
    console.log('📧 Testing Email Signup Flow')
    console.log('=====================================\n')
    
    rl.question('Supabase URL (or press Enter to use environment): ', (supabaseUrl) => {
      rl.question('Supabase Anon Key (or press Enter to use environment): ', (supabaseKey) => {
        resolve({ 
          supabaseUrl: supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL, 
          supabaseKey: supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        })
      })
    })
  })
}

const testEmailSignup = async () => {
  try {
    const { supabaseUrl, supabaseKey } = await promptSupabaseCredentials()
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Error: Missing Supabase URL or Anon Key')
      console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
      rl.close()
      return
    }

    console.log('\n🔄 Connecting to Supabase...')
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('\n📝 Testing Email Signup Process...\n')

    // Test 1: Check if auth is working
    console.log('1️⃣ Testing authentication connection...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Auth connection failed:', sessionError.message)
      return
    } else {
      console.log('✅ Auth connection successful')
      if (session) {
        console.log(`   Current user: ${session.user.email}`)
      } else {
        console.log('   No active session (expected for test)')
      }
    }

    // Test 2: Check profiles table exists
    console.log('\n2️⃣ Testing profiles table...')
    const { data: profilesTest, error: profilesError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)

    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message)
      console.log('   💡 Run: node scripts/setup-profiles-table.js')
    } else {
      console.log('✅ Profiles table accessible')
    }

    // Test 3: Check other required tables
    console.log('\n3️⃣ Testing other required tables...')
    
    const tableTests = [
      { name: 'courses', description: 'course catalog' },
      { name: 'events', description: 'events system' },
      { name: 'groups', description: 'community groups' }
    ]

    for (const table of tableTests) {
      const { error: tableError } = await supabase
        .from(table.name)
        .select('count(*)')
        .limit(1)

      if (tableError) {
        console.log(`❌ ${table.name} table: ${tableError.message}`)
      } else {
        console.log(`✅ ${table.name} table: Available`)
      }
    }

    console.log('\n📱 Manual Testing Instructions:')
    console.log('=====================================')
    console.log('1. Visit: http://localhost:3002/auth')
    console.log('2. Click "Sign Up" tab')
    console.log('3. Fill in:')
    console.log('   • Full Name: Test User')
    console.log('   • Email: test@example.com (or your email)')
    console.log('   • Password: testpassword123')
    console.log('4. Click "Sign Up"')
    console.log('5. Check if you\'re redirected to profile completion')
    console.log('6. Complete the 3-step profile setup')
    console.log('7. Verify you reach the personalized dashboard')

    console.log('\n✅ Expected Flow:')
    console.log('• Email signup → Profile completion → Dashboard')
    console.log('• Google OAuth → Profile completion (if needed) → Dashboard')
    console.log('• Return visits → Dashboard (with saved preferences)')

    console.log('\n🔍 Troubleshooting:')
    console.log('• Email confirmation: Check Supabase Auth settings')
    console.log('• Profile errors: Ensure profiles table is set up')
    console.log('• Redirect issues: Check auth callback route')

    console.log('\n🎯 What to verify:')
    console.log('• ✅ User can sign up with email/password')
    console.log('• ✅ Profile completion flow works')
    console.log('• ✅ Dashboard shows personalized content')
    console.log('• ✅ User data is saved to profiles table')
    console.log('• ✅ Career interests are tracked')

  } catch (error) {
    console.error('❌ Error testing signup flow:', error.message)
  } finally {
    rl.close()
  }
}

// Run the test
testEmailSignup() 