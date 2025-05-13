#!/usr/bin/env node

/**
 * This script creates the necessary tables in Supabase for the dashboard
 * Run with: node scripts/setup-database-env.js
 */

const { createClient } = require('@supabase/supabase-js')

// Hardcoded Supabase credentials (replace these with your actual credentials)
const supabaseUrl = 'https://eykjoddhirsnjrqtuooy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5a2pvZGRoaXJzbmpycXR1b295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgwODc1OCwiZXhwIjoyMDYyMzg0NzU4fQ.eG3eKY9oXFnymKIvQUPosS4v3no1rSxod5HMMj_8OU4'

console.log('🛢️  TechTo.Earth Database Setup\n')
console.log(`Using Supabase URL: ${supabaseUrl}`)
console.log(`Using Service Role Key: ${supabaseKey.substring(0, 10)}...`)

const supabase = createClient(supabaseUrl, supabaseKey)

// Create the tables directly using Supabase query API
const createTables = async () => {
  try {
    console.log('\n🔄 Setting up database tables...')
    
    // Create course_enrollments table
    console.log('Creating course_enrollments table...')
    const { error: enrollmentsError } = await supabase.from('course_enrollments').select().limit(1)
    
    if (enrollmentsError && enrollmentsError.code === '42P01') {
      console.log('Course enrollments table does not exist, creating it...')
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.course_enrollments (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          course_id UUID NOT NULL,
          completion_percentage INTEGER DEFAULT 0,
          enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          status TEXT DEFAULT 'active' NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `)
      if (error) {
        console.error('Error creating course_enrollments table:', error)
        return false
      }
    }
    
    // Create event_registrations table
    console.log('Creating event_registrations table...')
    const { error: registrationsError } = await supabase.from('event_registrations').select().limit(1)
    
    if (registrationsError && registrationsError.code === '42P01') {
      console.log('Event registrations table does not exist, creating it...')
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.event_registrations (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          event_id UUID NOT NULL,
          registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          status TEXT DEFAULT 'confirmed' NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `)
      if (error) {
        console.error('Error creating event_registrations table:', error)
        return false
      }
    }
    
    // Create group_memberships table
    console.log('Creating group_memberships table...')
    const { error: membershipsError } = await supabase.from('group_memberships').select().limit(1)
    
    if (membershipsError && membershipsError.code === '42P01') {
      console.log('Group memberships table does not exist, creating it...')
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.group_memberships (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          group_id UUID NOT NULL,
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          role TEXT DEFAULT 'member' NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `)
      if (error) {
        console.error('Error creating group_memberships table:', error)
        return false
      }
    }

    // Check if courses table exists
    console.log('Checking courses table...')
    const { error: coursesError } = await supabase.from('courses').select().limit(1)
    
    if (!coursesError) {
      console.log('Courses table already exists!')
    } else if (coursesError.code === '42P01') {
      console.log('Courses table does not exist. You need to create it in Supabase UI or with migrations.')
      console.log('Creating sample courses...')
    }

    // Check if events table exists
    console.log('Checking events table...')
    const { error: eventsError } = await supabase.from('events').select().limit(1)
    
    if (!eventsError) {
      console.log('Events table already exists!')
    } else if (eventsError.code === '42P01') {
      console.log('Events table does not exist. You need to create it in Supabase UI or with migrations.')
      console.log('Creating sample events...')
    }

    // Check if groups table exists
    console.log('Checking groups table...')
    const { error: groupsError } = await supabase.from('groups').select().limit(1)
    
    if (!groupsError) {
      console.log('Groups table already exists!')
    } else if (groupsError.code === '42P01') {
      console.log('Groups table does not exist. You need to create it in Supabase UI or with migrations.')
      console.log('Creating sample groups...')
    }

    return true
  } catch (error) {
    console.error('Error checking or creating tables:', error)
    return false
  }
}

// Insert sample data for testing
const insertSampleData = async () => {
  console.log('\n🔄 Inserting sample data...')
  
  try {
    // Check and create courses table if needed
    const { error: checkCoursesError } = await supabase.from('courses').select().limit(1)
    
    if (checkCoursesError && checkCoursesError.code === '42P01') {
      // Create courses table
      const { error: createError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.courses (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          short_description TEXT,
          content TEXT,
          image_url TEXT,
          price NUMERIC DEFAULT 0,
          duration TEXT DEFAULT '4 weeks',
          level TEXT DEFAULT 'beginner',
          category TEXT DEFAULT 'other',
          is_published BOOLEAN DEFAULT false,
          created_by UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `)
      
      if (createError) {
        console.error('Error creating courses table:', createError)
        return false
      }
    }
    
    // Insert sample course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .upsert({
        title: 'Introduction to Sustainable Farming',
        description: 'Learn the basics of sustainable farming practices that you can apply in your transition from tech to agriculture.',
        short_description: 'An introduction to sustainable farming for tech professionals',
        price: 0,
        duration: '4 weeks',
        level: 'beginner',
        category: 'farming',
        is_published: true
      })
    
    if (courseError) {
      console.error('Error inserting sample course:', courseError)
    } else {
      console.log('✅ Sample course created')
    }
    
    // Check and create events table if needed
    const { error: checkEventsError } = await supabase.from('events').select().limit(1)
    
    if (checkEventsError && checkEventsError.code === '42P01') {
      // Create events table
      const { error: createError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.events (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          location TEXT NOT NULL,
          start_date TIMESTAMP WITH TIME ZONE NOT NULL,
          end_date TIMESTAMP WITH TIME ZONE NOT NULL,
          image_url TEXT,
          price NUMERIC DEFAULT 0,
          capacity INTEGER DEFAULT 50,
          category TEXT DEFAULT 'other',
          is_published BOOLEAN DEFAULT false,
          created_by UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `)
      
      if (createError) {
        console.error('Error creating events table:', createError)
        return false
      }
    }
    
    // Insert sample event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .upsert({
        title: 'Farm Visit & Networking',
        description: 'Join us for a day at an organic farm run by former tech professionals. Network with others on the same journey.',
        location: 'Green Acres Farm, Sonoma County',
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
        price: 25,
        capacity: 30,
        category: 'farm-tour',
        is_published: true
      })
    
    if (eventError) {
      console.error('Error inserting sample event:', eventError)
    } else {
      console.log('✅ Sample event created')
    }
    
    // Check and create groups table if needed
    const { error: checkGroupsError } = await supabase.from('groups').select().limit(1)
    
    if (checkGroupsError && checkGroupsError.code === '42P01') {
      // Create groups table
      const { error: createError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.groups (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          location TEXT,
          category TEXT DEFAULT 'other',
          member_count INTEGER DEFAULT 0,
          is_private BOOLEAN DEFAULT false,
          created_by UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `)
      
      if (createError) {
        console.error('Error creating groups table:', createError)
        return false
      }
    }
    
    // Insert sample group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .upsert({
        name: 'Tech to Farm Transition',
        description: 'A supportive community for tech professionals transitioning to farming and agriculture.',
        category: 'farming',
        member_count: 12,
        is_private: false
      })
    
    if (groupError) {
      console.error('Error inserting sample group:', groupError)
    } else {
      console.log('✅ Sample group created')
    }
    
    return true
  } catch (error) {
    console.error('Error inserting sample data:', error)
    return false
  }
}

// Main function to run the script
const setupDatabase = async () => {
  try {
    const tablesCreated = await createTables()
    
    if (tablesCreated) {
      console.log('\n✅ Database tables checked successfully!')
      
      // Ask if sample data should be inserted
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      readline.question('\nDo you want to insert sample data? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          const dataInserted = await insertSampleData()
          
          if (dataInserted) {
            console.log('\n✅ Sample data inserted successfully!')
          } else {
            console.log('\n❌ Failed to insert some sample data.')
          }
        }
        
        console.log('\n🎉 Database setup complete!')
        console.log('You can now view your dashboard with courses, events, and groups.')
        readline.close()
      })
    } else {
      console.log('\n❌ Database setup failed. Please check your credentials and try again.')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

setupDatabase() 