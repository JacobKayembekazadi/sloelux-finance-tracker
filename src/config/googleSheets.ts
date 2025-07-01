// Google Sheets Configuration
// You'll need to replace these values with your own

export const GOOGLE_SHEETS_CONFIG = {
  // Get this from Google Cloud Console after enabling Google Sheets API
  apiKey: process.env.VITE_GOOGLE_SHEETS_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE',
  
  // Get this from your Google Sheets URL
  // Example: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
  // The spreadsheet ID is: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
  spreadsheetId: process.env.VITE_GOOGLE_SHEETS_ID || 'YOUR_SPREADSHEET_ID_HERE',
};

// For development, you can also hardcode these values temporarily
// Remember to never commit real API keys to version control!

export const isDevelopment = import.meta.env.DEV;

// Validation function to check if configuration is properly set
export const validateConfig = () => {
  const { apiKey, spreadsheetId } = GOOGLE_SHEETS_CONFIG;
  
  if (apiKey === 'YOUR_GOOGLE_API_KEY_HERE' || !apiKey) {
    throw new Error('Google Sheets API key is not configured. Please set VITE_GOOGLE_SHEETS_API_KEY environment variable.');
  }
  
  if (spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE' || !spreadsheetId) {
    throw new Error('Google Sheets ID is not configured. Please set VITE_GOOGLE_SHEETS_ID environment variable.');
  }
  
  return true;
};
