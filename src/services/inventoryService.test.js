import { describe, it, expect, beforeEach, vi } from "vitest";
import { 
  getAllInventories,
  getAvailableInventories,
  createInventory,
  updateInventoryById,
  searchNearby 
} from "./inventoryService.js";

import { Inventory } from "../data/inventory.js";

// Mock del modelo Inventory
vi.mock("../data/inventory.js", () => ({
  Inventory: {
    find: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  }
}));

describe("Inventory Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllInventories", () => {
    it("debería retornar todos los inventarios", async () => {
      const mockInventories = [
        { _id: "1", precioPorKg: 15.5 },
        { _id: "2", precioPorKg: 18.0 }
      ];

      Inventory.find.mockResolvedValue(mockInventories);

      const result = await getAllInventories();

      expect(Inventory.find).toHaveBeenCalledOnce();
      expect(Inventory.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockInventories);
    });
  });

  describe("getAvailableInventories", () => {
    it("debería retornar solo inventarios con estado DISPONIBLE", async () => {
      const mockAvailable = [{ _id: "1", estado: "DISPONIBLE" }];

      Inventory.find.mockResolvedValue(mockAvailable);

      const result = await getAvailableInventories();

      expect(Inventory.find).toHaveBeenCalledWith({ estado: 'DISPONIBLE' });
      expect(result).toEqual(mockAvailable);
    });
  });

  describe("createInventory", () => {
    it("debería crear un nuevo inventario", async () => {
      const inventoryData = {
        pointSell: "60f9d8c3e4b0a123456789",
        cantidadDisponible: 100,
        precioPorKg: 16.5
      };

      const createdInventory = { _id: "new123", ...inventoryData };

      Inventory.create.mockResolvedValue(createdInventory);

      const result = await createInventory(inventoryData);

      expect(Inventory.create).toHaveBeenCalledWith(inventoryData);
      expect(result).toEqual(createdInventory);
    });
  });

  describe("updateInventoryById", () => {
    it("debería actualizar el inventario y agregar fechaActualizacion", async () => {
      const id = "60f9d8c3e4b0a123456789";
      const updateData = { cantidadDisponible: 50, precioPorKg: 17.0 };

      const updatedInventory = {
        _id: id,
        ...updateData,
        fechaActualizacion: new Date()
      };

      Inventory.findByIdAndUpdate.mockResolvedValue(updatedInventory);

      const result = await updateInventoryById(id, updateData);

      expect(Inventory.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { ...updateData, fechaActualizacion: expect.any(Date) },
        { new: true }
      );
      expect(result).toEqual(updatedInventory);
    });
  });

    describe("searchNearby", () => {
    it("debería buscar inventarios cercanos usando la fórmula de distancia", async () => {
      const latitude = -16.5;
      const longitude = -68.13;
      const maxDistance = 5000;

      const mockInventories = [
        { 
          _id: "inv1", 
          precioPorKg: 15,
          pointSell: { 
            latitude: -16.502, 
            longitude: -68.135 
          }
        }
      ];

      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockInventories)
      };

      Inventory.find.mockReturnValue(mockQuery);

      const result = await searchNearby(latitude, longitude, maxDistance);

      expect(Inventory.find).toHaveBeenCalledWith({ estado: 'DISPONIBLE' });
      expect(mockQuery.populate).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ precioPorKg: 1 });
      expect(result).toEqual(mockInventories);
    });

    it("debería filtrar inventarios sin pointSell", async () => {
      const mockData = [
        { pointSell: null },
        { 
          pointSell: { 
            latitude: -16.5, 
            longitude: -68.1 
          } 
        }
      ];

      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockData)
      };

      Inventory.find.mockReturnValue(mockQuery);

      const result = await searchNearby(-16.5, -68.13);

      expect(result.length).toBe(1);
      expect(result[0].pointSell).not.toBeNull();
    });
  });
});