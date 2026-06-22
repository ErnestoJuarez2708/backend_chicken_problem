
import { getUsersService, getUserByIdService, updateUserByIdService } from "../services/userService.js";
import { errorBuilder } from "../utils/errorBuilder.js";

export const getUsersController = async (req, res, next) => {
    try {
        const users = await getUsersService();
        return res.success(200, "Users retrieved successfully", users);
    } catch (error) {
        next(error);
    }
}

export const getUserByIdController = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await getUserByIdService(id);
        if (!user) return next(errorBuilder("User not found", 404));
        return res.success(200, "User retrieved successfully", user);
    } catch (error) {
        next(error);
    }
}

export const updateUserByIdController = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedUser = await updateUserByIdService(id, req.body);
        if (!updatedUser) return next(errorBuilder("User not found", 404));
        return res.success(200, "User updated successfully", updatedUser);
    } catch (error) {
        next(error);
    }
}

export const updateMyProfileController = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const updatedUser = await updateUserByIdService(userId, req.body);
        if (!updatedUser) return next(errorBuilder("User not found", 404));
        return res.success(200, "Profile updated successfully", updatedUser);
    } catch (error) {
        next(error);
    }
}

export const getMyProfileController = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const user = await getUserByIdService(userId);
        if (!user) return next(errorBuilder("User not found", 404));
        return res.success(200, "Profile retrieved successfully", user);
    } catch (error) {
        next(error);
    }
}