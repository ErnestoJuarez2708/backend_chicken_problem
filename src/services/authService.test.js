import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as authService from './authService.js';

// Mocks
vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('../data/user.js');

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../data/user.js';

describe('Auth Service', () => {
  const mockUserData = {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'password123',
    role: 'SELLER'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('loginService', () => {
    const email = 'juan@example.com';
    const password = 'password123';

    it('should login successfully and return token', async () => {
      const mockUser = {
        _id: '123abc',
        name: 'Juan Pérez',
        email,
        password: '$2b$10$hashedpassword',
        role: 'USER'
      };
      const mockToken = 'jwt-login-token-xyz';

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await authService.loginService(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, name: mockUser.name, role: mockUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(result).toEqual({
        name: mockUser.name,
        token: mockToken
      });
    });

    it('should throw error when user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(authService.loginService(email, password))
        .rejects.toThrow('Error logging in: Invalid email or password');
    });

    it('should throw error when password is incorrect', async () => {
      const mockUser = {
        _id: '123',
        name: 'Juan',
        email,
        password: '$2b$10$wronghash'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.loginService(email, password))
        .rejects.toThrow('Error logging in: Invalid email or password');
    });

    it('should throw error on unexpected login failure', async () => {
      const error = new Error('Database connection error');
      User.findOne.mockRejectedValue(error);

      await expect(authService.loginService(email, password))
        .rejects.toThrow('Error logging in: Database connection error');
    });
  });

  describe('existUserByEmail', () => {
    it('should return true when user exists', async () => {
      User.findOne.mockResolvedValue({ _id: '123', email: 'juan@example.com' });

      const result = await authService.existUserByEmail('juan@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'juan@example.com' });
      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await authService.existUserByEmail('noexiste@example.com');

      expect(result).toBe(false);
    });

    it('should throw error when checking existence fails', async () => {
      const error = new Error('Database error');
      User.findOne.mockRejectedValue(error);

      await expect(authService.existUserByEmail('juan@example.com'))
        .rejects.toThrow('Error checking user existence: Database error');
    });
  });
});