import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as pointSellController from './pointSellController.js';
import * as pointSellService from '../services/pointSellService.js';
import { validatePointSellBody } from '../utils/pointSellValidator.js';

// Mock de las dependencias
vi.mock('../services/pointSellService.js');
vi.mock('../utils/pointSellValidator.js');

describe('PointSell Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock res con el método success
    mockRes = {
      success: vi.fn((statusCode, message, data) => ({
        statusCode,
        message,
        data
      }))
    };

    mockNext = vi.fn();
  });

  describe('findPointsSell', () => {
    it('should return all points of sale without filters', async () => {
      const mockPointsSell = [
        { _id: '1', name: 'Pollo 1' },
        { _id: '2', name: 'Pollo 2' }
      ];

      mockReq = { query: {} };
      pointSellService.getAllPointsSell.mockResolvedValue(mockPointsSell);

      await pointSellController.findPointsSell(mockReq, mockRes, mockNext);

      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Points of sale retrieved successfully',
        mockPointsSell
      );
    });

    it('should return points of sale filtered by type', async () => {
      const mockPointsSell = [{ _id: '1', name: 'Pollo FIJO', type: 'FIJO' }];

      mockReq = { query: { type: 'FIJO' } };
      pointSellService.getPointsSellByType.mockResolvedValue(mockPointsSell);

      await pointSellController.findPointsSell(mockReq, mockRes, mockNext);

      expect(pointSellService.getPointsSellByType).toHaveBeenCalledWith('FIJO');
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Points of sale retrieved successfully',
        mockPointsSell
      );
    });

    it('should return points of sale filtered by state', async () => {
      const mockPointsSell = [{ _id: '1', name: 'Pollo ACTIVO', state: 'ACTIVO' }];

      mockReq = { query: { state: 'ACTIVO' } };
      pointSellService.getPointsSellByState.mockResolvedValue(mockPointsSell);

      await pointSellController.findPointsSell(mockReq, mockRes, mockNext);

      expect(pointSellService.getPointsSellByState).toHaveBeenCalledWith('ACTIVO');
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Points of sale retrieved successfully',
        mockPointsSell
      );
    });

    it('should return points of sale filtered by owner', async () => {
      const mockPointsSell = [{ _id: '1', name: 'Pollo Owner', owner: 'user123' }];

      mockReq = { query: { owner: 'user123' } };
      pointSellService.getPointsSellByOwner.mockResolvedValue(mockPointsSell);

      await pointSellController.findPointsSell(mockReq, mockRes, mockNext);

      expect(pointSellService.getPointsSellByOwner).toHaveBeenCalledWith('user123');
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Points of sale retrieved successfully',
        mockPointsSell
      );
    });

    it('should return empty array message when no points found', async () => {
      mockReq = { query: {} };
      pointSellService.getAllPointsSell.mockResolvedValue([]);

      await pointSellController.findPointsSell(mockReq, mockRes, mockNext);

      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'No points of sale found with the specified criteria',
        []
      );
    });
  });

  describe('findPointSellById', () => {
    it('should return a point of sale by id', async () => {
      const mockPointSell = { _id: '123', name: 'Pollo Express' };

      mockReq = { params: { id: '123' } };
      pointSellService.getPointSellById.mockResolvedValue(mockPointSell);

      await pointSellController.findPointSellById(mockReq, mockRes, mockNext);

      expect(pointSellService.getPointSellById).toHaveBeenCalledWith('123');
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Point of sale with id 123 successfully retrieved',
        mockPointSell
      );
    });

    it('should return 404 error when point of sale not found', async () => {
      mockReq = { params: { id: 'invalid-id' } };
      pointSellService.getPointSellById.mockResolvedValue(null);

      await pointSellController.findPointSellById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Point of sale not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('savePointSell', () => {
    it('should create a new point of sale', async () => {
      const pointSellData = {
        name: 'Pollo Grill',
        type: 'FIJO',
        direction: 'Calle 1',
        latitude: -16.5,
        longitude: -68.1
      };

      const mockCreatedPointSell = { _id: '123', ...pointSellData };

      mockReq = { 
        body: pointSellData,
        user: { id: 'user-123' }
      };
      mockRes.success = vi.fn().mockReturnValue(mockRes);

      validatePointSellBody.mockReturnValue({
        validation: true,
        message: 'All validation passed'
      });

      pointSellService.createPointSell.mockResolvedValue(mockCreatedPointSell);

      await pointSellController.savePointSell(mockReq, mockRes, mockNext);

      expect(validatePointSellBody).toHaveBeenCalledWith(pointSellData, true);
      expect(pointSellService.createPointSell).toHaveBeenCalledWith({
        name: pointSellData.name,
        type: pointSellData.type,
        direction: pointSellData.direction,
        latitude: pointSellData.latitude,
        longitude: pointSellData.longitude,
        state: 'PENDIENTE',
        owner: 'user-123'
      });
      expect(mockRes.success).toHaveBeenCalledWith(
        201,
        'Point of sale created successfully',
        mockCreatedPointSell
      );
    });

    it('should return 400 error when validation fails', async () => {
      const pointSellData = {
        name: 'Po',
        type: 'FIJO'
      };

      mockReq = { body: pointSellData };

      validatePointSellBody.mockReturnValue({
        validation: false,
        message: 'Name must be between 3 and 100 characters'
      });

      await pointSellController.savePointSell(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Name must be between 3 and 100 characters');
      expect(error.statusCode).toBe(400);
    });

    it('should handle service errors', async () => {
      const pointSellData = {
        name: 'Pollo Grill',
        type: 'FIJO',
        direction: 'Calle 1',
        latitude: -16.5,
        longitude: -68.1,
        owner: 'user123'
      };

      mockReq = { body: pointSellData };

      validatePointSellBody.mockReturnValue({
        validation: true,
        message: 'All validation passed'
      });

      const error = new Error('Database error');
      pointSellService.createPointSell.mockRejectedValue(error);

      await pointSellController.savePointSell(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0].message).toBe('Database error');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  describe('replacePointSell', () => {
    it('should update a point of sale', async () => {
      const updateData = {
        name: 'Updated Pollo',
        type: 'MOVIL',
        direction: 'New Street',
        latitude: -16.6,
        longitude: -68.2,
        state: 'INACTIVO'
      };

      const mockUpdatedPointSell = { _id: '123', ...updateData };

      mockReq = { 
        params: { id: '123' },
        body: updateData 
      };
      mockRes.success = vi.fn().mockReturnValue(mockRes);

      validatePointSellBody.mockReturnValue({
        validation: true,
        message: 'All validation passed'
      });

      pointSellService.replacePointSellById.mockResolvedValue(mockUpdatedPointSell);

      await pointSellController.replacePointSell(mockReq, mockRes, mockNext);

      expect(validatePointSellBody).toHaveBeenCalledWith(updateData, true);
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Point of sale with id 123 successfully replaced',
        mockUpdatedPointSell
      );
    });

    it('should return 404 error when point of sale to update not found', async () => {
      const updateData = {
        name: 'Updated Pollo',
        type: 'MOVIL',
        direction: 'New Street',
        latitude: -16.6,
        longitude: -68.2,
        state: 'INACTIVO',
        owner: 'user123'
      };

      mockReq = {
        params: { id: 'invalid-id' },
        body: updateData
      };

      validatePointSellBody.mockReturnValue({
        validation: true,
        message: 'All validation passed'
      });

      pointSellService.replacePointSellById.mockResolvedValue(null);

      await pointSellController.replacePointSell(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Point of sale with id invalid-id not found');
      expect(error.statusCode).toBe(404);
    });

    it('should return 400 error when validation fails', async () => {
      const invalidData = {
        name: '',
        type: 'FIJO'
      };

      mockReq = {
        params: { id: '123' },
        body: invalidData
      };

      validatePointSellBody.mockReturnValue({
        validation: false,
        message: 'Name must be a non-empty string'
      });

      await pointSellController.replacePointSell(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Name must be a non-empty string');
      expect(error.statusCode).toBe(400);
    });
  });

  describe('deletePointSell', () => {
    it('should delete a point of sale', async () => {
      const mockDeletedPointSell = { _id: '123', name: 'Deleted Pollo' };

      mockReq = { params: { id: '123' } };
      mockRes.success = vi.fn().mockReturnValue(mockRes);

      pointSellService.deletePointSellById.mockResolvedValue(mockDeletedPointSell);

      await pointSellController.deletePointSell(mockReq, mockRes, mockNext);

      expect(pointSellService.deletePointSellById).toHaveBeenCalledWith('123');
      expect(mockRes.success).toHaveBeenCalledWith(
        200,
        'Point of sale with id 123 successfully deleted',
        mockDeletedPointSell
      );
    });

    it('should return 404 error when point of sale to delete not found', async () => {
      mockReq = { params: { id: 'invalid-id' } };

      pointSellService.deletePointSellById.mockResolvedValue(null);

      await pointSellController.deletePointSell(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Point of sale with id invalid-id not found');
      expect(error.statusCode).toBe(404);
    });

    it('should handle service errors', async () => {
      mockReq = { params: { id: '123' } };

      const error = new Error('Database error');
      pointSellService.deletePointSellById.mockRejectedValue(error);

      await pointSellController.deletePointSell(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0].message).toBe('Database error');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(500);
    });
  });
});
