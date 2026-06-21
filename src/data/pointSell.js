import mongoose from "mongoose";
//TODO: Importar User y ponerlo en owner: User

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
    owner: String,
    updatedAt: Date
});

export const PointSell = mongoose.model("PointSell", pointSellSchema);