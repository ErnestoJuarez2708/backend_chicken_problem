
import { Router } from "express";
import { getAvailabilityStatistics, getPriceStatistics } from "../controllers/statisticsController.js";
import { authenticationMiddleware, authorizationMiddleware } from "../middlewares/authenticationMiddleware.js";


const router = Router();

router.get('/prices', 
    authenticationMiddleware, 
    authorizationMiddleware(["ADMIN"]), 
    getPriceStatistics)

router.get('/availability', 
    authenticationMiddleware, 
    authorizationMiddleware(["ADMIN"]),
    getAvailabilityStatistics)

export default router