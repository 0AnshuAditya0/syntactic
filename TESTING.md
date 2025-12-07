# Testing Syntactic Authentication

## ✅ Prerequisites Checklist

Before testing, make sure you have:

1. **Database Schema Installed**
   - ✅ Ran `database-schema.sql` in Supabase SQL Editor
   - ✅ All 15 tables created
   - ✅ RLS policies enabled

2. **Environment Variables Set** (`.env.local`)
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # IMPORTANT!
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Dev Server Running**
   ```bash
   npm run dev
   ```

## 🧪 Test Signup Flow

### Step 1: Open Signup Page
Navigate to: http://localhost:3000/auth/signup

### Step 2: Fill in the Form
- **Username**: testuser (3-30 chars, alphanumeric, hyphens, underscores)
- **Email**: test@example.com
- **Password**: testpass123 (min 8 chars)
- **Confirm Password**: testpass123
- **Recovery Email**: (optional) recovery@example.com

### Step 3: Submit
Click "Create Account"

### Expected Result:
✅ Account created successfully
✅ Private key displayed (32 characters)
✅ Options to copy or download key
✅ Confirmation checkbox appears

### Step 4: Save Private Key
- Copy the key or download the text file
- Check the confirmation box
- Click "Continue to Syntactic"

### Expected Result:
✅ Redirected to /playground

## 🔄 Test Sync Login

### Step 1: Open Sync Login Page
Navigate to: http://localhost:3000/auth/sync-login

### Step 2: Enter Credentials
- **Username**: testuser
- **Private Key**: (paste the 32-char key you saved)

### Step 3: Submit
Click "Sync Login"

### Expected Result:
✅ Logged in instantly (no email check)
✅ Redirected to /playground
✅ Session created successfully

## 🐛 Troubleshooting

### Error: "Failed to create profile"

**Cause**: Service role key not set or RLS blocking insert

**Fix**:
1. Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
2. Restart dev server: `npm run dev`
3. Verify service role key in Supabase Dashboard > Settings > API

### Error: "Username already taken"

**Cause**: Username exists in database

**Fix**:
1. Try a different username
2. Or delete from Supabase: 
   ```sql
   DELETE FROM auth.users WHERE email = 'test@example.com';
   ```

### Error: "Invalid username or private key" (Sync Login)

**Cause**: Wrong username or key

**Fix**:
1. Double-check username (case-sensitive)
2. Ensure you copied the full 32-character key
3. Remove any spaces or dashes

### Page Not Loading

**Cause**: Dev server not running or crashed

**Fix**:
1. Check terminal for errors
2. Restart: `Ctrl+C` then `npm run dev`
3. Clear browser cache

## 📊 Verify in Supabase

After successful signup, check in Supabase Dashboard:

1. **Authentication > Users**
   - Should see new user with email

2. **Table Editor > profiles**
   - Should see profile with username and private_key_hash

3. **Table Editor > user_preferences**
   - Should see preferences row (created by trigger)

## 🎯 Next Steps After Testing

Once signup and sync login work:

1. ✅ Test cross-device login (different browser)
2. ✅ Build standard email/password login
3. ✅ Add "Forgot Private Key?" recovery flow
4. ✅ Move to Phase 3: User Profiles & Settings

---

**Need Help?** Check the terminal logs for detailed error messages!
