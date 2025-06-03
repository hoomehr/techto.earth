# 🔐 Authentication Setup Guide

This guide will help you set up the complete authentication system based on [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) with enhanced Google OAuth support.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
# Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

Run the enhanced profile table setup script:

```bash
node scripts/setup-profiles-table.js
```

This will create:
- ✅ `profiles` table with Google OAuth support
- ✅ Row Level Security (RLS) policies  
- ✅ Automatic profile creation triggers
- ✅ Enhanced metadata synchronization
- ✅ Google-specific data extraction
- ✅ Performance indexes

### 3. Supabase Dashboard Configuration

#### A. Email Authentication
1. Go to **Authentication** > **Settings**
2. Configure **Email confirmation**:
   - ✅ **Enabled**: Users must confirm email (recommended)
   - ❌ **Disabled**: Immediate signup (for development)

#### B. Google OAuth Setup
1. Go to **Authentication** > **Providers** 
2. Enable **Google** provider
3. Add your Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
4. Set **Redirect URLs**:
   - `http://localhost:3002/api/auth/callback` (development)
   - `https://yourdomain.com/api/auth/callback` (production)

**📋 Google Cloud Console Setup:**
1. Create a project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Go to **Credentials** > **Create Credentials** > **OAuth Client ID**
4. Set **Authorized JavaScript origins**: `http://localhost:3002`
5. Set **Authorized redirect URIs**: `http://localhost:3002/api/auth/callback`
6. Copy Client ID and Secret to Supabase Dashboard

#### C. URL Configuration
1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL**: `http://localhost:3002` (or your domain)
3. Add **Redirect URLs**:
   - `http://localhost:3002/api/auth/callback`
   - `http://localhost:3002/dashboard`

## 🔧 Features Implemented

### 📧 Email Authentication
- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Email confirmation (configurable)
- ✅ Proper error handling
- ✅ User metadata management

### 🌐 Google OAuth (Enhanced)
- ✅ Google sign-in integration
- ✅ Automatic profile creation with Google data
- ✅ Avatar sync from Google profile picture
- ✅ Enhanced metadata synchronization
- ✅ Provider-specific data extraction
- ✅ Pre-filled profile completion for Google users

### 👤 User Profiles
- ✅ Automatic profile creation on signup
- ✅ Extended user data in `profiles` table
- ✅ Career interests tracking
- ✅ Profile completion workflow
- ✅ Real-time sync with auth metadata
- ✅ Google OAuth data handling

### 🔒 Security
- ✅ Row Level Security (RLS) policies
- ✅ Secure database triggers
- ✅ Protected API routes
- ✅ Session management

## 🧪 Testing Your Setup

### 1. Run the App
```bash
npm run dev
```

### 2. Test Google OAuth Profile Creation

1. **Test Google Sign-in:**
   - Visit: `http://localhost:3002/auth`
   - Click **Continue with Google**
   - Complete Google OAuth flow
   - Should redirect to profile completion

2. **Verify Profile Creation:**
   - Check browser console for logs:
   ```
   🌐 Processing Google OAuth user...
   ✅ Profile created for Google user
   ```
   - Check Supabase Dashboard > Table Editor > `profiles`
   - Should see new profile with:
     - `full_name` from Google
     - `avatar_url` from Google profile picture
     - `provider` = 'google'
     - `signup_method` = 'google'

3. **Test Profile Completion:**
   - Google users skip basic info step
   - Should see "Pre-filled from Google" message
   - Focus on interests and background steps

### 3. Test Email Signup
1. Visit: `http://localhost:3002/auth`
2. Click **Sign Up** tab
3. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `testpassword123`
4. Click **Create Account**

**Expected Flow:**
- If email confirmation enabled → Check email for confirmation link
- If email confirmation disabled → Redirect to profile completion

### 4. Test Profile System
1. Complete the profile setup:
   - **Google users**: Start from interests (Step 2)
   - **Email users**: Start from basic info (Step 1)
2. Should redirect to personalized dashboard

## 🔍 Profile Data Verification

### Check Profile Creation in Database

1. **Via Supabase Dashboard:**
   ```sql
   SELECT * FROM profiles WHERE provider = 'google';
   ```

2. **Expected Google User Profile:**
   ```json
   {
     "id": "user-uuid",
     "email": "user@gmail.com",
     "full_name": "John Doe",
     "avatar_url": "https://lh3.googleusercontent.com/...",
     "provider": "google",
     "signup_method": "google",
     "profile_completed": true
   }
   ```

### Sync Existing Google Users

If you have existing Google users without profiles:

```bash
# Run the script again and choose 'y' when prompted
node scripts/setup-profiles-table.js
```

Or manually in Supabase SQL Editor:
```sql
SELECT sync_google_users();
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Google OAuth Profile Not Created
- ✅ Check console logs for "Processing Google OAuth user"
- ✅ Verify database triggers are installed
- ✅ Run: `node scripts/setup-profiles-table.js`
- ✅ Check profiles table exists with `provider` column

#### 2. Google User Data Missing
- ✅ Verify Google OAuth scopes include profile info
- ✅ Check user metadata in auth.users table
- ✅ Ensure triggers extract Google-specific fields (`name`, `picture`)

#### 3. Profile Creation Fails
- ✅ Check RLS policies allow inserts
- ✅ Verify user has proper permissions
- ✅ Check database connection and constraints

#### 4. Avatar Not Syncing
- ✅ Google provides `picture` field in metadata
- ✅ Check trigger maps `picture` to `avatar_url`
- ✅ Verify image URL is accessible

### Debug Console Logs

Enhanced logging for Google OAuth:

```javascript
// Look for these in browser console:
🔗 Auth callback triggered: { hasCode: true, error: null }
🔍 Provider detected: google
🌐 Processing Google OAuth user...
✅ Profile created for Google user
🚀 Redirecting Google user to profile completion

// Profile completion:
👤 Profile completion for user: { provider: "google", hasName: true }
🌐 Google user with basic info, skipping to interests
💾 Completing profile for user: user-uuid
✅ Profile saved to database
```

## 📚 Documentation References

- [Supabase Auth Overview](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [User Management](https://supabase.com/docs/guides/auth/managing-user-data)
- [Creating Users](https://supabase.com/docs/reference/javascript/auth-signup)

## 🎯 Google OAuth Specific Features

### 1. **Smart Profile Completion**
- Google users skip basic info collection
- Pre-fills name and avatar from Google
- Focuses on career interests and background

### 2. **Enhanced Data Extraction**
- Maps Google `name` → `full_name`
- Maps Google `picture` → `avatar_url`
- Tracks `provider` for analytics
- Syncs metadata changes automatically

### 3. **Automatic Profile Creation**
- Triggers create profiles for Google users
- Handles both new signups and existing users
- Provides manual sync function for migration

### 4. **Provider-Aware Logic**
- Different validation rules for Google vs email users
- Provider-specific redirect flows
- Enhanced error handling per provider

## 🎯 Next Steps

1. **Test Complete Flow**: Email + Google OAuth
2. **Verify Database**: Check profiles table population
3. **Customize UI**: Adjust profile completion steps
4. **Add More Providers**: Facebook, GitHub, etc.
5. **Production Setup**: Configure production URLs

---

✨ **Your Google OAuth integration is now complete!** Users can sign in with Google and automatically get profiles created in your database with their Google data synced. 🚀 