
import bcrypt from "bcrypt";
import {User} from "../data/user.js";
import jwt from "jsonwebtoken";

const HASH_SALT_ROUNDS = 10;

const signJwt = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const registerService = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, HASH_SALT_ROUNDS);

        const user = new User({
            ...userData,
            password: hashedPassword
        });

        await user.save();

        const token = signJwt({
            id: user._id, name: user.name, role: user.role
        });

        return { name: user.name, token };
    } catch (error) {
        throw new Error("Error registering user: " + error.message);
    }
}

export const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user)
            throw new Error("Invalid email or password");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new Error("Invalid email or password");

        const token = signJwt({
            id: user._id, name: user.name, role: user.role
        });

        return { name: user.name, token };
    } catch (error) {
        throw new Error("Error logging in: " + error.message);
    }
}

export const existUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return !!user;
    } catch (error) {
        throw new Error("Error checking user existence: " + error.message);
    }
}
