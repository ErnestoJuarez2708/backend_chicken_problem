import {
  getAllInventories,
  getAvailableInventories,
  createInventory,
  updateInventoryById,
  searchNearby
} from "../services/inventoryService.js";

import { validateInventoryBody } from "../utils/inventoryValidator.js";

// GET /api/inventory
export async function findAllInventories(req, res, next) {
  try {
    const inventories = await getAllInventories();
    
    if (inventories.length === 0) {
      return res.success(200, "No inventories found", []);
    }

    return res.success(200, "Inventories retrieved successfully", inventories);
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
}

// GET /api/inventory/available
export async function findAvailableInventories(req, res, next) {
  try {
    const inventories = await getAvailableInventories();

    if (inventories.length === 0) {
      return res.success(200, "No available inventories found", []);
    }

    return res.success(200, "Available inventories retrieved successfully", inventories);
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
}

// GET /api/inventory/nearby?lat=<latitude>&lon=<longitude>&distance=<maxDistance>
export async function findNearbyInventories(req, res, next) {
  const { lat, lon, distance } = req.query;

  if (!lat || !lon) {
    const error = Error("Latitude and longitude are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const latitude = Number(lat);
    const longitude = Number(lon);
    const maxDistance = distance ? Number(distance) : 5000;

    if (isNaN(latitude) || isNaN(longitude)) {
      const error = Error("Invalid latitude or longitude");
      error.statusCode = 400;
      return next(error);
    }

    const inventories = await searchNearby(latitude, longitude, maxDistance);

    if (inventories.length === 0) {
      return res.success(200, "No inventories found nearby", []);
    }

    return res.success(200, "Nearby inventories retrieved successfully", inventories);
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
}

// POST /api/inventory
export async function saveInventory(req, res, next) {
  const validator = validateInventoryBody(req.body, true);

  if (!validator.validation) {
    const error = Error(validator.message);
    error.statusCode = 400;
    return next(error);
  }

  try {
    const newInventory = await createInventory({
      pointSell: req.body.pointSell,
      cantidadDisponible: req.body.cantidadDisponible,
      precioPorKg: req.body.precioPorKg,
      estado: req.body.estado || "DISPONIBLE"
    });

    return res.success(201, "Inventory created successfully", newInventory);
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
}

// PATCH /api/inventory/:id
export async function updateInventory(req, res, next) {
  const id = req.params.id;

  try {
    // Validate only the fields being updated
    const updateValidator = validateInventoryBody(req.body, false);

    if (!updateValidator.validation) {
      const error = Error(updateValidator.message);
      error.statusCode = 400;
      return next(error);
    }

    const updatedInventory = await updateInventoryById(id, req.body);

    if (!updatedInventory) {
      const error = Error(`Inventory with id ${id} not found`);
      error.statusCode = 404;
      return next(error);
    }

    return res.success(200, "Inventory updated successfully", updatedInventory);
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
}