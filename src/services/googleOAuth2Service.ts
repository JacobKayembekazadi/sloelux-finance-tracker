import { GoogleSheetsConfig } from './googleSheetsService';

export interface OAuth2Config {
  clientId: string;
  spreadsheetId: string;
}

export class GoogleOAuth2Service {
  private clientId: string;
  private spreadsheetId: string;
  private accessToken: string | null = null;
  private tokenClient: any = null;
  private isInitialized = false;

  constructor(config: OAuth2Config) {
    this.clientId = config.clientId;
    this.spreadsheetId = config.spreadsheetId;
    
    console.log('🔧 OAuth2 Service initialized with:', {
      clientId: this.clientId ? `${this.clientId.substring(0, 20)}...` : 'MISSING',
      spreadsheetId: this.spreadsheetId || 'MISSING'
    });
  }

  // Initialize the Google OAuth2 client
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load Google OAuth2 library
    await this.loadGoogleOAuth2Library();

  // Initialize token client
    this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      callback: (response: any) => {
        if (response.error) {
          console.error('OAuth2 error:', response.error);
          throw new Error(`Authentication failed: ${response.error}`);
        }
        this.accessToken = response.access_token;
        console.log('✅ OAuth2 authentication successful');
      },
    });

    this.isInitialized = true;
    console.log('🔧 Google OAuth2 client initialized');
  }

  // Load Google OAuth2 library dynamically
  private loadGoogleOAuth2Library(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.accounts?.oauth2) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        // Wait a bit for the library to fully initialize
        setTimeout(resolve, 100);
      };
      script.onerror = () => reject(new Error('Failed to load Google OAuth2 library'));
      document.head.appendChild(script);
    });
  }

  // Request user authentication
  async authenticate(): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (this.accessToken) {
        resolve(this.accessToken);
        return;
      }

      // Update callback to resolve/reject the promise
      this.tokenClient.callback = (response: { access_token: string; error?: string }) => {
        if (response.error) {
          reject(new Error(`Authentication failed: ${response.error}`));
        } else {
          this.accessToken = response.access_token;
          resolve(response.access_token);
        }
      };

      // Request access token
      this.tokenClient.requestAccessToken();
    });
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
}
