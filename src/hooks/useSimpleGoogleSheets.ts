import { useState, useEffect, useCallback } from 'react';
import { GoogleSheetsService, TransactionRow } from '../services/googleSheetsService';
import { SimpleGoogleOAuth2Service } from '../services/simpleGoogleOAuth2Service';
import { GOOGLE_OAUTH2_CONFIG, validateConfig } from '../config/googleSheets';

export interface UseSimpleGoogleSheetsResult {
  transactions: TransactionRow[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  addTransaction: (transaction: Omit<TransactionRow, 'id'>) => Promise<void>;
  updateTransaction: (transaction: TransactionRow) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  isConfigured: boolean;
  clearAllData: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => void;
}

export const useSimpleGoogleSheets = (): UseSimpleGoogleSheetsResult => {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetsService, setSheetsService] = useState<GoogleSheetsService | null>(null);
  const [oauthService, setOauthService] = useState<SimpleGoogleOAuth2Service | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize OAuth2 service
  useEffect(() => {
    try {
      validateConfig();
      const oauth = new SimpleGoogleOAuth2Service(GOOGLE_OAUTH2_CONFIG);
      setOauthService(oauth);
      setIsConfigured(true);
      setError(null);

      // Check if we're returning from OAuth flow
      if (SimpleGoogleOAuth2Service.hasOAuthToken()) {
        console.log('🔄 Detected OAuth return, processing token...');
        oauth.authenticate().then(() => {
          const sheetsConfig = oauth.getGoogleSheetsConfig();
          const sheets = new GoogleSheetsService(sheetsConfig);
          setSheetsService(sheets);
          setIsAuthenticated(true);
          console.log('✅ Auto-signed in from OAuth return');
          // Initialize spreadsheet
          sheets.initializeSpreadsheet().catch(console.error);
        }).catch((err: Error) => {
          console.error('Failed to process OAuth token:', err);
          setError('Failed to complete authentication');
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Configuration error');
      setIsConfigured(false);
    }
  }, []);

  // Generate unique ID for transactions
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Sign in user
  const signIn = useCallback(async () => {
    if (!oauthService) {
      setError('OAuth2 service not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This will redirect to Google
      await oauthService.authenticate();
      // Note: This code won't execute because authenticate() redirects
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      setLoading(false);
    }
  }, [oauthService]);

  // Sign out user
  const signOut = useCallback(() => {
    if (oauthService) {
      oauthService.signOut();
    }
    setSheetsService(null);
    setIsAuthenticated(false);
    setTransactions([]);
    setError(null);
  }, [oauthService]);

  // Fetch all transactions
  const refreshTransactions = useCallback(async () => {
    if (!sheetsService || !isAuthenticated) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await sheetsService.getAllTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [sheetsService, isAuthenticated]);

  // Add new transaction
  const addTransaction = useCallback(async (transaction: Omit<TransactionRow, 'id'>) => {
    if (!sheetsService || !isAuthenticated) {
      setError('Please sign in to Google Sheets first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newTransaction: TransactionRow = {
        ...transaction,
        id: generateId(),
      };

      await sheetsService.addTransaction(newTransaction);
      await refreshTransactions(); // Refresh to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  }, [sheetsService, isAuthenticated, refreshTransactions]);

  // Update existing transaction
  const updateTransaction = useCallback(async (transaction: TransactionRow) => {
    if (!sheetsService || !isAuthenticated) {
      setError('Please sign in to Google Sheets first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sheetsService.updateTransaction(transaction.id, transaction);
      await refreshTransactions(); // Refresh to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  }, [sheetsService, isAuthenticated, refreshTransactions]);

  // Delete transaction
  const deleteTransaction = useCallback(async (transactionId: string) => {
    if (!sheetsService || !isAuthenticated) {
      setError('Please sign in to Google Sheets first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sheetsService.deleteTransaction(transactionId);
      await refreshTransactions(); // Refresh to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  }, [sheetsService, isAuthenticated, refreshTransactions]);

  // Clear all data (for testing)
  const clearAllData = useCallback(async () => {
    if (!sheetsService || !isAuthenticated) {
      setError('Please sign in to Google Sheets first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sheetsService.clearAllData();
      await refreshTransactions(); // Refresh to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    } finally {
      setLoading(false);
    }
  }, [sheetsService, isAuthenticated, refreshTransactions]);

  // Auto-refresh data when user signs in
  useEffect(() => {
    if (sheetsService && isAuthenticated) {
      refreshTransactions();
    }
  }, [sheetsService, isAuthenticated, refreshTransactions]);

  return {
    transactions,
    loading,
    error,
    isAuthenticated,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    isConfigured,
    clearAllData,
    signIn,
    signOut,
  };
};
