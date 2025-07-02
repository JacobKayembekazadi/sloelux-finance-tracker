// Google Sheets OAuth2 Configuration
// You'll need to replace these values with your own

export const GOOGLE_OAUTH2_CONFIG = {
  // Get this from Google Cloud Console after creating OAuth2 credentials
  clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || 'YOUR_OAUTH_CLIENT_ID_HERE',
  
  // Get this from your Google Sheets URL
  // Example: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
  // The spreadsheet ID is: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
  spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID || 'YOUR_SPREADSHEET_ID_HERE',
};

// For development, you can also hardcode these values temporarily
// Remember to never commit real API keys to version control!

export const isDevelopment = import.meta.env.DEV;

// Validation function to check if OAuth2 configuration is properly set
export const validateConfig = () => {
  const { clientId, spreadsheetId } = GOOGLE_OAUTH2_CONFIG;
  
  // Debug logging
  console.log('🔧 Google OAuth2 Configuration Debug:');
  console.log('Client ID available:', !!clientId && clientId !== 'YOUR_OAUTH_CLIENT_ID_HERE');
  console.log('Spreadsheet ID available:', !!spreadsheetId && spreadsheetId !== 'YOUR_SPREADSHEET_ID_HERE');
  
  if (clientId === 'YOUR_OAUTH_CLIENT_ID_HERE' || !clientId) {
    throw new Error('Google OAuth2 Client ID is not configured. Please set VITE_GOOGLE_OAUTH_CLIENT_ID environment variable.');
  }
  
  if (spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE' || !spreadsheetId) {
    throw new Error('Google Sheets ID is not configured. Please set VITE_GOOGLE_SHEETS_ID environment variable.');
  }
  
  console.log('✅ Google OAuth2 configuration is valid');
  return true;
};
