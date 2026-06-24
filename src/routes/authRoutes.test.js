import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Importamos el router
import authRouter from './authRoutes.js';

// Mocks de los controllers
vi.mock('../controllers/authController.js');

import { loginController, registerController } from '../controllers/authController.js';

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter); // Cambia '/api/auth' si usas otro prefijo en tu app
  });

  describe('POST /api/auth/register', () => {
    it('should call registerController when POST /register', async () => {
      registerController.mockImplementation((req, res) => {
        res.status(201).json({ name: 'Juan', token: 'abc123' });
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Juan Pérez',
          email: 'juan@example.com',
          password: 'password123',
          role: 'SELLER'
        });

      expect(registerController).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should call loginController when POST /login', async () => {
      loginController.mockImplementation((req, res) => {
        res.status(200).json({ name: 'Juan', token: 'jwt123' });
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'juan@example.com',
          password: 'password123'
        });

      expect(loginController).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });
});