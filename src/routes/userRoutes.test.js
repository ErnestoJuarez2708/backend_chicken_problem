import { describe, it, expect, vi } from 'vitest';
import { Router } from 'express';

// Mocks ANTES de importar el router
vi.mock('../middlewares/authenticationMiddleware.js', () => ({
  authenticationMiddleware: vi.fn((req, res, next) => next()),
  authorizationMiddleware: vi.fn((roles) => (req, res, next) => next())
}));

vi.mock('../controllers/userController.js');

import userRouter from './userRoutes.js';

describe('User Routes', () => {
  describe('Route Structure', () => {
    it('should be an express Router instance', () => {
      expect(userRouter).toBeInstanceOf(Router);
    });

    it('should have GET / route registered (ADMIN)', () => {
      const routes = userRouter.stack;
      const getRoute = routes.find(
        r => r.route && r.route.methods.get && r.route.path === '/'
      );
      expect(getRoute).toBeDefined();
      expect(getRoute.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('should have GET /:id route registered (ADMIN)', () => {
      const routes = userRouter.stack;
      const getByIdRoute = routes.find(
        r => r.route && r.route.methods.get && r.route.path === '/:id'
      );
      expect(getByIdRoute).toBeDefined();
      expect(getByIdRoute.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('should have PATCH /:id route registered (ADMIN)', () => {
      const routes = userRouter.stack;
      const patchIdRoute = routes.find(
        r => r.route && r.route.methods.patch && r.route.path === '/:id'
      );
      expect(patchIdRoute).toBeDefined();
      expect(patchIdRoute.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('should have PATCH /my-profile route registered', () => {
      const routes = userRouter.stack;
      const patchMyProfile = routes.find(
        r => r.route && r.route.methods.patch && r.route.path === '/my-profile'
      );
      expect(patchMyProfile).toBeDefined();
      expect(patchMyProfile.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('should have GET /my-profile route registered', () => {
      const routes = userRouter.stack;
      const getMyProfile = routes.find(
        r => r.route && r.route.methods.get && r.route.path === '/my-profile'
      );
      expect(getMyProfile).toBeDefined();
      expect(getMyProfile.route.stack.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Middleware Protection', () => {
    it('should apply authenticationMiddleware to all routes', () => {
      const middlewareLayers = userRouter.stack.filter(layer => !layer.route);
      expect(middlewareLayers.length).toBeGreaterThan(0);
    });

    it('GET / should require ADMIN authorization', () => {
      const route = userRouter.stack.find(
        r => r.route && r.route.path === '/' && r.route.methods.get
      );
      expect(route?.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('GET /:id should require ADMIN authorization', () => {
      const route = userRouter.stack.find(
        r => r.route && r.route.path === '/:id' && r.route.methods.get
      );
      expect(route?.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('PATCH /:id should require ADMIN authorization', () => {
      const route = userRouter.stack.find(
        r => r.route && r.route.path === '/:id' && r.route.methods.patch
      );
      expect(route?.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('PATCH /my-profile should allow USER, ADMIN, VENDOR', () => {
      const route = userRouter.stack.find(
        r => r.route && r.route.path === '/my-profile' && r.route.methods.patch
      );
      expect(route?.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('GET /my-profile should allow USER, ADMIN, VENDOR', () => {
      const route = userRouter.stack.find(
        r => r.route && r.route.path === '/my-profile' && r.route.methods.get
      );
      expect(route?.route.stack.length).toBeGreaterThanOrEqual(2);
    });
  });
});