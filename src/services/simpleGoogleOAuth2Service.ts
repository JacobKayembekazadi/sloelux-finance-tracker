import { GoogleSheetsConfig } from './googleSheetsService';

export interface SimpleOAuth2Config {
  clientId: string;
  spreadsheetId: string;
}

export class SimpleGoogleOAuth2Service {
  private clientId: string;
  private spreadsheetId: string;
  private accessToken: string | null = null;

  constructor(config: SimpleOAuth2Config) {
    this.clientId = config.clientId;
    this.spreadsheetId = config.spreadsheetId;
    
    console.log('🔧 Simple OAuth2 Service initialized with:', {
      clientId: this.clientId ? `${this.clientId.substring(0, 20)}...` : 'MISSING',
      spreadsheetId: this.spreadsheetId || 'MISSING'
    });
  }

  // Simple OAuth2 flow using redirect method
  async authenticate(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check if we already have a token in URL hash (after redirect)
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const token = urlParams.get('access_token');
      
      if (token) {
        this.accessToken = token;
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('✅ OAuth2 token found in URL');
        resolve(token);
        return;
      }

      // If no token, redirect to Google OAuth
      const authUrl = this.buildAuthUrl();
      console.log('🔗 Redirecting to Google OAuth:', authUrl);
      window.location.href = authUrl;
      
      // This will never resolve because we're redirecting
      // The resolve will happen when user comes back with token
    });
  }

  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: window.location.origin + window.location.pathname,
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      include_granted_scopes: 'true',
      state: 'oauth_state_' + Math.random().toString(36).substring(2)
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Sign out user
  signOut(): void {
    this.accessToken = null;
    console.log('🔓 User signed out');
  }

  // Get configuration for GoogleSheetsService
  getGoogleSheetsConfig(): GoogleSheetsConfig {
    if (!this.accessToken) {
      throw new Error('User must be authenticated first');
    }

    return {
      accessToken: this.accessToken,
      spreadsheetId: this.spreadsheetId,
    };
  }

  // Check if we're returning from OAuth flow
  static hasOAuthToken(): boolean {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    return !!urlParams.get('access_token');
  }
}
