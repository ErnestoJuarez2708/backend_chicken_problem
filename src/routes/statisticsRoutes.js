
import { Router } from "express";
import { getAvailabilityStatistics, getPriceStatistics } from "../controllers/statisticsController.js";
import { authenticationMiddleware, authorizationMiddleware } from "../middlewares/authenticationMiddleware.js";


const router = Router();

router.use(authenticationMiddleware, authorizationMiddleware(["ADMIN"]));

router.get('/prices', getPriceStatistics)

router.get('/availability', getAvailabilityStatistics)

export default router