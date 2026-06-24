import { User } from "../data/user.js";

export const getUsersService = async (roles, active) => {
    try {
        const filterOptions = {
            ...(roles && { roles: { $in: roles } }),
            ...(active !== undefined && { active })
        }
        const users = await User.find(filterOptions);
        return users;
    } catch (error) {
        throw error;
    }
}

export const getUserByIdService = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw error;
    }
}

export const updateUserByIdService = async (id, updateData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id, updateData, { new: true });
        return updatedUser;
    } catch (error) {
        throw error;
    }
}