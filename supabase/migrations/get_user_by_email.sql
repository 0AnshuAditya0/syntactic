-- Function to look up user ID by email securely (for API use)
-- This function accesses auth.users, so it must be SECURITY DEFINER
-- and revoked from public access, only allowed for service_role.

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email_input TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_user_id UUID;
BEGIN
  SELECT id INTO found_user_id
  FROM auth.users
  WHERE email = email_input;
  
  RETURN found_user_id;
END;
$$;

-- Revoke execute from everyone
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) FROM authenticated;

-- Grant execute to service_role only
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) TO service_role;
