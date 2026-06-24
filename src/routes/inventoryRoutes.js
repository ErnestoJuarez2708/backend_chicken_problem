import { Router } from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware
} from "../middlewares/authenticationMiddleware.js";

import {
  findAllInventories,
  findAvailableInventories,
  findNearbyInventories,
  saveInventory,
  updateInventory
} from "../controllers/inventoryController.js";

const inventoryRoutes = Router();

// Public routes
inventoryRoutes.get("/", findAllInventories);
inventoryRoutes.get("/available", findAvailableInventories);
inventoryRoutes.get("/nearby", findNearbyInventories);

// Protected routes - Vendedor y Admin pueden crear/actualizar
inventoryRoutes.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(["SELLER", "ADMIN"]),
  saveInventory
);

inventoryRoutes.patch(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(["SELLER", "ADMIN"]),
  updateInventory
);

export default inventoryRoutes;