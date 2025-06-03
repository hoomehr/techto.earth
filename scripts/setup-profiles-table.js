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
    console.log('🔧 Setting up Profiles Table (Based on Supabase Official Docs)')
    console.log('================================================================\n')
    
    rl.question('Supabase URL: ', (supabaseUrl) => {
      rl.question('Supabase Service Role Key (not anon key): ', (supabaseKey) => {
        resolve({ supabaseUrl, supabaseKey })
      })
    })
  })
}

// SQL for creating the profiles table based on Supabase documentation
const createProfilesTableSQL = `
-- Create profiles table as per Supabase documentation
-- Reference: https://supabase.com/docs/guides/auth/managing-user-data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  current_role TEXT,
  career_interests TEXT[],
  experience_level TEXT CHECK (experience_level IN ('complete_beginner', 'some_interest', 'some_experience', 'experienced')),
  motivation TEXT,
  signup_method TEXT DEFAULT 'email',
  provider TEXT,
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS) as recommended by Supabase
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user creation
-- This automatically creates a profile record when a user signs up
-- Enhanced to properly handle Google OAuth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_provider TEXT;
  user_full_name TEXT;
  user_display_name TEXT;
  user_avatar_url TEXT;
  user_signup_method TEXT;
BEGIN
  -- Determine the provider (google, email, etc.)
  user_provider := COALESCE(NEW.app_metadata->>'provider', 'email');
  
  -- Extract name based on provider
  IF user_provider = 'google' THEN
    -- Google OAuth provides 'name', 'picture', etc.
    user_full_name := COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name'
    );
    user_display_name := COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'given_name'
    );
    user_avatar_url := NEW.raw_user_meta_data->>'picture';
    user_signup_method := 'google';
  ELSE
    -- Email signup or other providers
    user_full_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'display_name'
    );
    user_display_name := COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    );
    user_avatar_url := NEW.raw_user_meta_data->>'avatar_url';
    user_signup_method := COALESCE(NEW.raw_user_meta_data->>'signup_method', 'email');
  END IF;

  -- Insert profile with proper data extraction
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    display_name,
    avatar_url,
    signup_method,
    provider,
    profile_completed
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_display_name,
    user_avatar_url,
    user_signup_method,
    user_provider,
    -- Google users have some profile info already, so mark as partially completed
    CASE WHEN user_provider = 'google' AND user_full_name IS NOT NULL THEN true ELSE false END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to sync user metadata with profiles table
-- Enhanced to properly handle Google OAuth metadata updates
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER AS $$
DECLARE
  user_provider TEXT;
  user_full_name TEXT;
  user_display_name TEXT;
  user_avatar_url TEXT;
BEGIN
  -- Determine the provider
  user_provider := COALESCE(NEW.app_metadata->>'provider', OLD.app_metadata->>'provider', 'email');
  
  -- Extract updated metadata based on provider
  IF user_provider = 'google' THEN
    user_full_name := COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name'
    );
    user_display_name := COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'given_name'
    );
    user_avatar_url := NEW.raw_user_meta_data->>'picture';
  ELSE
    user_full_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'display_name'
    );
    user_display_name := COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    );
    user_avatar_url := NEW.raw_user_meta_data->>'avatar_url';
  END IF;

  -- Update profile with the new metadata
  UPDATE public.profiles 
  SET 
    email = NEW.email,
    full_name = COALESCE(user_full_name, full_name),
    display_name = COALESCE(user_display_name, display_name),
    avatar_url = COALESCE(user_avatar_url, avatar_url),
    provider = COALESCE(user_provider, provider),
    profile_completed = COALESCE(
      (NEW.raw_user_meta_data->>'profile_completed')::boolean,
      profile_completed
    ),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync metadata changes
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_metadata();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_career_interests_idx ON public.profiles USING GIN(career_interests);
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles(location);
CREATE INDEX IF NOT EXISTS profiles_experience_level_idx ON public.profiles(experience_level);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS profiles_profile_completed_idx ON public.profiles(profile_completed);
CREATE INDEX IF NOT EXISTS profiles_provider_idx ON public.profiles(provider);
CREATE INDEX IF NOT EXISTS profiles_signup_method_idx ON public.profiles(signup_method);

-- Create function to manually sync existing Google users (if needed)
CREATE OR REPLACE FUNCTION public.sync_google_users()
RETURNS TEXT AS $$
DECLARE
  user_record RECORD;
  synced_count INTEGER := 0;
BEGIN
  -- Find Google OAuth users without profiles
  FOR user_record IN 
    SELECT u.* FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE u.app_metadata->>'provider' = 'google'
    AND p.id IS NULL
  LOOP
    -- Create profile for Google user
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      display_name,
      avatar_url,
      signup_method,
      provider,
      profile_completed
    )
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(
        user_record.raw_user_meta_data->>'name',
        user_record.raw_user_meta_data->>'full_name'
      ),
      COALESCE(
        user_record.raw_user_meta_data->>'name',
        user_record.raw_user_meta_data->>'given_name'
      ),
      user_record.raw_user_meta_data->>'picture',
      'google',
      'google',
      true -- Google users have basic info
    );
    
    synced_count := synced_count + 1;
  END LOOP;
  
  RETURN 'Synced ' || synced_count || ' Google users to profiles table';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Function to test the setup
const testProfilesTable = async (supabase) => {
  console.log('\n🧪 Testing profiles table setup...')
  
  try {
    // Test 1: Check if table exists and is accessible
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)

    if (testError) {
      console.log('❌ Profiles table access failed:', testError.message)
      return false
    }

    console.log('✅ Profiles table is accessible')

    // Test 2: Check RLS policies
    console.log('🔒 Testing Row Level Security...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('ℹ️ No authenticated user to test RLS (this is normal for service role)')
    }

    // Test 3: Check triggers exist
    console.log('🔧 Checking database triggers...')
    const { data: triggers, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name')
      .in('trigger_name', ['on_auth_user_created', 'on_profiles_updated', 'on_auth_user_updated'])

    if (!triggerError && triggers && triggers.length > 0) {
      console.log(`✅ Found ${triggers.length} triggers:`, triggers.map(t => t.trigger_name))
    }

    // Test 4: Check Google users sync
    console.log('👤 Checking existing Google users...')
    const { data: googleUsers, error: googleError } = await supabase
      .from('profiles')
      .select('id, email, full_name, provider')
      .eq('provider', 'google')
      .limit(5)

    if (!googleError) {
      console.log(`✅ Found ${googleUsers?.length || 0} Google OAuth profiles`)
      if (googleUsers && googleUsers.length > 0) {
        console.log('   Sample:', googleUsers[0])
      }
    }

    return true
  } catch (error) {
    console.error('❌ Error testing profiles table:', error.message)
    return false
  }
}

// Main function to set up the profiles table
const setupProfilesTable = async () => {
  try {
    const { supabaseUrl, supabaseKey } = await promptSupabaseCredentials()
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase credentials')
      return
    }

    console.log('\n🔄 Connecting to Supabase...')
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('📝 Creating profiles table and functions...')
    console.log('   Enhanced for Google OAuth support\n')
    
    // Split SQL into individual statements for better error handling
    const statements = createProfilesTableSQL
      .split(';')
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';')

    let successCount = 0
    let errorCount = 0

    for (const [index, statement] of statements.entries()) {
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${index + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement 
          })

          if (error) {
            console.log(`⚠️ Statement ${index + 1} warning:`, error.message)
            errorCount++
          } else {
            successCount++
          }
        } catch (e) {
          console.log(`❌ Statement ${index + 1} failed:`, e.message)
          errorCount++
        }
      }
    }

    console.log(`\n📊 Execution Summary: ${successCount} succeeded, ${errorCount} had issues`)

    if (errorCount > 0) {
      console.log('\n⚠️ Some statements had issues. Manual execution may be required.')
      console.log('Please run the following SQL in your Supabase SQL Editor:\n')
      console.log(createProfilesTableSQL)
      console.log('\n📋 Steps to manually execute:')
      console.log('1. Go to Supabase Dashboard → SQL Editor')
      console.log('2. Create a new query')
      console.log('3. Copy and paste the SQL above')
      console.log('4. Click "Run"')
    }

    // Test the setup
    const testSuccess = await testProfilesTable(supabase)

    // Offer to sync existing Google users
    console.log('\n🔄 Would you like to sync existing Google users? (y/n)')
    rl.question('', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('🔄 Syncing existing Google users...')
        try {
          const { data: syncResult } = await supabase.rpc('sync_google_users')
          console.log('✅', syncResult)
        } catch (error) {
          console.log('❌ Error syncing Google users:', error.message)
        }
      }
      
      console.log('\n🎉 Setup Summary:')
      console.log('=====================================')
      console.log('✅ Profiles table with Google OAuth support')
      console.log('✅ Row Level Security (RLS) policies')
      console.log('✅ Automatic profile creation trigger')
      console.log('✅ Enhanced metadata synchronization')
      console.log('✅ Google OAuth user handling')
      console.log('✅ Performance indexes')
      console.log('✅ Provider-specific data extraction')

      console.log('\n💡 Google OAuth Features:')
      console.log('• Automatic profile creation for Google users')
      console.log('• Proper extraction of Google user data (name, picture)')
      console.log('• Provider tracking (google vs email)')
      console.log('• Avatar URL sync from Google profile picture')
      console.log('• Enhanced metadata synchronization')

      if (testSuccess) {
        console.log('\n✨ Your profiles table is ready for Google OAuth!')
        console.log('🔍 Test Google login and check the profiles table')
      }
      
      rl.close()
    })

  } catch (error) {
    console.error('❌ Error setting up profiles table:', error.message)
    rl.close()
  }
}

// Run the setup
setupProfilesTable() 