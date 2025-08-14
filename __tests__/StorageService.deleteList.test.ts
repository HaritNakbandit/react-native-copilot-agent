/**
 * Unit tests for delete list functionality in StorageService
 * Tests for deleteInvestments, deleteTransactions, and deleteFunds methods
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageService from '../src/services/StorageService';
import {STORAGE_KEYS} from '../src/utils/constants';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('StorageService - Delete List Functions', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteInvestments', () => {
    it('should successfully delete investments list', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      mockRemoveItem.mockResolvedValueOnce(undefined);

      // Execute
      await StorageService.deleteInvestments();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.INVESTMENTS);
      expect(mockRemoveItem).toHaveBeenCalledTimes(1);
    });

    it('should handle error when deleting investments list', async () => {
      // Setup
      const mockError = new Error('Storage deletion failed');
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      mockRemoveItem.mockRejectedValueOnce(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Execute & Verify
      await expect(StorageService.deleteInvestments()).rejects.toThrow(
        'Storage deletion failed',
      );
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.INVESTMENTS);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting investments:',
        mockError,
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return empty array after deleting investments list', async () => {
      // Setup - Mock the delete operation and subsequent get operation
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      mockRemoveItem.mockResolvedValueOnce(undefined);
      mockGetItem.mockResolvedValueOnce(null); // No data after deletion

      // Execute
      await StorageService.deleteInvestments();
      const investments = await StorageService.getInvestments();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.INVESTMENTS);
      expect(investments).toEqual([]);
    });
  });

  describe('deleteTransactions', () => {
    it('should successfully delete transactions list', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      mockRemoveItem.mockResolvedValueOnce(undefined);

      // Execute
      await StorageService.deleteTransactions();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.TRANSACTIONS);
      expect(mockRemoveItem).toHaveBeenCalledTimes(1);
    });

    it('should handle error when deleting transactions list', async () => {
      // Setup
      const mockError = new Error('Storage deletion failed');
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      mockRemoveItem.mockRejectedValueOnce(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Execute & Verify
      await expect(StorageService.deleteTransactions()).rejects.toThrow(
        'Storage deletion failed',
      );
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.TRANSACTIONS);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting transactions:',
        mockError,
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return empty array after deleting transactions list', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      mockRemoveItem.mockResolvedValueOnce(undefined);
      mockGetItem.mockResolvedValueOnce(null);

      // Execute
      await StorageService.deleteTransactions();
      const transactions = await StorageService.getTransactions();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.TRANSACTIONS);
      expect(transactions).toEqual([]);
    });
  });

  describe('deleteFunds', () => {
    it('should successfully delete funds list', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      mockRemoveItem.mockResolvedValueOnce(undefined);

      // Execute
      await StorageService.deleteFunds();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.FUNDS_DATA);
      expect(mockRemoveItem).toHaveBeenCalledTimes(1);
    });

    it('should handle error when deleting funds list', async () => {
      // Setup
      const mockError = new Error('Storage deletion failed');
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      mockRemoveItem.mockRejectedValueOnce(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Execute & Verify
      await expect(StorageService.deleteFunds()).rejects.toThrow(
        'Storage deletion failed',
      );
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.FUNDS_DATA);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting funds:',
        mockError,
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return empty array after deleting funds list', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      mockRemoveItem.mockResolvedValueOnce(undefined);
      mockGetItem.mockResolvedValueOnce(null);

      // Execute
      await StorageService.deleteFunds();
      const funds = await StorageService.getFunds();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.FUNDS_DATA);
      expect(funds).toEqual([]);
    });
  });

  describe('Integration Tests - Delete Specific Lists', () => {
    it('should delete only investments list while preserving other data', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      // Mock that only investments are deleted
      mockRemoveItem.mockResolvedValueOnce(undefined);

      // Mock that other data still exists
      mockGetItem
        .mockResolvedValueOnce(null) // investments (deleted)
        .mockResolvedValueOnce(JSON.stringify([{id: 'txn1'}])) // transactions (preserved)
        .mockResolvedValueOnce(JSON.stringify([{id: 'fund1'}])); // funds (preserved)

      // Execute
      await StorageService.deleteInvestments();

      // Verify that only investments are deleted
      const investments = await StorageService.getInvestments();
      const transactions = await StorageService.getTransactions();
      const funds = await StorageService.getFunds();

      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.INVESTMENTS);
      expect(investments).toEqual([]);
      expect(transactions).toEqual([{id: 'txn1'}]);
      expect(funds).toEqual([{id: 'fund1'}]);
    });

    it('should delete only transactions list while preserving other data', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      mockRemoveItem.mockResolvedValueOnce(undefined);

      mockGetItem
        .mockResolvedValueOnce(JSON.stringify([{id: 'inv1'}])) // investments (preserved)
        .mockResolvedValueOnce(null) // transactions (deleted)
        .mockResolvedValueOnce(JSON.stringify([{id: 'fund1'}])); // funds (preserved)

      // Execute
      await StorageService.deleteTransactions();

      // Verify
      const investments = await StorageService.getInvestments();
      const transactions = await StorageService.getTransactions();
      const funds = await StorageService.getFunds();

      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.TRANSACTIONS);
      expect(investments).toEqual([{id: 'inv1'}]);
      expect(transactions).toEqual([]);
      expect(funds).toEqual([{id: 'fund1'}]);
    });

    it('should delete only funds list while preserving other data', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      mockRemoveItem.mockResolvedValueOnce(undefined);

      mockGetItem
        .mockResolvedValueOnce(JSON.stringify([{id: 'inv1'}])) // investments (preserved)
        .mockResolvedValueOnce(JSON.stringify([{id: 'txn1'}])) // transactions (preserved)
        .mockResolvedValueOnce(null); // funds (deleted)

      // Execute
      await StorageService.deleteFunds();

      // Verify
      const investments = await StorageService.getInvestments();
      const transactions = await StorageService.getTransactions();
      const funds = await StorageService.getFunds();

      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.FUNDS_DATA);
      expect(investments).toEqual([{id: 'inv1'}]);
      expect(transactions).toEqual([{id: 'txn1'}]);
      expect(funds).toEqual([]);
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle deleting already empty investments list', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      mockRemoveItem.mockResolvedValueOnce(undefined);
      mockGetItem.mockResolvedValueOnce(null); // Already empty

      // Execute
      await StorageService.deleteInvestments();
      const investments = await StorageService.getInvestments();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.INVESTMENTS);
      expect(investments).toEqual([]);
    });

    it('should handle deleting already empty transactions list', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      mockRemoveItem.mockResolvedValueOnce(undefined);
      mockGetItem.mockResolvedValueOnce(null);

      // Execute
      await StorageService.deleteTransactions();
      const transactions = await StorageService.getTransactions();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.TRANSACTIONS);
      expect(transactions).toEqual([]);
    });

    it('should handle deleting already empty funds list', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const mockGetItem = AsyncStorage.getItem as jest.Mock;

      mockRemoveItem.mockResolvedValueOnce(undefined);
      mockGetItem.mockResolvedValueOnce(null);

      // Execute
      await StorageService.deleteFunds();
      const funds = await StorageService.getFunds();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.FUNDS_DATA);
      expect(funds).toEqual([]);
    });
  });

  describe('Comprehensive Delete List Testing', () => {
    it('should perform multiple delete operations in sequence', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      mockRemoveItem.mockResolvedValue(undefined);

      // Execute - Delete all lists one by one
      await StorageService.deleteInvestments();
      await StorageService.deleteTransactions();
      await StorageService.deleteFunds();

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledTimes(3);
      expect(mockRemoveItem).toHaveBeenNthCalledWith(
        1,
        STORAGE_KEYS.INVESTMENTS,
      );
      expect(mockRemoveItem).toHaveBeenNthCalledWith(
        2,
        STORAGE_KEYS.TRANSACTIONS,
      );
      expect(mockRemoveItem).toHaveBeenNthCalledWith(
        3,
        STORAGE_KEYS.FUNDS_DATA,
      );
    });

    it('should handle mixed success and failure scenarios', async () => {
      // Setup
      const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // First call succeeds, second fails, third succeeds
      mockRemoveItem
        .mockResolvedValueOnce(undefined) // investments - success
        .mockRejectedValueOnce(new Error('Transaction deletion failed')) // transactions - fail
        .mockResolvedValueOnce(undefined); // funds - success

      // Execute
      await StorageService.deleteInvestments(); // Should succeed

      await expect(StorageService.deleteTransactions()).rejects.toThrow(
        'Transaction deletion failed',
      );

      await StorageService.deleteFunds(); // Should succeed

      // Verify
      expect(mockRemoveItem).toHaveBeenCalledTimes(3);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
    });
  });
});
