import React from 'react';
import { useSimpleGoogleSheets } from '../hooks/useSimpleGoogleSheets';
import { AlertCircle, CheckCircle, Loader2, Settings, LogIn, LogOut } from 'lucide-react';

interface GoogleSheetsManagerProps {
  children: (props: {
    transactions: any[];
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    addTransaction: (transaction: any) => Promise<void>;
    updateTransaction: (transaction: any) => Promise<void>;
    deleteTransaction: (transactionId: string) => Promise<void>;
    refreshTransactions: () => Promise<void>;
    clearAllData: () => Promise<void>;
    signIn: () => Promise<void>;
    signOut: () => void;
  }) => React.ReactNode;
}

const GoogleSheetsManager: React.FC<GoogleSheetsManagerProps> = ({ children }) => {
  const googleSheets = useSimpleGoogleSheets();

  // If not configured, show setup instructions
  if (!googleSheets.isConfigured) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <AlertCircle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Google OAuth2 Setup Required</h2>
            <p className="text-gray-600">To use Google Sheets with full read/write access, you need to configure OAuth2 credentials.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Step 1: Create OAuth2 Credentials</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                <li>Create a new project or select an existing one</li>
                <li>Enable the Google Sheets API</li>
                <li>Go to Credentials → Create Credentials → OAuth 2.0 Client IDs</li>
                <li>Set Application type to "Web application"</li>
                <li>Add http://localhost:5178 to "Authorized JavaScript origins"</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Step 2: Configure Environment Variables</h3>
              <p className="text-sm text-gray-600 mb-2">Update your <code className="bg-gray-200 px-1 rounded">.env.local</code> file:</p>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`VITE_GOOGLE_OAUTH_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id_here`}
              </pre>
            </div>

            <div className="text-center">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings className="inline mr-2" size={16} />
                Reload After Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If configured but not authenticated, show sign-in
  if (googleSheets.isConfigured && !googleSheets.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Connect</h2>
          <p className="text-gray-600 mb-6">Sign in with your Google account to access your spreadsheet with full read/write capabilities.</p>
          
          <button 
            onClick={googleSheets.signIn}
            disabled={googleSheets.loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center mx-auto"
          >
            {googleSheets.loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <LogIn className="mr-2" size={20} />
            )}
            {googleSheets.loading ? 'Connecting...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children(googleSheets)}
      
      {/* Authentication status bar */}
      {googleSheets.isAuthenticated && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <CheckCircle size={20} />
          <span className="text-sm">Connected to Google Sheets</span>
          <button 
            onClick={googleSheets.signOut}
            className="ml-2 text-white hover:text-gray-200"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
      
      {/* Global loading overlay */}
      {googleSheets.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <span className="text-gray-800">Syncing with Google Sheets...</span>
          </div>
        </div>
      )}

      {/* Error notification */}
      {googleSheets.error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-start space-x-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{googleSheets.error}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleSheetsManager;
