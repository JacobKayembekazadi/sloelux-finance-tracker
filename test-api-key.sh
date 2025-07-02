#!/bin/bash

# Google Sheets API Key Test Script
# This script helps you verify your API key is working

echo "🔧 Google Sheets API Key Tester"
echo "================================"

# Check if environment variables are set
if [ -f ".env.local" ]; then
    echo "✅ Found .env.local file"
    
    # Source the environment file
    source .env.local
    
    # Check API key format
    if [[ $VITE_GOOGLE_SHEETS_API_KEY == AIzaSy* ]]; then
        echo "✅ API key format looks correct (starts with AIzaSy)"
        API_KEY=$VITE_GOOGLE_SHEETS_API_KEY
    else
        echo "❌ API key format is wrong. Should start with 'AIzaSy'"
        echo "   Current: $VITE_GOOGLE_SHEETS_API_KEY"
        exit 1
    fi
    
    # Check spreadsheet ID format
    if [[ $VITE_GOOGLE_SHEETS_ID =~ ^[a-zA-Z0-9_-]{44}$ ]]; then
        echo "✅ Spreadsheet ID format looks correct"
        SHEET_ID=$VITE_GOOGLE_SHEETS_ID
    else
        echo "❌ Spreadsheet ID format is wrong"
        echo "   Current: $VITE_GOOGLE_SHEETS_ID"
        echo "   Should be: Long alphanumeric string like '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'"
        exit 1
    fi
    
else
    echo "❌ No .env.local file found"
    exit 1
fi

echo ""
echo "🧪 Testing API Key..."

# Test API key by making a request to Google Sheets API
curl -s "https://sheets.googleapis.com/v4/spreadsheets/$SHEET_ID?key=$API_KEY" | jq . > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ API key is working!"
    echo "✅ Spreadsheet is accessible!"
    echo ""
    echo "🎉 Your Google Sheets integration should work now!"
else
    echo "❌ API key test failed"
    echo ""
    echo "Possible issues:"
    echo "1. API key is invalid"
    echo "2. Google Sheets API is not enabled"
    echo "3. Spreadsheet is not publicly accessible"
    echo "4. Spreadsheet ID is wrong"
fi
