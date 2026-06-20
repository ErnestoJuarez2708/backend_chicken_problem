import mongoose from "mongoose";
import { PointSell } from "./pointSell.js";

const inventorySchema = new mongoose.Schema({
    pointSell: PointSell,
    quantityAvailable: Number,
    priceByKG: Number,
    state: String,
    updateAt: Date
});

export const Inventory = mongoose.model("Inventory", inventorySchema);