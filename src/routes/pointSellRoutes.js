import { Router } from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware
} from "../middlewares/authenticationMiddleware.js";

import {
  findPointsSell,
  findPointSellById,
  savePointSell,
  replacePointSell,
  deletePointSell
} from "../controllers/pointSellController.js";

const pointSellRoutes = Router();

pointSellRoutes.get("/", findPointsSell);
pointSellRoutes.get("/:id", findPointSellById);

pointSellRoutes.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(["VENDEDOR", "ADMIN"]),
  savePointSell
);

// PUT - Requiere autenticación (Vendedor o Admin)
pointSellRoutes.put(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(["VENDEDOR", "ADMIN"]),
  replacePointSell
);

// DELETE - Requiere autenticación (Admin)
pointSellRoutes.delete(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(["ADMIN"]),
  deletePointSell
);

export default pointSellRoutes;

