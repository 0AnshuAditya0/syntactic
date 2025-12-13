-- AUTH SYSTEM REDESIGN
-- Run this in Supabase SQL Editor

-- 1. Create separate table for private keys (migrating from profiles if needed)
CREATE TABLE IF NOT EXISTS public.private_key_hash (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id)
);

-- 2. Temporary Sessions for Public Device Login
CREATE TABLE IF NOT EXISTS public.temporary_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  device_info JSONB,
  ip_address INET,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 3. Auth Logs for Audit Trail
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'login_oauth', 'login_key', 'signup', 'logout', 'failed_attempt'
  status TEXT NOT NULL, -- 'success', 'failure'
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_temp_sessions_user_id ON public.temporary_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_temp_sessions_token ON public.temporary_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_temp_sessions_expires ON public.temporary_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON public.auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON public.auth_logs(created_at DESC);

-- RLS Policies

-- Private Keys: No public access, only server-side (service role) can read/write usually
-- But if we want RLS:
ALTER TABLE public.private_key_hash ENABLE ROW LEVEL SECURITY;
-- Only allow users to manage their own key? No, usage is mostly server-side for validation.
-- Let's allow users to read their own key metadata (not hash) if needed, but hash is sensitive.
-- Actually, the server (API route) handles validation using Service Role usually.
-- So we can restrict everything to service_role only for safety.
CREATE POLICY "Service role only for private keys" ON public.private_key_hash FOR ALL USING (auth.role() = 'service_role');

-- Temporary Sessions:
ALTER TABLE public.temporary_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own active sessions" ON public.temporary_sessions FOR SELECT USING (auth.uid() = user_id);
-- Server manages insertion/deletion mainly.

-- Auth Logs:
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own logs" ON public.auth_logs FOR SELECT USING (auth.uid() = user_id);

-- Cleanup Cron (Optional, needs pg_cron)
-- SELECT cron.schedule(
--   'cleanup-temp-sessions',
--   '*/15 * * * *', -- Every 15 mins
--   $$ DELETE FROM public.temporary_sessions WHERE expires_at < NOW() $$
-- );
