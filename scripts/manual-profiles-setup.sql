-- TechTo.Earth Profiles Table Setup
-- Copy and paste this entire file into your Supabase SQL Editor
-- Run it to create the profiles table with Google OAuth support

-- 1. Create the profiles table
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
  provider TEXT DEFAULT 'email',
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Create function to handle new user creation (Enhanced Google OAuth Support)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_provider TEXT;
  user_full_name TEXT;
  user_display_name TEXT;
  user_avatar_url TEXT;
  user_signup_method TEXT;
  is_google_user BOOLEAN;
BEGIN
  -- Enhanced Google OAuth detection
  is_google_user := (
    (NEW.app_metadata->>'providers')::jsonb ? 'google' OR 
    NEW.app_metadata->>'provider' = 'google' OR
    NEW.raw_user_meta_data->>'picture' IS NOT NULL OR
    NEW.raw_user_meta_data->>'provider_id' IS NOT NULL
  );

  -- Set provider and signup method
  IF is_google_user THEN
    user_provider := 'google';
    user_signup_method := 'google';
    
    -- Extract Google-specific data
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
    user_provider := COALESCE(NEW.app_metadata->>'provider', 'email');
    user_signup_method := COALESCE(NEW.raw_user_meta_data->>'signup_method', 'email');
    
    -- Extract email signup data
    user_full_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    );
    user_display_name := COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name'
    );
    user_avatar_url := NEW.raw_user_meta_data->>'avatar_url';
  END IF;

  -- Insert profile
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
    -- Google users have basic info, so mark as partially completed
    CASE WHEN is_google_user AND user_full_name IS NOT NULL THEN true ELSE false END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Create function to manually create profile for existing Google users
CREATE OR REPLACE FUNCTION public.create_profile_for_existing_google_users()
RETURNS TEXT AS $$
DECLARE
  user_record RECORD;
  profile_count INTEGER := 0;
  is_google_user BOOLEAN;
BEGIN
  -- Find users without profiles
  FOR user_record IN 
    SELECT u.* FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Check if this is a Google user
    is_google_user := (
      (user_record.app_metadata->>'providers')::jsonb ? 'google' OR 
      user_record.app_metadata->>'provider' = 'google' OR
      user_record.raw_user_meta_data->>'picture' IS NOT NULL OR
      user_record.raw_user_meta_data->>'provider_id' IS NOT NULL
    );
    
    -- Create profile
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
      CASE 
        WHEN is_google_user THEN COALESCE(
          user_record.raw_user_meta_data->>'name',
          user_record.raw_user_meta_data->>'full_name'
        )
        ELSE COALESCE(
          user_record.raw_user_meta_data->>'full_name',
          user_record.raw_user_meta_data->>'name'
        )
      END,
      CASE 
        WHEN is_google_user THEN COALESCE(
          user_record.raw_user_meta_data->>'name',
          user_record.raw_user_meta_data->>'given_name'
        )
        ELSE COALESCE(
          user_record.raw_user_meta_data->>'display_name',
          user_record.raw_user_meta_data->>'full_name'
        )
      END,
      CASE 
        WHEN is_google_user THEN user_record.raw_user_meta_data->>'picture'
        ELSE user_record.raw_user_meta_data->>'avatar_url'
      END,
      CASE WHEN is_google_user THEN 'google' ELSE 'email' END,
      CASE WHEN is_google_user THEN 'google' ELSE COALESCE(user_record.app_metadata->>'provider', 'email') END,
      CASE WHEN is_google_user AND user_record.raw_user_meta_data->>'name' IS NOT NULL THEN true ELSE false END
    );
    
    profile_count := profile_count + 1;
  END LOOP;
  
  RETURN 'Created ' || profile_count || ' profiles for existing users';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_career_interests_idx ON public.profiles USING GIN(career_interests);
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles(location);
CREATE INDEX IF NOT EXISTS profiles_experience_level_idx ON public.profiles(experience_level);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS profiles_profile_completed_idx ON public.profiles(profile_completed);
CREATE INDEX IF NOT EXISTS profiles_provider_idx ON public.profiles(provider);

-- 10. Run the function to create profiles for existing users
SELECT public.create_profile_for_existing_google_users();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Profiles table setup complete!';
  RAISE NOTICE '✅ Google OAuth support enabled';
  RAISE NOTICE '✅ Automatic profile creation triggers installed';
  RAISE NOTICE '✅ Profiles created for existing users';
END $$; 