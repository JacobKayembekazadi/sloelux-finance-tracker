import { useState, useEffect, useCallback } from 'react';
import { GoogleSheetsService, TransactionRow } from '../services/googleSheetsService';
import { GOOGLE_SHEETS_CONFIG, validateConfig } from '../config/googleSheets';

export interface UseGoogleSheetsResult {
  transactions: TransactionRow[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<TransactionRow, 'id'>) => Promise<void>;
  updateTransaction: (transaction: TransactionRow) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  isConfigured: boolean;
  clearAllData: () => Promise<void>;
}

export const useGoogleSheets = (): UseGoogleSheetsResult => {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetsService, setSheetsService] = useState<GoogleSheetsService | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Initialize Google Sheets service
  useEffect(() => {
    try {
      validateConfig();
      const service = new GoogleSheetsService(GOOGLE_SHEETS_CONFIG);
      setSheetsService(service);
      setIsConfigured(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Configuration error');
      setIsConfigured(false);
    }
  }, []);

  // Generate unique ID for transactions
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Fetch all transactions
  const refreshTransactions = useCallback(async () => {
    if (!sheetsService) return;

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
  }, [sheetsService]);

  // Add new transaction
  const addTransaction = useCallback(async (transaction: Omit<TransactionRow, 'id'>) => {
    if (!sheetsService) {
      setError('Google Sheets service not initialized');
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
  }, [sheetsService, refreshTransactions]);

  // Update existing transaction
  const updateTransaction = useCallback(async (transaction: TransactionRow) => {
    if (!sheetsService) {
      setError('Google Sheets service not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sheetsService.updateTransaction(transaction);
      await refreshTransactions(); // Refresh to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  }, [sheetsService, refreshTransactions]);

  // Delete transaction
  const deleteTransaction = useCallback(async (transactionId: string) => {
    if (!sheetsService) {
      setError('Google Sheets service not initialized');
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
  }, [sheetsService, refreshTransactions]);

  // Clear all data (for testing)
  const clearAllData = useCallback(async () => {
    if (!sheetsService) {
      setError('Google Sheets service not initialized');
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
  }, [sheetsService, refreshTransactions]);

  // Initial data fetch
  useEffect(() => {
    if (sheetsService && isConfigured) {
      refreshTransactions();
    }
  }, [sheetsService, isConfigured, refreshTransactions]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    isConfigured,
    clearAllData,
  };
};
