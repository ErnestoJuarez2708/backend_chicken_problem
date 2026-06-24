import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as authController from './authController.js';

vi.mock('../services/authService.js');
vi.mock('../utils/errorBuilder.js');

import { existUserByEmail, loginService, registerService } from '../services/authService.js';
import { errorBuilder } from '../utils/errorBuilder.js';

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();

    req = { body: {} };
    res = { success: vi.fn().mockReturnThis() };
    next = vi.fn();
  });

  describe('registerController', () => {
    it('should register a user successfully', async () => {
      const mockUserData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'SELLER'
      };

      const mockRegisteredUser = {
        name: 'Juan Pérez',
        token: 'jwt-token-12345'
      };

      req.body = mockUserData;
      existUserByEmail.mockResolvedValue(false);
      registerService.mockResolvedValue(mockRegisteredUser);

      await authController.registerController(req, res, next);

      expect(existUserByEmail).toHaveBeenCalledWith(mockUserData.email);
      expect(registerService).toHaveBeenCalledWith(mockUserData);
      expect(res.success).toHaveBeenCalledWith(
        201,
        "User registered successfully",
        mockRegisteredUser
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if email already exists', async () => {
      const mockUserData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123'
      };

      const mockError = new Error("Email already in use");
      mockError.statusCode = 400;

      req.body = mockUserData;
      existUserByEmail.mockResolvedValue(true);
      errorBuilder.mockReturnValue(mockError);

      await authController.registerController(req, res, next);

      expect(existUserByEmail).toHaveBeenCalledWith(mockUserData.email);
      expect(registerService).not.toHaveBeenCalled();
      expect(errorBuilder).toHaveBeenCalledWith("Email already in use", 400);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.success).not.toHaveBeenCalled();
    });

    it('should call next with error if registration fails', async () => {
      const mockUserData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123'
      };
      const error = new Error('Registration error');

      req.body = mockUserData;
      existUserByEmail.mockResolvedValue(false);
      registerService.mockRejectedValue(error);

      await authController.registerController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.success).not.toHaveBeenCalled();
    });
  });

  describe('loginController', () => {
    it('should login successfully', async () => {
      const mockLoginData = {
        email: 'juan@example.com',
        password: 'password123'
      };

      const mockLoggedUser = {
        name: 'Juan Pérez',
        token: 'jwt-login-token-xyz'
      };

      req.body = mockLoginData;
      loginService.mockResolvedValue(mockLoggedUser);

      await authController.loginController(req, res, next);

      expect(loginService).toHaveBeenCalledWith(mockLoginData.email, mockLoginData.password);
      expect(res.success).toHaveBeenCalledWith(
        200,
        "User logged in successfully",
        mockLoggedUser
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if login fails', async () => {
      const mockLoginData = {
        email: 'juan@example.com',
        password: 'wrongpassword'
      };
      const error = new Error('Invalid credentials');

      req.body = mockLoginData;
      loginService.mockRejectedValue(error);

      await authController.loginController(req, res, next);

      expect(loginService).toHaveBeenCalledWith(mockLoginData.email, mockLoginData.password);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.success).not.toHaveBeenCalled();
    });
  });
});