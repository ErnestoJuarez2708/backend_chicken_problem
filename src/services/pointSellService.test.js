import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as pointSellService from './pointSellService.js';

// Mock del modelo PointSell
vi.mock('../data/pointSell.js', () => ({
  PointSell: {
    find: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn()
  }
}));

import { PointSell } from '../data/pointSell.js';

describe('PointSell Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllPointsSell', () => {
    it('should return all points of sale', async () => {
      const mockPointsSell = [
        { _id: '1', name: 'Pollo Express', type: 'FIJO', state: 'ACTIVO' },
        { _id: '2', name: 'Pollo Mobile', type: 'MOVIL', state: 'PENDIENTE' }
      ];

      PointSell.find.mockResolvedValue(mockPointsSell);

      const result = await pointSellService.getAllPointsSell();

      expect(PointSell.find).toHaveBeenCalledOnce();
      expect(result).toEqual(mockPointsSell);
    });

    it('should return empty array when no points of sale exist', async () => {
      PointSell.find.mockResolvedValue([]);

      const result = await pointSellService.getAllPointsSell();

      expect(result).toEqual([]);
    });
  });

  describe('getPointSellById', () => {
    it('should return a point of sale by id', async () => {
      const mockPointSell = {
        _id: '123',
        name: 'Pollo Express',
        type: 'FIJO',
        state: 'ACTIVO'
      };

      PointSell.findById.mockResolvedValue(mockPointSell);

      const result = await pointSellService.getPointSellById('123');

      expect(PointSell.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockPointSell);
    });

    it('should return null when point of sale not found', async () => {
      PointSell.findById.mockResolvedValue(null);

      const result = await pointSellService.getPointSellById('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('createPointSell', () => {
    it('should create a new point of sale', async () => {
      const newPointSellData = {
        name: 'Pollo Grill',
        type: 'FIJO',
        direction: 'Calle 1',
        latitude: -16.5,
        longitude: -68.1,
        state: 'ACTIVO',
        owner: 'user123'
      };

      const mockCreatedPointSell = {
        _id: '123',
        ...newPointSellData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      PointSell.create.mockResolvedValue(mockCreatedPointSell);

      const result = await pointSellService.createPointSell(newPointSellData);

      expect(PointSell.create).toHaveBeenCalledWith(newPointSellData);
      expect(result).toEqual(mockCreatedPointSell);
    });

    it('should handle create errors', async () => {
      const newPointSellData = {
        name: 'Pollo Grill',
        type: 'FIJO',
        direction: 'Calle 1',
        latitude: -16.5,
        longitude: -68.1,
        owner: 'user123'
      };

      const error = new Error('Database error');
      PointSell.create.mockRejectedValue(error);

      await expect(pointSellService.createPointSell(newPointSellData)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('replacePointSellById', () => {
    it('should update a point of sale', async () => {
      const replacementData = {
        name: 'Updated Pollo',
        type: 'MOVIL',
        direction: 'New Street',
        latitude: -16.6,
        longitude: -68.2,
        state: 'INACTIVO',
        owner: 'user123'
      };

      const mockUpdatedPointSell = {
        _id: '123',
        ...replacementData
      };

      PointSell.findByIdAndUpdate.mockResolvedValue(mockUpdatedPointSell);

      const result = await pointSellService.replacePointSellById('123', replacementData);

      expect(PointSell.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        replacementData,
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedPointSell);
    });

    it('should return null when point of sale to update not found', async () => {
      PointSell.findByIdAndUpdate.mockResolvedValue(null);

      const result = await pointSellService.replacePointSellById('invalid-id', {});

      expect(result).toBeNull();
    });
  });

  describe('deletePointSellById', () => {
    it('should delete a point of sale', async () => {
      const mockDeletedPointSell = {
        _id: '123',
        name: 'Pollo Express',
        type: 'FIJO'
      };

      PointSell.findByIdAndDelete.mockResolvedValue(mockDeletedPointSell);

      const result = await pointSellService.deletePointSellById('123');

      expect(PointSell.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockDeletedPointSell);
    });

    it('should return null when point of sale to delete not found', async () => {
      PointSell.findByIdAndDelete.mockResolvedValue(null);

      const result = await pointSellService.deletePointSellById('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('getPointsSellByType', () => {
    it('should return all points of sale with FIJO type', async () => {
      const mockPointsSell = [
        { _id: '1', name: 'Pollo 1', type: 'FIJO' },
        { _id: '2', name: 'Pollo 2', type: 'FIJO' }
      ];

      PointSell.find.mockResolvedValue(mockPointsSell);

      const result = await pointSellService.getPointsSellByType('FIJO');

      expect(PointSell.find).toHaveBeenCalledWith({ type: 'FIJO' });
      expect(result).toEqual(mockPointsSell);
    });

    it('should return all points of sale with MOVIL type', async () => {
      const mockPointsSell = [
        { _id: '1', name: 'Pollo Mobile', type: 'MOVIL' }
      ];

      PointSell.find.mockResolvedValue(mockPointsSell);

      const result = await pointSellService.getPointsSellByType('MOVIL');

      expect(PointSell.find).toHaveBeenCalledWith({ type: 'MOVIL' });
      expect(result).toEqual(mockPointsSell);
    });

    it('should return empty array when no points with type found', async () => {
      PointSell.find.mockResolvedValue([]);

      const result = await pointSellService.getPointsSellByType('FIJO');

      expect(result).toEqual([]);
    });
  });

  describe('getPointsSellByState', () => {
    it('should return all points of sale with ACTIVO state', async () => {
      const mockPointsSell = [
        { _id: '1', name: 'Pollo 1', state: 'ACTIVO' },
        { _id: '2', name: 'Pollo 2', state: 'ACTIVO' }
      ];

      PointSell.find.mockResolvedValue(mockPointsSell);

      const result = await pointSellService.getPointsSellByState('ACTIVO');

      expect(PointSell.find).toHaveBeenCalledWith({ state: 'ACTIVO' });
      expect(result).toEqual(mockPointsSell);
    });

    it('should return all points of sale with PENDIENTE state', async () => {
      const mockPointsSell = [
        { _id: '1', name: 'Pollo Pending', state: 'PENDIENTE' }
      ];

      PointSell.find.mockResolvedValue(mockPointsSell);

      const result = await pointSellService.getPointsSellByState('PENDIENTE');

      expect(PointSell.find).toHaveBeenCalledWith({ state: 'PENDIENTE' });
      expect(result).toEqual(mockPointsSell);
    });

    it('should return empty array when no points with state found', async () => {
      PointSell.find.mockResolvedValue([]);

      const result = await pointSellService.getPointsSellByState('INACTIVO');

      expect(result).toEqual([]);
    });
  });

  describe('getPointsSellByOwner', () => {
    it('should return all points of sale owned by a user', async () => {
      const mockPointsSell = [
        { _id: '1', name: 'Pollo 1', owner: 'user123' },
        { _id: '2', name: 'Pollo 2', owner: 'user123' }
      ];

      PointSell.find.mockResolvedValue(mockPointsSell);

      const result = await pointSellService.getPointsSellByOwner('user123');

      expect(PointSell.find).toHaveBeenCalledWith({ owner: 'user123' });
      expect(result).toEqual(mockPointsSell);
    });

    it('should return empty array when owner has no points', async () => {
      PointSell.find.mockResolvedValue([]);

      const result = await pointSellService.getPointsSellByOwner('user-no-points');

      expect(result).toEqual([]);
    });
  });
});
