# Supabase Authentication Setup Guide

## 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: CityForge Mumbai Pulse
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" 
4. Copy the following:
   - **Project URL** (looks like: `https://xyzcompany.supabase.co`)
   - **Project API Key** (anon public key)

## 3. Configure Environment Variables

1. Open `frontend/.env.local`
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Install Dependencies

Run this command in the frontend directory:

```bash
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

## 5. Configure Authentication

The authentication is already set up with the following features:

### Email/Password Authentication
- Users can sign up with email and password
- Email verification is enabled by default
- Password reset functionality

### User Profiles
- First name, last name, phone number stored in user metadata
- Full name displayed in header dropdown

### Authentication Flow
- **Sign Up**: Creates account → Email verification → Login
- **Sign In**: Email/password → Dashboard redirect
- **Sign Out**: Clears session → Returns to login

## 6. Supabase Dashboard Configuration

### Enable Email Authentication
1. Go to Authentication → Settings
2. Enable "Enable email confirmations"
3. Configure email templates if needed

### Set Site URL
1. Go to Authentication → Settings
2. Set Site URL to: `http://localhost:3000` (development)
3. Add production URL when deploying

### Configure Redirect URLs
Add these URLs to "Redirect URLs":
- `http://localhost:3000/dashboard`
- `http://localhost:3000/login`
- Your production URLs

## 7. Database Schema (Optional)

If you want to store additional user profile data:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  updated_at timestamp with time zone,
  primary key (id)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policy
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);
```

## 8. Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/signup` and create a test account
3. Check your email for verification link
4. Try logging in at `/login`
5. Verify user info appears in header dropdown
6. Test sign out functionality

## Features Implemented

✅ **User Registration** - Full signup form with validation
✅ **User Login** - Email/password authentication  
✅ **User Profile** - Name and metadata storage
✅ **Session Management** - Persistent login sessions
✅ **Protected Routes** - Authentication state management
✅ **User Interface** - Dynamic header showing user info
✅ **Error Handling** - Proper error messages and validation
✅ **Loading States** - UI feedback during auth operations

## Troubleshooting

### Common Issues

1. **"Invalid API key"** - Check your environment variables
2. **"Site URL not allowed"** - Add your URL to Supabase settings
3. **Email not sending** - Check email settings in Supabase dashboard
4. **CORS errors** - Verify your site URL configuration

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Check Supabase dashboard logs
4. Test with a simple email/password combination

The authentication system is now ready for production use!
