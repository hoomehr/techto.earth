#!/usr/bin/env node

/**
 * This script creates sample data in the dashboard tables for an existing user
 * Run with: node scripts/seed-dashboard-data.js user_id
 */

const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Get user ID from command line arguments
const userId = process.argv[2]

if (!userId) {
  console.error('❌ Please provide a user ID as an argument')
  console.log('Usage: node scripts/seed-dashboard-data.js USER_ID')
  console.log('Example: node scripts/seed-dashboard-data.js c155e9f8-6dfd-422e-a265-f71388d02843')
  process.exit(1)
}

console.log(`🌱 TechTo.Earth Dashboard Data Seeder\n`)
console.log(`Creating sample data for user: ${userId}\n`)

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

// Sample data
const coursesData = [
  { id: '1', title: 'Introduction to Permaculture', description: 'Learn the basics of permaculture design principles' },
  { id: '2', title: 'Organic Farming Basics', description: 'Essential skills for starting your organic farm' },
  { id: '3', title: 'Restaurant Management', description: 'How to manage a farm-to-table restaurant' }
]

const eventsData = [
  { id: '1', title: 'Farm Tour Weekend', description: 'Visit local organic farms', date: '2024-06-15T10:00:00Z' },
  { id: '2', title: 'Sustainable Agriculture Conference', description: 'Annual conference for sustainable farming practices', date: '2024-07-22T09:00:00Z' }
]

const groupsData = [
  { id: '1', title: 'Urban Farmers Collective', description: 'A community of urban farmers sharing resources and knowledge' },
  { id: '2', title: 'Tech to Restaurant Owners', description: 'Former tech professionals who now own restaurants' }
]

const seedData = async (supabase) => {
  try {
    // Check if the necessary tables exist
    const { error: tablesError } = await supabase
      .from('course_enrollments')
      .select('id', { count: 'exact', head: true })
    
    if (tablesError && tablesError.code === '42P01') {
      console.error('❌ Database tables not found. Please run setup-database.js first.')
      return false
    }
    
    // Create course enrollments
    console.log('Creating course enrollments...')
    for (const course of coursesData) {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: userId,
          course_id: course.id,
          status: 'active'
        })
      
      if (error) throw error
      console.log(`✓ Enrolled in: ${course.title}`)
    }
    
    // Create event registrations
    console.log('\nCreating event registrations...')
    for (const event of eventsData) {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          user_id: userId,
          event_id: event.id,
          status: 'confirmed'
        })
      
      if (error) throw error
      console.log(`✓ Registered for: ${event.title}`)
    }
    
    // Create group memberships
    console.log('\nCreating group memberships...')
    for (const group of groupsData) {
      const { error } = await supabase
        .from('group_memberships')
        .insert({
          user_id: userId,
          group_id: group.id,
          role: 'member'
        })
      
      if (error) throw error
      console.log(`✓ Joined group: ${group.title}`)
    }
    
    return true
  } catch (error) {
    console.error('Error seeding data:', error)
    return false
  }
}

const runSeeder = async () => {
  try {
    const { supabaseUrl, supabaseKey } = await promptSupabaseCredentials()
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase URL and key are required')
      rl.close()
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('🔄 Seeding sample data...')
    const success = await seedData(supabase)
    
    if (success) {
      console.log('\n✅ Sample data created successfully!')
      console.log('\nThe user now has:')
      console.log('- 3 course enrollments')
      console.log('- 2 event registrations')
      console.log('- 2 group memberships')
    } else {
      console.log('\n❌ Failed to seed data. Please check your credentials and try again.')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    rl.close()
  }
}

runSeeder() 