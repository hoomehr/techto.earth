#!/usr/bin/env node

/**
 * This script adds a materials_url column to the courses table in Supabase
 * Run with: node scripts/add-materials-url-field.js
 */

const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🛢️  TechTo.Earth Database Update: Adding materials_url field\n')

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

const addMaterialsUrlField = async (supabase) => {
  try {
    console.log('Adding materials_url field to courses table...')
    const { error } = await supabase.sql(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS materials_url TEXT;
    `)
    
    if (error) throw error
    
    return true
  } catch (error) {
    console.error('Error adding materials_url field:', error)
    return false
  }
}

const updateDatabase = async () => {
  try {
    const { supabaseUrl, supabaseKey } = await promptSupabaseCredentials()
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase URL and key are required')
      rl.close()
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('\n🔄 Adding materials_url field to courses table...')
    const success = await addMaterialsUrlField(supabase)
    
    if (success) {
      console.log('\n✅ Database update completed successfully!')
      console.log('\nThe courses table now has a materials_url field for storing links to online course materials.')
    } else {
      console.log('\n❌ Database update failed. Please check your credentials and try again.')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    rl.close()
  }
}

updateDatabase() 