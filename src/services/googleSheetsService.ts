import { google } from 'googleapis';

export interface GoogleSheetsConfig {
  apiKey: string;
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
  private sheets;
  private spreadsheetId: string;

  constructor(config: GoogleSheetsConfig) {
    this.sheets = google.sheets({
      version: 'v4',
      auth: config.apiKey,
    });
    this.spreadsheetId = config.spreadsheetId;
  }

  // Initialize the spreadsheet with headers
  async initializeSpreadsheet(): Promise<void> {
    try {
      const headers = ['ID', 'Date', 'Amount', 'Type', 'Quantity', 'Description'];
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'A1:F1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
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

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'A:F',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });

      console.log('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  // Get all transactions
  async getAllTransactions(): Promise<TransactionRow[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'A2:F', // Skip header row
      });

      const rows = response.data.values || [];
      
      return rows.map((row): TransactionRow => ({
        id: row[0] || '',
        date: row[1] || '',
        amount: parseFloat(row[2]) || 0,
        type: (row[3] as 'sale' | 'expense') || 'expense',
        quantity: row[4] ? parseInt(row[4]) : undefined,
        description: row[5] || '',
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Update a transaction by ID
  async updateTransaction(transaction: TransactionRow): Promise<void> {
    try {
      // First, find the row with this ID
      const allTransactions = await this.getAllTransactions();
      const rowIndex = allTransactions.findIndex(t => t.id === transaction.id);
      
      if (rowIndex === -1) {
        throw new Error('Transaction not found');
      }

      const actualRowNumber = rowIndex + 2; // +1 for header, +1 for 0-based index
      const values = [
        transaction.id,
        transaction.date,
        transaction.amount,
        transaction.type,
        transaction.quantity || '',
        transaction.description,
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `A${actualRowNumber}:F${actualRowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });

      console.log('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  // Delete a transaction by ID
  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      // First, find the row with this ID
      const allTransactions = await this.getAllTransactions();
      const rowIndex = allTransactions.findIndex(t => t.id === transactionId);
      
      if (rowIndex === -1) {
        throw new Error('Transaction not found');
      }

      const actualRowNumber = rowIndex + 2; // +1 for header, +1 for 0-based index

      // Delete the row
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // Assumes first sheet
                dimension: 'ROWS',
                startIndex: actualRowNumber - 1, // 0-based for API
                endIndex: actualRowNumber, // 0-based for API
              },
            },
          }],
        },
      });

      console.log('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Clear all data (useful for testing)
  async clearAllData(): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: 'A2:F', // Keep headers
      });

      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}
