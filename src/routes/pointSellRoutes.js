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

pointSellRoutes.get(
  '/near-me',
  authenticationMiddleware,
  authorizationMiddleware(["BUYER"]),
  nearestPointSell
)

export default pointSellRoutes;

