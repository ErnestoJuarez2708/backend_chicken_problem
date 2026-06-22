import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as userService from './userService.js';

vi.mock('../data/user.js', () => ({
  User: {
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn()
  }
}));

import { User } from '../data/user.js';

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsersService', () => {
    it('should return all users without filters', async () => {
      const mockUsers = [
        { _id: '1', name: 'John', email: 'john@example.com', role: 'USER' },
        { _id: '2', name: 'Jane', email: 'jane@example.com', role: 'VENDEDOR' }
      ];

      User.find.mockResolvedValue(mockUsers);

      const result = await userService.getUsersService();

      expect(User.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockUsers);
    });

    it('should return users filtered by roles', async () => {
      const mockUsers = [
        { _id: '1', name: 'John', email: 'john@example.com', role: 'VENDEDOR' }
      ];

      User.find.mockResolvedValue(mockUsers);

      const result = await userService.getUsersService(['VENDEDOR']);

      expect(result).toEqual(mockUsers);
    });

    it('should return users filtered by active status', async () => {
      const mockUsers = [
        { _id: '1', name: 'John', email: 'john@example.com', active: true }
      ];

      User.find.mockResolvedValue(mockUsers);

      const result = await userService.getUsersService(undefined, true);

      expect(result).toEqual(mockUsers);
    });

    it('should throw error when database fails', async () => {
      const error = new Error('Database error');
      User.find.mockRejectedValue(error);

      await expect(userService.getUsersService()).rejects.toThrow('Database error');
    });
  });

  describe('getUserByIdService', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        _id: '123',
        name: 'John',
        email: 'john@example.com',
        role: 'USER'
      };

      User.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserByIdService('123');

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      User.findById.mockResolvedValue(null);

      const result = await userService.getUserByIdService('invalid-id');

      expect(result).toBeNull();
    });

    it('should throw error when database fails', async () => {
      const error = new Error('Database error');
      User.findById.mockRejectedValue(error);

      await expect(userService.getUserByIdService('123')).rejects.toThrow('Database error');
    });
  });

  describe('updateUserByIdService', () => {
    it('should update a user', async () => {
      const updateData = {
        name: 'Updated John',
        email: 'updated@example.com'
      };

      const mockUpdatedUser = {
        _id: '123',
        ...updateData,
        role: 'USER'
      };

      User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUserByIdService('123', updateData);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', updateData, { new: true });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should return null when user not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      const result = await userService.updateUserByIdService('invalid-id', {});

      expect(result).toBeNull();
    });

    it('should throw error when database fails', async () => {
      const error = new Error('Database error');
      User.findByIdAndUpdate.mockRejectedValue(error);

      await expect(userService.updateUserByIdService('123', {})).rejects.toThrow('Database error');
    });
  });
});
