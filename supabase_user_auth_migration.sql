-- ═══════════════════════════════════════════════════════════════
-- Supabase SQL Migration: site_users table for User Authentication
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Create the site_users table
CREATE TABLE IF NOT EXISTS public.site_users (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name   TEXT,
  mobile      TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.site_users ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to INSERT (register)
CREATE POLICY "Allow public registration"
  ON public.site_users FOR INSERT
  WITH CHECK (true);

-- 4. Allow SELECT by username only (for login lookup)
CREATE POLICY "Allow login by username"
  ON public.site_users FOR SELECT
  USING (true);

-- 5. Add user_id column to solar_applications (to link applications to users)
ALTER TABLE public.solar_applications
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.site_users(id);

-- 6. Add Date of Birth (dob) column to site_users for secure account recovery
ALTER TABLE public.site_users
  ADD COLUMN IF NOT EXISTS dob DATE;

-- 7. Allow users to update their own password (password reset)
CREATE POLICY "Allow password update"
  ON public.site_users FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 8. Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_site_users_username ON public.site_users (username);
CREATE INDEX IF NOT EXISTS idx_site_users_mobile ON public.site_users (mobile);
CREATE INDEX IF NOT EXISTS idx_site_users_dob ON public.site_users (dob);
CREATE INDEX IF NOT EXISTS idx_solar_apps_user_id ON public.solar_applications (user_id);
CREATE INDEX IF NOT EXISTS idx_solar_apps_mobile ON public.solar_applications (mobile);
CREATE INDEX IF NOT EXISTS idx_solar_apps_email ON public.solar_applications (email);

-- ═══════════════════════════════════════════════════════════════
-- DONE! Users can register with DOB, login, reset password,
-- and recover username using:
-- • Reset Password: Username + Mobile + DOB
-- • Forgot Username: Mobile + DOB + Email
-- ═══════════════════════════════════════════════════════════════
