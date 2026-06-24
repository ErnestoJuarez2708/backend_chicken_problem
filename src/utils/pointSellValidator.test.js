import { describe, it, expect } from 'vitest';
import { validatePointSellBody } from './pointSellValidator.js';

describe('PointSell Validator', () => {
  describe('validatePointSellBody - General', () => {
    it('should return error when body is empty', () => {
      const result = validatePointSellBody(null, true);
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Body is empty and is required');
    });

    it('should return error when body has no valid properties', () => {
      const result = validatePointSellBody({ invalid: 'property' }, true);
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Body has none valid property');
    });
  });

  describe('validatePointSellBody - Name Validation', () => {
    it('should validate a correct name', () => {
      const result = validatePointSellBody(
        { name: 'Pollo Express' },
        false
      );
      expect(result.validation).toBe(true);
    });

    it('should reject empty name', () => {
      const result = validatePointSellBody(
        { name: '' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Name must be a non-empty string');
    });

    it('should reject name with less than 3 characters', () => {
      const result = validatePointSellBody(
        { name: 'Po' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Name must be between 3 and 100 characters');
    });

    it('should reject name with more than 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = validatePointSellBody(
        { name: longName },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Name must be between 3 and 100 characters');
    });

    it('should reject non-string name', () => {
      const result = validatePointSellBody(
        { name: 123 },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Name must be a non-empty string');
    });
  });

  describe('validatePointSellBody - Type Validation', () => {
    it('should validate type FIJO', () => {
      const result = validatePointSellBody(
        { type: 'FIJO' },
        false
      );
      expect(result.validation).toBe(true);
    });

    it('should validate type MOVIL', () => {
      const result = validatePointSellBody(
        { type: 'MOVIL' },
        false
      );
      expect(result.validation).toBe(true);
    });

    it('should reject invalid type', () => {
      const result = validatePointSellBody(
        { type: 'INVALIDO' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Type must be one of: FIJO, MOVIL');
    });
  });

  describe('validatePointSellBody - Direction Validation', () => {
    it('should validate a correct direction', () => {
      const result = validatePointSellBody(
        { direction: 'Calle Principal 123, La Paz' },
        false
      );
      expect(result.validation).toBe(true);
    });

    it('should reject empty direction', () => {
      const result = validatePointSellBody(
        { direction: '' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Direction must be a non-empty string');
    });

    it('should reject direction with less than 5 characters', () => {
      const result = validatePointSellBody(
        { direction: 'Cll' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Direction must be between 5 and 200 characters');
    });

    it('should reject direction with more than 200 characters', () => {
      const longDirection = 'a'.repeat(201);
      const result = validatePointSellBody(
        { direction: longDirection },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Direction must be between 5 and 200 characters');
    });
  });

  describe('validatePointSellBody - Latitude Validation', () => {
    it('should validate correct latitude values', () => {
      let result = validatePointSellBody({ latitude: -16.5023 }, false);
      expect(result.validation).toBe(true);

      result = validatePointSellBody({ latitude: 0 }, false);
      expect(result.validation).toBe(true);

      result = validatePointSellBody({ latitude: 90 }, false);
      expect(result.validation).toBe(true);

      result = validatePointSellBody({ latitude: -90 }, false);
      expect(result.validation).toBe(true);
    });

    it('should reject latitude as string that is not a number', () => {
      const result = validatePointSellBody(
        { latitude: 'invalid' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Latitude must be a valid number');
    });

    it('should reject latitude greater than 90', () => {
      const result = validatePointSellBody(
        { latitude: 91 },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Latitude must be between -90 and 90');
    });

    it('should reject latitude less than -90', () => {
      const result = validatePointSellBody(
        { latitude: -91 },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Latitude must be between -90 and 90');
    });
  });

  describe('validatePointSellBody - Longitude Validation', () => {
    it('should validate correct longitude values', () => {
      let result = validatePointSellBody({ longitude: -68.1495 }, false);
      expect(result.validation).toBe(true);

      result = validatePointSellBody({ longitude: 0 }, false);
      expect(result.validation).toBe(true);

      result = validatePointSellBody({ longitude: 180 }, false);
      expect(result.validation).toBe(true);

      result = validatePointSellBody({ longitude: -180 }, false);
      expect(result.validation).toBe(true);
    });

    it('should reject longitude as string that is not a number', () => {
      const result = validatePointSellBody(
        { longitude: 'invalid' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Longitude must be a valid number');
    });

    it('should reject longitude greater than 180', () => {
      const result = validatePointSellBody(
        { longitude: 181 },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Longitude must be between -180 and 180');
    });

    it('should reject longitude less than -180', () => {
      const result = validatePointSellBody(
        { longitude: -181 },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('Longitude must be between -180 and 180');
    });
  });

  describe('validatePointSellBody - State Validation', () => {
    it('should validate state ACTIVO', () => {
      const result = validatePointSellBody(
        { state: 'ACTIVO' },
        false
      );
      expect(result.validation).toBe(true);
    });

    it('should validate state INACTIVO', () => {
      const result = validatePointSellBody(
        { state: 'INACTIVO' },
        false
      );
      expect(result.validation).toBe(true);
    });

    it('should validate state PENDIENTE', () => {
      const result = validatePointSellBody(
        { state: 'PENDIENTE' },
        false
      );
      expect(result.validation).toBe(true);
    });

    it('should reject invalid state', () => {
      const result = validatePointSellBody(
        { state: 'INVALID' },
        false
      );
      expect(result.validation).toBe(false);
      expect(result.message).toBe('State must be one of: ACTIVO, INACTIVO, PENDIENTE');
    });
  });

  describe('validatePointSellBody - Complete Payload', () => {
    it('should validate a complete correct payload', () => {
      const payload = {
        name: 'Pollo Grill Express',
        type: 'FIJO',
        direction: 'Calle Principal 123, La Paz',
        latitude: -16.5023,
        longitude: -68.1495,
        state: 'ACTIVO'
      };
      const result = validatePointSellBody(payload, true);
      expect(result.validation).toBe(true);
    });

    it('should validate payload without state (optional)', () => {
      const payload = {
        name: 'Pollo Grill Express',
        type: 'FIJO',
        direction: 'Calle Principal 123, La Paz',
        latitude: -16.5023,
        longitude: -68.1495
      };
      const result = validatePointSellBody(payload, true);
      expect(result.validation).toBe(true);
    });

    it('should reject payload with one invalid field', () => {
      const payload = {
        name: 'Po', // Invalid - too short
        type: 'FIJO',
        direction: 'Calle Principal 123, La Paz',
        latitude: -16.5023,
        longitude: -68.1495,
        state: 'ACTIVO'
      };
      const result = validatePointSellBody(payload, true);
      expect(result.validation).toBe(false);
    });

    it('should reject payload with invalid property', () => {
      const payload = {
        name: 'Pollo Grill Express',
        type: 'FIJO',
        direction: 'Calle Principal 123, La Paz',
        latitude: -16.5023,
        longitude: -68.1495,
        state: 'ACTIVO',
        invalidProperty: 'test'
      };
      const result = validatePointSellBody(payload, true);
      expect(result.validation).toBe(false);
      expect(result.message).toContain('invalidProperty');
    });
  });
});
