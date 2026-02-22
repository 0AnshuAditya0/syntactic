-- Migration: Auto-create Profile on Signup
-- Description: Adds a trigger to auth.users to automatically create a public.profiles entry 
-- and default user_preferences when a new user signs up via OAuth or Email.

-- 1. Create the function that will handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_username TEXT;
    base_username TEXT;
    iter INTEGER := 0;
BEGIN
    -- Extract username from metadata (Google/GitHub) or email
    base_username := COALESCE(
        NEW.raw_user_meta_data->>'preferred_username',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );
    
    -- Clean username (letters, numbers, underscores only)
    base_username := regexp_replace(LOWER(base_username), '[^a-z0-9_]', '', 'g');
    
    -- Ensure minimum length
    IF length(base_username) < 3 THEN
        base_username := base_username || 'user';
    END IF;

    -- Handle potential duplicates
    new_username := base_username;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username) LOOP
        iter := iter + 1;
        new_username := base_username || iter;
    END LOOP;

    -- Insert into public.profiles
    INSERT INTO public.profiles (
        id,
        username,
        display_name,
        avatar_url,
        private_key_hash
    )
    VALUES (
        NEW.id,
        new_username,
        COALESCE(NEW.raw_user_meta_data->>'full_name', new_username),
        NEW.raw_user_meta_data->>'avatar_url',
        'TEMP_KEY_' || NEW.id -- Must be unique due to DB constraints
    );

    -- Insert default preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Also fix the existing profiles that might be missing preferences
INSERT INTO public.user_preferences (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
