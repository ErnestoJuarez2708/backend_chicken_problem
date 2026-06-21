import mongoose from "mongoose";
import { PointSell } from "./pointSell.js";

const historyPriceSchema = new mongoose.Schema({
    pointSell: PointSell,
    priceOld: Number,
    priceNew: Number,
    dateChange: Date
});

export const HistoryPrice = mongoose.model("HistoryPrice", historyPriceSchema);