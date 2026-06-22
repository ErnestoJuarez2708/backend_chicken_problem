import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["ADMIN", "SELLER", "BUYER"],
        default: "BUYER"
    },
    active: Boolean
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);