# Supabase Setup for StatTrack AK47

This guide will help you set up the Supabase backend for the StatTrack AK47 application.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Choose a name for your project and set a secure database password
4. Select a region close to your users
5. Wait for your database to be provisioned (this may take a few minutes)

## 2. Set Up the Database Schema

1. In your Supabase project, navigate to the SQL Editor
2. Create a new query
3. Copy the contents of the `supabase-schema.sql` file in this project
4. Run the query to create all tables, functions, and policies

## 3. Configure Authentication

1. Go to Authentication → Settings
2. Enable Email auth provider (or any other providers you want to use)
3. Configure any additional settings like redirect URLs, etc.

## 4. Get API Keys and URL

1. Go to Settings → API
2. Copy the following values:
   - Project URL (e.g., `https://your-project-id.supabase.co`)
   - anon/public API key

## 5. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace the placeholders with your actual Supabase URL and anon key.

## 6. Set Up RLS (Row Level Security)

The schema file already includes basic RLS policies, but you might want to customize them based on your specific security requirements:

- Public read access to leaderboards and actions
- Users can only create actions for themselves
- Admin-only access for reset operations (you may need to modify this)

## 7. Testing the Setup

1. Start your application with `npm run dev`
2. If everything is set up correctly, you should be able to:
   - View the leaderboard (empty initially)
   - Create new actions (if you're authenticated)
   - See the monthly reset timer

## Supabase Schema Details

### Tables

1. **users** - Stores user information and stats

   - id (UUID, PK)
   - username (text)
   - total_points (integer)
   - action_count (integer)
   - created_at (timestamp)

2. **actions** - Stores each action/contribution

   - id (UUID, PK)
   - user_id (UUID, FK to users)
   - username (text)
   - type (text)
   - points (integer)
   - description (text)
   - created_at (timestamp)

3. **reset_history** - Tracks monthly resets
   - id (UUID, PK)
   - reset_date (timestamp)
   - created_at (timestamp)

### Database Functions

1. **increment_user_stats** - Updates a user's points and action count
2. **reset_monthly_stats** - Resets all users' monthly stats to zero
3. **handle_new_user** - Creates a user profile when a new user signs up

## Additional Notes

- The database is set up to automatically create a user profile when someone signs up through Supabase Auth
- Monthly resets need to be triggered manually or via a cron job using the `/api/reset` endpoint
- You may want to add additional tables or fields based on your specific requirements
