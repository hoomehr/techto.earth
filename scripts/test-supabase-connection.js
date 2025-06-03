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
    console.log('🔗 Testing Supabase Connection')
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

// Main function to test connection and check data
const testConnection = async () => {
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

    // Test connection by checking available tables
    console.log('\n📊 Testing database connection and checking data...\n')

    // Check courses
    const { data: courses, error: coursesError, count: coursesCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .limit(3)

    if (coursesError) {
      console.log('❌ Courses table:', coursesError.message)
    } else {
      console.log(`✅ Courses table: ${coursesCount || 0} total courses`)
      if (courses && courses.length > 0) {
        console.log('   Sample courses:')
        courses.forEach((course, index) => {
          console.log(`   ${index + 1}. ${course.title} (${course.category})`)
        })
      }
    }

    // Check events
    const { data: events, error: eventsError, count: eventsCount } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .limit(3)

    if (eventsError) {
      console.log('❌ Events table:', eventsError.message)
    } else {
      console.log(`✅ Events table: ${eventsCount || 0} total events`)
      if (events && events.length > 0) {
        console.log('   Sample events:')
        events.forEach((event, index) => {
          console.log(`   ${index + 1}. ${event.title} (${event.start_date})`)
        })
      }
    }

    // Check groups
    const { data: groups, error: groupsError, count: groupsCount } = await supabase
      .from('groups')
      .select('*', { count: 'exact' })
      .limit(3)

    if (groupsError) {
      console.log('❌ Groups table:', groupsError.message)
    } else {
      console.log(`✅ Groups table: ${groupsCount || 0} total groups`)
      if (groups && groups.length > 0) {
        console.log('   Sample groups:')
        groups.forEach((group, index) => {
          console.log(`   ${index + 1}. ${group.name} (${group.location || 'No location'})`)
        })
      }
    }

    // Check enrollment tables (might not exist yet)
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('course_enrollments')
      .select('*')
      .limit(1)

    if (enrollmentsError) {
      console.log('❌ Course enrollments table:', enrollmentsError.message)
    } else {
      console.log('✅ Course enrollments table: Available')
    }

    console.log('\n📝 Summary:')
    console.log('=====================================')
    console.log(`• Total Courses: ${coursesCount || 0}`)
    console.log(`• Total Events: ${eventsCount || 0}`)
    console.log(`• Total Groups: ${groupsCount || 0}`)
    
    if ((coursesCount || 0) === 0 && (eventsCount || 0) === 0) {
      console.log('\n💡 Recommendation:')
      console.log('   Your database appears to be empty. Consider running:')
      console.log('   → node scripts/setup-database.js')
      console.log('   → node scripts/seed-dashboard-data.js')
    } else {
      console.log('\n🎉 Your database looks good!')
      console.log('   You can now test the Google OAuth and dashboard features.')
      console.log('   Visit: http://localhost:3002')
    }

    console.log('\n🔐 OAuth Setup:')
    console.log('   For Google OAuth to work, make sure you have:')
    console.log('   1. Configured Google OAuth in Supabase Dashboard')
    console.log('   2. Set the redirect URL: http://localhost:3002/api/auth/callback')
    console.log('   3. Added your domain to authorized domains')

  } catch (error) {
    console.error('❌ Error testing connection:', error.message)
  } finally {
    rl.close()
  }
}

// Run the test
testConnection() 