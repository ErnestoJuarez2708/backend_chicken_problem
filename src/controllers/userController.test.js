import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as userController from './userController.js';
import * as userService from '../services/userService.js';
import { errorBuilder } from '../utils/errorBuilder.js';

// Mock de las dependencias
vi.mock('../services/userService.js');
vi.mock('../utils/errorBuilder.js');

describe('User Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRes = {
      success: vi.fn((statusCode, message, data) => ({
        statusCode,
        message,
        data
      }))
    };

    mockNext = vi.fn();
  });

  describe('getUsersController', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: '1', name: 'John', email: 'john@example.com' },
        { _id: '2', name: 'Jane', email: 'jane@example.com' }
      ];

      mockReq = {};
      userService.getUsersService.mockResolvedValue(mockUsers);

      await userController.getUsersController(mockReq, mockRes, mockNext);

      expect(userService.getUsersService).toHaveBeenCalled();
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Users retrieved successfully',
        mockUsers
      );
    });

    it('should handle service errors', async () => {
      mockReq = {};
      const error = new Error('Database error');
      userService.getUsersService.mockRejectedValue(error);

      await userController.getUsersController(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserByIdController', () => {
    it('should return a user by id', async () => {
      const mockUser = { _id: '123', name: 'John', email: 'john@example.com' };

      mockReq = { params: { id: '123' } };
      userService.getUserByIdService.mockResolvedValue(mockUser);

      await userController.getUserByIdController(mockReq, mockRes, mockNext);

      expect(userService.getUserByIdService).toHaveBeenCalledWith('123');
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'User retrieved successfully',
        mockUser
      );
    });

    it('should return 404 when user not found', async () => {
      mockReq = { params: { id: 'invalid-id' } };
      userService.getUserByIdService.mockResolvedValue(null);

      const error = new Error('User not found');
      errorBuilder.mockReturnValue(error);

      await userController.getUserByIdController(mockReq, mockRes, mockNext);

      expect(errorBuilder).toHaveBeenCalledWith('User not found', 404);
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle service errors', async () => {
      mockReq = { params: { id: '123' } };
      const error = new Error('Database error');
      userService.getUserByIdService.mockRejectedValue(error);

      await userController.getUserByIdController(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateUserByIdController', () => {
    it('should update a user', async () => {
      const updateData = { name: 'Updated John' };
      const mockUpdatedUser = { _id: '123', name: 'Updated John' };

      mockReq = { params: { id: '123' }, body: updateData };
      userService.updateUserByIdService.mockResolvedValue(mockUpdatedUser);

      await userController.updateUserByIdController(mockReq, mockRes, mockNext);

      expect(userService.updateUserByIdService).toHaveBeenCalledWith('123', updateData);
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'User updated successfully',
        mockUpdatedUser
      );
    });

    it('should return 404 when user not found', async () => {
      mockReq = { params: { id: 'invalid-id' }, body: {} };
      userService.updateUserByIdService.mockResolvedValue(null);

      const error = new Error('User not found');
      errorBuilder.mockReturnValue(error);

      await userController.updateUserByIdController(mockReq, mockRes, mockNext);

      expect(errorBuilder).toHaveBeenCalledWith('User not found', 404);
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle service errors', async () => {
      mockReq = { params: { id: '123' }, body: {} };
      const error = new Error('Database error');
      userService.updateUserByIdService.mockRejectedValue(error);

      await userController.updateUserByIdController(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateMyProfileController', () => {
    it('should update the authenticated user profile', async () => {
      const updateData = { name: 'Updated Profile' };
      const mockUpdatedUser = { _id: 'user-123', name: 'Updated Profile' };

      mockReq = { user: { id: 'user-123' }, body: updateData };
      userService.updateUserByIdService.mockResolvedValue(mockUpdatedUser);

      await userController.updateMyProfileController(mockReq, mockRes, mockNext);

      expect(userService.updateUserByIdService).toHaveBeenCalledWith('user-123', updateData);
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Profile updated successfully',
        mockUpdatedUser
      );
    });

    it('should return 404 when profile not found', async () => {
      mockReq = { user: { id: 'user-123' }, body: {} };
      userService.updateUserByIdService.mockResolvedValue(null);

      const error = new Error('User not found');
      errorBuilder.mockReturnValue(error);

      await userController.updateMyProfileController(mockReq, mockRes, mockNext);

      expect(errorBuilder).toHaveBeenCalledWith('User not found', 404);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getMyProfileController', () => {
    it('should return the authenticated user profile', async () => {
      const mockUser = { _id: 'user-123', name: 'John', email: 'john@example.com' };

      mockReq = { user: { id: 'user-123' } };
      userService.getUserByIdService.mockResolvedValue(mockUser);

      await userController.getMyProfileController(mockReq, mockRes, mockNext);

      expect(userService.getUserByIdService).toHaveBeenCalledWith('user-123');
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Profile retrieved successfully',
        mockUser
      );
    });

    it('should return 404 when profile not found', async () => {
      mockReq = { user: { id: 'user-123' } };
      userService.getUserByIdService.mockResolvedValue(null);

      const error = new Error('User not found');
      errorBuilder.mockReturnValue(error);

      await userController.getMyProfileController(mockReq, mockRes, mockNext);

      expect(errorBuilder).toHaveBeenCalledWith('User not found', 404);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
