# 🚀 Quick Fix: Get Google Sheets Working in 5 Minutes

## Step 1: Get API Key (2 minutes)

1. **Open**: https://console.cloud.google.com/apis/credentials
2. **Click**: "Create Credentials" → "API Key"
3. **Copy**: The key (starts with `AIzaSy`)
4. **Click**: Edit → API restrictions → Google Sheets API → Save

## Step 2: Get Spreadsheet ID (1 minute)

1. **Open**: https://sheets.google.com
2. **Create**: New blank spreadsheet
3. **Share**: Anyone with link can view
4. **Copy**: ID from URL (`1BxiMVs...` part)

## Step 3: Update Config (30 seconds)

Edit `.env.local`:
```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSy_YOUR_REAL_KEY_HERE
VITE_GOOGLE_SHEETS_ID=YOUR_REAL_SPREADSHEET_ID_HERE
```

## Step 4: Test (1 minute)

```bash
npm run dev
# Open http://localhost:5174
# Try adding a sale/expense
```

## ✅ Success Indicators

- No "Configuration Error" message
- Can add transactions
- Data appears in Google Sheet
- Dashboard shows analytics

## 🆚 Why Not Use Server-Side JWT?

Your server-side code would require:
- ❌ Backend server (Node.js/Express)
- ❌ Service account setup
- ❌ Additional hosting costs
- ❌ More complex deployment

Your current client-side approach:
- ✅ No server needed
- ✅ Direct browser-to-Google communication
- ✅ Simpler deployment (static hosting)
- ✅ Perfect for single-user business app

## 🔧 If You Want Server-Side Later

I can help you convert to server-side JWT authentication if you need:
- Multi-user support
- Enhanced security
- API rate limiting
- Additional business logic

But for a personal finance tracker, your current approach is ideal!
