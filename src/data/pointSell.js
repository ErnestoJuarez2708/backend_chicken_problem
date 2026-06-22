import mongoose from "mongoose";

const pointSellSchema = new mongoose.Schema({
    name: String,
    type: {
      type: String,
      enum: ["FIJO", "MOVIL"],
      required: true
    },
    direction: String,
    latitude: Number,
    longitude: Number,
    state: {
      type: String,
      enum: ["ACTIVO", "INACTIVO", "PENDIENTE"],
      default: "PENDIENTE"
    },
    owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "BUYER", 
    required: true 
    }
}, { timestamps: true });

export const PointSell = mongoose.model("PointSell", pointSellSchema);