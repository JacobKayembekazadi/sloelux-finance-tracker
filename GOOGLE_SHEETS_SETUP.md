# 🔧 Google Sheets Integration Setup Guide

## ⚠️ Current Configuration Issues

Your current `.env.local` contains OAuth client credentials instead of API keys. Here's how to fix it:

## 🛠️ Step-by-Step Fix

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select/Create Project**:
   - If you have a project: Select it from the dropdown
   - If not: Click "New Project" → Name it "Finance Tracker"

### 2. Enable Google Sheets API

1. **Navigate to APIs & Services**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "**Enable**"

### 3. Create API Key (NOT OAuth Client)

1. **Go to Credentials**:
   - Navigate to "APIs & Services" → "Credentials"
   - Click "**Create Credentials**"
   - Select "**API Key**" (NOT OAuth 2.0 Client ID)

2. **Copy the API Key**:
   - The key should start with `AIzaSy...`
   - Copy it immediately

3. **Restrict the API Key** (Security):
   - Click on your new API key to edit it
   - Under "API restrictions" → Select "Restrict key"
   - Choose "Google Sheets API" from the list
   - Click "Save"

### 4. Create Google Spreadsheet

1. **Create New Sheet**:
   - Go to https://sheets.google.com
   - Click "Blank" to create new spreadsheet
   - Rename to "Finance Tracker Database"

2. **Configure Sharing**:
   - Click "Share" button (top-right)
   - Click "Change to anyone with the link"
   - Set permission to "**Viewer**"
   - Click "Done"

3. **Extract Spreadsheet ID**:
   - Copy the long ID from the URL
   - Example URL: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - The ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 5. Update Environment Variables

Edit your `.env.local` file:

```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSy_YOUR_ACTUAL_API_KEY_HERE
VITE_GOOGLE_SHEETS_ID=YOUR_ACTUAL_SPREADSHEET_ID_HERE
```

### 6. Test the Integration

1. **Restart Development Server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Open Application**:
   - Go to http://localhost:5174 (or the port shown)
   - You should see the setup screen if config is missing
   - Or the main dashboard if everything is configured

### 7. Verify Functionality

- ✅ **Add a test sale**: Click "Record a Sale"
- ✅ **Check Google Sheet**: Verify data appears in your spreadsheet
- ✅ **Add an expense**: Test expense recording
- ✅ **Refresh data**: Use the refresh button to sync

## 🚨 Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|----------|------------|
| OAuth Client ID (`GOCSPX-...`) | API Key (`AIzaSy...`) |
| Client ID as Spreadsheet ID | Actual spreadsheet ID from URL |
| Private spreadsheet | Public "Anyone with link" access |
| OAuth 2.0 credentials | Simple API Key |

## 🔍 Troubleshooting

### "Configuration Error"
- Check `.env.local` exists and has correct variables
- Verify API key format starts with `AIzaSy`
- Confirm spreadsheet ID is alphanumeric string

### "Failed to fetch transactions"
- Verify Google Sheet is publicly accessible
- Check Google Sheets API is enabled
- Test API key in Google Cloud Console

### "403 Permission denied"
- Ensure spreadsheet sharing is "Anyone with link can view"
- Verify API key has Google Sheets API access
- Check API key restrictions are correct

## 🎯 Success Indicators

When everything works correctly, you should see:
- ✅ Application loads without configuration errors
- ✅ You can add sales and expenses
- ✅ Data appears in your Google Sheet immediately
- ✅ Dashboard shows real-time analytics
- ✅ No console errors in browser developer tools

## 🔗 Quick Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Sheets](https://sheets.google.com/)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Application Local URL](http://localhost:5174)
