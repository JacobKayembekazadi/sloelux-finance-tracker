/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string
  readonly VITE_GOOGLE_SHEETS_ID: string
  readonly VITE_GOOGLE_SHEETS_API_KEY?: string // Legacy, for reference
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Google OAuth2 types
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}
