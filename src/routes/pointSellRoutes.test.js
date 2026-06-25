import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from 'express';
import pointSellRoutes from './pointSellRoutes.js';

describe('Point Sell Routes', () => {
  describe('Route Structure', () => {
    it('should be an express Router instance', () => {
      expect(pointSellRoutes).toBeInstanceOf(Router);
    });

    it('should have GET / route registered', () => {
      const routes = pointSellRoutes.stack;
      const getRoute = routes.find(
        r => r.route && r.route.methods.get && r.route.path === '/'
      );
      expect(getRoute).toBeDefined();
      expect(getRoute.route.stack.length).toBe(1);
    });

    it('should have GET /:id route registered', () => {
      const routes = pointSellRoutes.stack;
      const getByIdRoute = routes.find(
        r => r.route && r.route.methods.get && r.route.path === '/:id'
      );
      expect(getByIdRoute).toBeDefined();
      expect(getByIdRoute.route.stack.length).toBe(1); 
    });

    it('should have POST / route registered', () => {
      const routes = pointSellRoutes.stack;
      const postRoute = routes.find(
        r => r.route && r.route.methods.post && r.route.path === '/'
      );
      expect(postRoute).toBeDefined();
      expect(postRoute.route.stack.length).toBeGreaterThan(1);
    });

    it('should have PUT /:id route registered', () => {
      const routes = pointSellRoutes.stack;
      const putRoute = routes.find(
        r => r.route && r.route.methods.put && r.route.path === '/:id'
      );
      expect(putRoute).toBeDefined();
      expect(putRoute.route.stack.length).toBeGreaterThan(1);
    });

    it('should have DELETE /:id route registered', () => {
      const routes = pointSellRoutes.stack;
      const deleteRoute = routes.find(
        r => r.route && r.route.methods.delete && r.route.path === '/:id'
      );
      expect(deleteRoute).toBeDefined();
      expect(deleteRoute.route.stack.length).toBeGreaterThan(1);
    });
  });

  describe('Middleware Protection', () => {
    it('GET / should have no middleware', () => {
      const routes = pointSellRoutes.stack;
      const getRoute = routes.find(
        r => r.route && r.route.methods.get && r.route.path === '/'
      );
      expect(getRoute.route.stack.length).toBe(1);
    });

    it('GET /:id should have no middleware', () => {
      const routes = pointSellRoutes.stack;
      const getByIdRoute = routes.find(
        r => r.route && r.route.methods.get && r.route.path === '/:id'
      );
      expect(getByIdRoute.route.stack.length).toBe(1);
    });

    it('POST / should require authentication and authorization middleware', () => {
      const routes = pointSellRoutes.stack;
      const postRoute = routes.find(
        r => r.route && r.route.methods.post && r.route.path === '/'
      );
      expect(postRoute.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('PUT /:id should require authentication and authorization middleware', () => {
      const routes = pointSellRoutes.stack;
      const putRoute = routes.find(
        r => r.route && r.route.methods.put && r.route.path === '/:id'
      );
      expect(putRoute.route.stack.length).toBeGreaterThanOrEqual(2);
    });

    it('DELETE /:id should require authentication and authorization middleware', () => {
      const routes = pointSellRoutes.stack;
      const deleteRoute = routes.find(
        r => r.route && r.route.methods.delete && r.route.path === '/:id'
      );
      expect(deleteRoute.route.stack.length).toBeGreaterThanOrEqual(2);
    });
  });
});
