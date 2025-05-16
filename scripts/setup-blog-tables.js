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

// Function to setup blog tables
const setupBlogTables = async (supabase) => {
  try {
    console.log('\n🔍 Checking if blog tables exist...')
    
    // Create blog_categories table if it doesn't exist
    console.log('Creating blog_categories table if it doesn\'t exist...')
    const { error: categoriesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS blog_categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `
    })
    
    if (categoriesError) {
      console.error('Error creating blog_categories table:', categoriesError)
    }
    
    // Create blog_posts table if it doesn't exist
    console.log('Creating blog_posts table if it doesn\'t exist...')
    const { error: postsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT,
          featured_image TEXT,
          author_id UUID REFERENCES auth.users(id),
          published BOOLEAN NOT NULL DEFAULT FALSE,
          published_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `
    })
    
    if (postsError) {
      console.error('Error creating blog_posts table:', postsError)
    }
    
    // Create blog_post_categories junction table if it doesn't exist
    console.log('Creating blog_post_categories junction table if it doesn\'t exist...')
    const { error: junctionError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS blog_post_categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
          category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(post_id, category_id)
        );
      `
    })
    
    if (junctionError) {
      console.error('Error creating blog_post_categories table:', junctionError)
    }
    
    return !categoriesError && !postsError && !junctionError
  } catch (error) {
    console.error('Error setting up blog tables:', error)
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
    
    console.log('\n🔄 Setting up blog tables...')
    const success = await setupBlogTables(supabase)
    
    if (success) {
      console.log('\n✅ Blog tables have been set up successfully!')
      console.log('\nYou now have the following tables:')
      console.log('- blog_categories: for blog category management')
      console.log('- blog_posts: for blog post content')
      console.log('- blog_post_categories: junction table for post-category relationships')
    } else {
      console.log('\n⚠️ There were some issues setting up the blog tables. Please check the log above.')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    rl.close()
  }
}

// Run the migration
runMigration() 