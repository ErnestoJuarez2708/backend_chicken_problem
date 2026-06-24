import { Router } from "express";
import { getUsersController, getUserByIdController, updateUserByIdController, updateMyProfileController, getMyProfileController } from "../controllers/userController.js";
import { authenticationMiddleware, authorizationMiddleware } from "../middlewares/authenticationMiddleware.js";

const router = Router()

router.use(authenticationMiddleware);

router.get("/", authorizationMiddleware(["ADMIN"]),
    getUsersController);
router.get("/:id", authorizationMiddleware(["ADMIN"]),
    getUserByIdController);
router.patch("/:id", authorizationMiddleware(["ADMIN"]),
    updateUserByIdController);

router.patch('/my-profile', 
    authorizationMiddleware(["USER", "ADMIN", "VENDOR"]), 
    updateMyProfileController);

router.get('/my-profile', 
    authorizationMiddleware(["USER", "ADMIN", "VENDOR"]), 
    getMyProfileController);

export default router;