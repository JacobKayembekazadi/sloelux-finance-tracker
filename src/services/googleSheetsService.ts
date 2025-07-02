export interface GoogleSheetsConfig {
  accessToken: string;
  spreadsheetId: string;
}

export interface TransactionRow {
  id: string;
  date: string;
  amount: number;
  type: 'sale' | 'expense';
  quantity?: number;
  description: string;
}

export class GoogleSheetsService {
  private accessToken: string;
  private spreadsheetId: string;
  private baseUrl: string;

  constructor(config: GoogleSheetsConfig) {
    console.log('🔧 GoogleSheetsService constructor called with:', {
      accessToken: config.accessToken ? `${config.accessToken.substring(0, 10)}...` : 'MISSING',
      spreadsheetId: config.spreadsheetId || 'MISSING'
    });
    
    this.accessToken = config.accessToken;
    this.spreadsheetId = config.spreadsheetId;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  // Helper method to make API requests
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    // OAuth2 uses access token in Authorization header, no query parameters needed
    const url = `${this.baseUrl}/${this.spreadsheetId}${endpoint}`;
    
    console.log('🌐 Making OAuth2 API request to:', url);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Initialize the spreadsheet with headers
  async initializeSpreadsheet(): Promise<void> {
    try {
      const headers = ['ID', 'Date', 'Amount', 'Type', 'Quantity', 'Description'];
      
      await this.makeRequest('/values/A1:F1?valueInputOption=USER_ENTERED', {
        method: 'PUT',
        body: JSON.stringify({
          values: [headers],
        }),
      });

      console.log('Spreadsheet initialized with headers');
    } catch (error) {
      console.error('Error initializing spreadsheet:', error);
      throw error;
    }
  }

  // Add a new transaction
  async addTransaction(transaction: TransactionRow): Promise<void> {
    try {
      const values = [
        transaction.id,
        transaction.date,
        transaction.amount,
        transaction.type,
        transaction.quantity || '',
        transaction.description,
      ];

      await this.makeRequest('/values/A:F:append?valueInputOption=USER_ENTERED', {
        method: 'POST',
        body: JSON.stringify({
          values: [values],
        }),
      });

      console.log('✅ Transaction added successfully');
    } catch (error) {
      console.error('❌ Error adding transaction:', error);
      throw error;
    }
  }

  // Get all transactions
  async getAllTransactions(): Promise<TransactionRow[]> {
    try {
      const response = await this.makeRequest('/values/A:F');
      
      if (!response.values || response.values.length <= 1) {
        return [];
      }

      // Skip header row and convert to TransactionRow objects
      const rows = response.values.slice(1);
      return rows.map((row: any[]) => ({
        id: row[0] || '',
        date: row[1] || '',
        amount: parseFloat(row[2]) || 0,
        type: row[3] as 'sale' | 'expense',
        quantity: row[4] ? parseInt(row[4]) : undefined,
        description: row[5] || '',
      })).filter((transaction: TransactionRow) => transaction.id); // Filter out empty rows
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Update an existing transaction
  async updateTransaction(transactionId: string, updatedTransaction: TransactionRow): Promise<void> {
    try {
      // First, find the row index
      const transactions = await this.getAllTransactions();
      const rowIndex = transactions.findIndex(t => t.id === transactionId);
      
      if (rowIndex === -1) {
        throw new Error('Transaction not found');
      }

      // Row index + 2 because: +1 for header row, +1 for 1-based indexing
      const sheetRow = rowIndex + 2;
      const values = [
        updatedTransaction.id,
        updatedTransaction.date,
        updatedTransaction.amount,
        updatedTransaction.type,
        updatedTransaction.quantity || '',
        updatedTransaction.description,
      ];

      await this.makeRequest(`/values/A${sheetRow}:F${sheetRow}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        body: JSON.stringify({
          values: [values],
        }),
      });

      console.log('✅ Transaction updated successfully');
    } catch (error) {
      console.error('❌ Error updating transaction:', error);
      throw error;
    }
  }

  // Delete a transaction
  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      // First, find the row index
      const transactions = await this.getAllTransactions();
      const rowIndex = transactions.findIndex(t => t.id === transactionId);
      
      if (rowIndex === -1) {
        throw new Error('Transaction not found');
      }

      // Row index + 2 because: +1 for header row, +1 for 1-based indexing
      const sheetRow = rowIndex + 2;

      // Delete the row using batchUpdate
      await this.makeRequest(':batchUpdate', {
        method: 'POST',
        body: JSON.stringify({
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // First sheet
                dimension: 'ROWS',
                startIndex: sheetRow - 1, // 0-based for batchUpdate
                endIndex: sheetRow,
              },
            },
          }],
        }),
      });

      console.log('✅ Transaction deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting transaction:', error);
      throw error;
    }
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    try {
      // Clear all data except headers
      await this.makeRequest('/values/A2:F:clear', {
        method: 'POST',
      });

      console.log('✅ All data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      throw error;
    }
  }

  // Check if the spreadsheet is properly configured
  async checkSpreadsheetAccess(): Promise<boolean> {
    try {
      await this.makeRequest('');
      return true;
    } catch (error) {
      console.error('Spreadsheet access check failed:', error);
      return false;
    }
  }
}
