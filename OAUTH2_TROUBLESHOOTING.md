# 🔧 OAuth2 Troubleshooting Guide

## Error: "The OAuth client was not found" (Error 401: invalid_client)

This error means your OAuth2 configuration in Google Cloud Console needs to be set up correctly.

## 🎯 Step-by-Step Fix:

### Step 1: Verify Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create a new one)
3. **Enable Google Sheets API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click it and press "Enable"

### Step 2: Create/Fix OAuth2 Credentials

1. **Go to Credentials**:
   - Navigate to "APIs & Services" → "Credentials"
   
2. **Configure OAuth Consent Screen** (if not done):
   - Click "OAuth consent screen" tab
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Financial Tracker"
     - User support email: your email
     - Developer contact: your email
   - Save and continue through all steps
   - **Important**: Add your email as a test user in "Test users" section

3. **Create OAuth2 Client ID**:
   - Go back to "Credentials" tab
   - Click "+ CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
   - Application type: **Web application**
   - Name: "Financial Tracker Web Client"
   
4. **Configure URLs** (THIS IS CRITICAL):
   - **Authorized JavaScript origins**: 
     ```
     http://localhost:5179
     ```
   - **Authorized redirect URIs**: 
     ```
     http://localhost:5179
     ```
   - Click "Create"

5. **Copy the Client ID**:
   - It should look like: `676214852253-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`

### Step 3: Double-Check Your Environment Variables

Your `.env.local` file should have:
```bash
VITE_GOOGLE_OAUTH_CLIENT_ID=676214852253-8jnkm8t5ie3qmhb595so0aiu2o0u6jo6.apps.googleusercontent.com
VITE_GOOGLE_SHEETS_ID=1B-m1AoE8VO-vYlOnsT9IyuQAjyTqrCqV1cIjIWH_4zw
```

### Step 4: Test the Fix

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Open**: http://localhost:5179/

3. **Click "Sign in with Google"**

4. **You should see**: Google's OAuth consent screen asking for permission

## 🚨 Common Issues:

### Issue 1: Wrong URL in Google Cloud Console
- **Problem**: URLs don't match exactly
- **Solution**: Make sure authorized origins is exactly `http://localhost:5179`

### Issue 2: OAuth Consent Screen Not Configured
- **Problem**: App not set up in OAuth consent screen
- **Solution**: Complete the OAuth consent screen setup first

### Issue 3: Test User Not Added
- **Problem**: Your email not added as test user
- **Solution**: Add your email in OAuth consent screen → Test users

### Issue 4: Client ID Copied Incorrectly
- **Problem**: Wrong client ID format or missing characters
- **Solution**: Copy the full client ID from Google Cloud Console

## 🔍 Quick Debug Steps:

1. **Check browser console** for any additional error messages
2. **Verify the exact URL** you're accessing matches the authorized origins
3. **Make sure Google Sheets API is enabled** in your project
4. **Try creating a fresh OAuth2 client ID** if the current one isn't working

After following these steps, your OAuth2 authentication should work perfectly! 🎉
