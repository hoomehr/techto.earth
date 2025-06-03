-- Update Existing Profiles Table for Google OAuth Support
-- Copy and paste this into your Supabase SQL Editor
-- This will add missing fields to your existing profiles table

-- 1. Add missing columns to existing profiles table (one by one for compatibility)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_role TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS career_interests TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS motivation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_method TEXT DEFAULT 'email';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Add constraint for experience_level after column creation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'profiles_experience_level_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_experience_level_check 
    CHECK (experience_level IN ('complete_beginner', 'some_interest', 'some_experience', 'experienced'));
  END IF;
END $$;

-- 2. Ensure Row Level Security is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create or update RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Create function to handle new user creation (Google OAuth Support)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_provider TEXT;
  user_full_name TEXT;
  user_display_name TEXT;
  user_avatar_url TEXT;
  user_signup_method TEXT;
  is_google_user BOOLEAN;
  user_providers JSONB;
  user_metadata JSONB;
BEGIN
  -- Extract metadata safely
  user_metadata := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  user_providers := COALESCE(NEW.raw_app_meta_data->'providers', '[]'::jsonb);
  
  -- Enhanced Google OAuth detection
  is_google_user := (
    user_providers ? 'google' OR 
    NEW.raw_app_meta_data->>'provider' = 'google' OR
    user_metadata->>'picture' IS NOT NULL OR
    user_metadata->>'provider_id' IS NOT NULL OR
    user_metadata->>'sub' IS NOT NULL
  );

  -- Set provider and signup method
  IF is_google_user THEN
    user_provider := 'google';
    user_signup_method := 'google';
    
    -- Extract Google-specific data
    user_full_name := COALESCE(
      user_metadata->>'name',
      user_metadata->>'full_name'
    );
    user_display_name := COALESCE(
      user_metadata->>'name',
      user_metadata->>'given_name'
    );
    user_avatar_url := user_metadata->>'picture';
  ELSE
    user_provider := COALESCE(NEW.raw_app_meta_data->>'provider', 'email');
    user_signup_method := COALESCE(user_metadata->>'signup_method', 'email');
    
    -- Extract email signup data
    user_full_name := COALESCE(
      user_metadata->>'full_name',
      user_metadata->>'name'
    );
    user_display_name := COALESCE(
      user_metadata->>'display_name',
      user_metadata->>'full_name'
    );
    user_avatar_url := user_metadata->>'avatar_url';
  END IF;

  -- Insert profile using existing + new fields
  INSERT INTO public.profiles (
    id, 
    full_name,
    display_name,
    avatar_url,
    signup_method,
    provider,
    profile_completed,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    user_full_name,
    user_display_name,
    user_avatar_url,
    user_signup_method,
    user_provider,
    CASE WHEN is_google_user AND user_full_name IS NOT NULL THEN true ELSE false END,
    NOW(),
    NOW()
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
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Update existing profiles for current users
UPDATE public.profiles 
SET 
  provider = 'email',
  signup_method = 'email',
  profile_completed = CASE WHEN full_name IS NOT NULL THEN true ELSE false END
WHERE provider IS NULL;

-- 9. Create function to create profiles for existing users without profiles
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS TEXT AS $$
DECLARE
  user_record RECORD;
  profile_count INTEGER := 0;
  is_google_user BOOLEAN;
  user_providers JSONB;
  user_provider TEXT;
  user_metadata JSONB;
BEGIN
  -- Find users without profiles
  FOR user_record IN 
    SELECT 
      u.id,
      u.email,
      u.raw_app_meta_data,
      u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Extract metadata safely
    user_metadata := COALESCE(user_record.raw_user_meta_data, '{}'::jsonb);
    user_providers := COALESCE(user_record.raw_app_meta_data->'providers', '[]'::jsonb);
    user_provider := COALESCE(user_record.raw_app_meta_data->>'provider', 'email');
    
    -- Check if this is a Google user using proper JSON operators
    is_google_user := (
      user_providers ? 'google' OR 
      user_provider = 'google' OR
      user_metadata->>'picture' IS NOT NULL OR
      user_metadata->>'provider_id' IS NOT NULL OR
      user_metadata->>'sub' IS NOT NULL
    );
    
    -- Create profile
    INSERT INTO public.profiles (
      id,
      full_name,
      display_name,
      avatar_url,
      signup_method,
      provider,
      profile_completed,
      created_at,
      updated_at
    )
    VALUES (
      user_record.id,
      CASE 
        WHEN is_google_user THEN COALESCE(
          user_metadata->>'name',
          user_metadata->>'full_name'
        )
        ELSE COALESCE(
          user_metadata->>'full_name',
          user_metadata->>'name'
        )
      END,
      CASE 
        WHEN is_google_user THEN COALESCE(
          user_metadata->>'name',
          user_metadata->>'given_name'
        )
        ELSE COALESCE(
          user_metadata->>'display_name',
          user_metadata->>'full_name'
        )
      END,
      CASE 
        WHEN is_google_user THEN user_metadata->>'picture'
        ELSE user_metadata->>'avatar_url'
      END,
      CASE WHEN is_google_user THEN 'google' ELSE 'email' END,
      CASE WHEN is_google_user THEN 'google' ELSE user_provider END,
      CASE WHEN is_google_user AND user_metadata->>'name' IS NOT NULL THEN true ELSE false END,
      NOW(),
      NOW()
    );
    
    profile_count := profile_count + 1;
  END LOOP;
  
  RETURN 'Created ' || profile_count || ' profiles for existing users';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Run the function to create profiles for existing users
SELECT public.create_missing_profiles();

-- 11. Create helpful indexes
CREATE INDEX IF NOT EXISTS profiles_career_interests_idx ON public.profiles USING GIN(career_interests);
CREATE INDEX IF NOT EXISTS profiles_experience_level_idx ON public.profiles(experience_level);
CREATE INDEX IF NOT EXISTS profiles_profile_completed_idx ON public.profiles(profile_completed);
CREATE INDEX IF NOT EXISTS profiles_provider_idx ON public.profiles(provider);
CREATE INDEX IF NOT EXISTS profiles_signup_method_idx ON public.profiles(signup_method);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Profiles table updated successfully!';
  RAISE NOTICE '✅ Added Google OAuth support fields';
  RAISE NOTICE '✅ Automatic profile creation triggers installed';
  RAISE NOTICE '✅ Existing user profiles updated';
END $$; 