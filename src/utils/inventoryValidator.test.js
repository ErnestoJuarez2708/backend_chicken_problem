import { describe, it, expect } from 'vitest';
import { validateInventoryBody } from './inventoryValidator.js';

describe('Inventory Validator', () => {
  describe('validateInventoryBody - General', () => {
    it('should return error when body is empty', () => {
      const result = validateInventoryBody(null, true);
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Body is empty and is required');
    });

    it('should return error when body has no valid properties', () => {
      const result = validateInventoryBody({ invalid: 'property' }, true);
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Body has none valid property');
    });
  });

  describe('validateInventoryBody - PointSell Validation', () => {
    it('should validate a correct pointSell ID', () => {
      const result = validateInventoryBody(
        { pointSell: '507f1f77bcf86cd799439011' },
        false
      );
      expect(result.validation).toBe(true);
    });

    it('should reject empty pointSell', () => {
      const result = validateInventoryBody(
        { pointSell: '' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Point Sell ID must be a non-empty string');
    });

    it('should reject non-string pointSell', () => {
      const result = validateInventoryBody(
        { pointSell: 123 },
        false
      );
      expect(result.validation).toBe(false);
    });
  });

  describe('validateInventoryBody - CantidadDisponible Validation', () => {
    it('should validate correct cantidad values', () => {
      let result = validateInventoryBody({ cantidadDisponible: 100 }, false);
      expect(result.validation).toBe(true);

      result = validateInventoryBody({ cantidadDisponible: 0 }, false);
      expect(result.validation).toBe(true);

      result = validateInventoryBody({ cantidadDisponible: '50' }, false);
      expect(result.validation).toBe(true);
    });

    it('should reject negative cantidad', () => {
      const result = validateInventoryBody(
        { cantidadDisponible: -10 },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Cantidad disponible cannot be negative');
    });

    it('should reject non-numeric cantidad', () => {
      const result = validateInventoryBody(
        { cantidadDisponible: 'invalid' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Cantidad disponible must be a valid number');
    });
  });

  describe('validateInventoryBody - PrecioPorKg Validation', () => {
    it('should validate correct precio values', () => {
      let result = validateInventoryBody({ precioPorKg: 15.50 }, false);
      expect(result.validation).toBe(true);

      result = validateInventoryBody({ precioPorKg: '20' }, false);
      expect(result.validation).toBe(true);
    });

    it('should reject precio less than or equal to zero', () => {
      let result = validateInventoryBody({ precioPorKg: 0 }, false);
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Precio por kg must be greater than zero');

      result = validateInventoryBody({ precioPorKg: -5 }, false);
      expect(result.validation).toBe(false);
    });

    it('should reject non-numeric precio', () => {
      const result = validateInventoryBody(
        { precioPorKg: 'invalid' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Precio por kg must be a valid number');
    });
  });

  describe('validateInventoryBody - Estado Validation', () => {
    it('should validate valid estado values', () => {
      let result = validateInventoryBody({ estado: 'DISPONIBLE' }, false);
      expect(result.validation).toBe(true);

      result = validateInventoryBody({ estado: 'AGOTADO' }, false);
      expect(result.validation).toBe(true);

      result = validateInventoryBody({ estado: 'FUERA_SERVICIO' }, false);
      expect(result.validation).toBe(true);
    });

    it('should reject invalid estado', () => {
      const result = validateInventoryBody(
        { estado: 'INVALID' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Estado must be one of: DISPONIBLE, AGOTADO, FUERA_SERVICIO');
    });
  });

  describe('validateInventoryBody - Complete Payload', () => {
    it('should validate a complete correct payload', () => {
      const payload = {
        pointSell: '507f1f77bcf86cd799439011',
        cantidadDisponible: 100,
        precioPorKg: 15.50,
        estado: 'DISPONIBLE'
      };
      const result = validateInventoryBody(payload, true);
      expect(result.validation).toBe(true);
    });

    it('should validate payload without estado (optional)', () => {
      const payload = {
        pointSell: '507f1f77bcf86cd799439011',
        cantidadDisponible: 50,
        precioPorKg: 12.00
      };
      const result = validateInventoryBody(payload, true);
      expect(result.validation).toBe(true);
    });

    it('should reject payload with invalid property', () => {
      const payload = {
        pointSell: '507f1f77bcf86cd799439011',
        cantidadDisponible: 100,
        precioPorKg: 15.50,
        invalidProperty: 'test'
      };
      const result = validateInventoryBody(payload, true);
      expect(result.validation).toBe(false);
      expect(result.message).toContain('invalidProperty');
    });

    it('should reject payload with one invalid field', () => {
      const payload = {
        pointSell: '507f1f77bcf86cd799439011',
        cantidadDisponible: -10, // Invalid
        precioPorKg: 15.50,
        estado: 'DISPONIBLE'
      };
      const result = validateInventoryBody(payload, true);
      expect(result.validation).toBe(false);
    });
  });
});
