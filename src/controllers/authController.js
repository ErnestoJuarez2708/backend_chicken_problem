import { existUserByEmail, loginService, registerService } from "../services/authService.js";
import { errorBuilder } from "../utils/errorBuilder.js";


export const registerController = async (req, res, next) => {
    try {
        if(await existUserByEmail(req.body.email)) 
            return next(errorBuilder("Email already in use", 400));
        
        const user = await registerService(req.body);
        return res.success(201, "User registered successfully", user);

    } catch (error) {
        next(error);
    }
}

export const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await loginService(email, password);
        return res.success(200, "User logged in successfully", user);
    } catch (error) {
        next(error);
    }
}
