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
  deletePointSell,
  nearestPointSell
} from "../controllers/pointSellController.js";

const pointSellRoutes = Router();

pointSellRoutes.get('/near-me', nearestPointSell);

pointSellRoutes.get("/", findPointsSell);
pointSellRoutes.get("/:id", findPointSellById);

pointSellRoutes.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(["SELLER", "ADMIN"]),
  savePointSell
);

pointSellRoutes.put(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(["SELLER", "ADMIN"]),
  replacePointSell
);

pointSellRoutes.delete(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(["ADMIN"]),
  deletePointSell
);

export default pointSellRoutes;

