# Complete OAuth2 Setup Guide for Google Sheets Integration

## 🎯 Overview
This guide will help you set up OAuth2 authentication for full read/write access to Google Sheets.

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project name/ID

### 1.2 Enable Google Sheets API
1. In the Console, navigate to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

### 1.3 Create OAuth2 Credentials
1. Navigate to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have Google Workspace)
   - Fill in required fields:
     - App name: "Financial Tracker"
     - User support email: your email
     - Developer contact: your email
   - Save and continue through all steps
4. Back in Credentials, click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Configure:
   - **Name**: "Financial Tracker Web Client"
   - **Authorized JavaScript origins**: `http://localhost:5178`
   - **Authorized redirect URIs**: `http://localhost:5178` (same as origins)
7. Click **Create**
8. **IMPORTANT**: Copy the **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)

## 🔧 Step 2: Update Environment Variables

Update your `.env.local` file:

```bash
# OAuth2 Client ID from Google Cloud Console
VITE_GOOGLE_OAUTH_CLIENT_ID=123456789-abc123.apps.googleusercontent.com

# Your Google Sheets ID (from the URL)
VITE_GOOGLE_SHEETS_ID=1B-m1AoE8VO-vYlOnsT9IyuQAjyTqrCqV1cIjIWH_4zw
```

## 🔧 Step 3: Prepare Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Open your spreadsheet: `https://docs.google.com/spreadsheets/d/1B-m1AoE8VO-vYlOnsT9IyuQAjyTqrCqV1cIjIWH_4zw/edit`
3. **Make sure you have edit access** to this spreadsheet
4. The app will automatically add headers when you first sign in

## 🚀 Step 4: Test the Application

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to the new localhost URL (usually `http://localhost:5178/`)

3. You should see a "Sign in with Google" button

4. Click it and complete the OAuth flow:
   - Choose your Google account
   - Grant permissions to access Google Sheets
   - You'll be redirected back to the app

5. **Success!** You should now see:
   - "Connected to Google Sheets" indicator
   - Full CRUD functionality (Create, Read, Update, Delete)
   - Real-time sync with your Google Sheet

## ✅ What You Can Now Do

- **➕ Add transactions** - They appear instantly in Google Sheets
- **✏️ Edit transactions** - Changes sync to the sheet
- **🗑️ Delete transactions** - Removes rows from the sheet
- **📊 View analytics** - Real-time charts and summaries
- **🔄 Auto-refresh** - Data stays in sync
- **🔓 Sign out/in** - Manage your connection

## 🔍 Troubleshooting

### "OAuth2 Client ID not configured"
- Check your `.env.local` file has the correct Client ID
- Restart the development server after changing environment variables

### "Failed to initialize Google authentication"
- Make sure you're accessing the app via `http://localhost:5178` (exact URL matters)
- Check browser console for specific errors

### "Authentication failed"
- Verify the OAuth2 credentials are correctly configured
- Make sure the authorized origins match your localhost URL
- Try signing out and back in

### "Permission denied" when accessing sheets
- Ensure you have edit access to the Google Sheet
- Try creating a new sheet and updating the `VITE_GOOGLE_SHEETS_ID`

## 🎉 You're All Set!

Your financial tracker now has **full Google Sheets integration** with:
- ✅ Complete read/write access
- ✅ Real-time synchronization  
- ✅ Secure OAuth2 authentication
- ✅ Beautiful UI with instant feedback

Enjoy managing your finances with this powerful, cloud-connected app! 📊💰
