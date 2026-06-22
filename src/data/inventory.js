import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  pointSell: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PointSell',
    required: true
  },
  cantidadDisponible: Number,
  precioPorKg: Number,
  estado: {
    type: String,
    enum: ['DISPONIBLE', 'AGOTADO'],
    default: 'DISPONIBLE'
  },
  fechaActualizacion: Date
}, { timestamps: true });

export const Inventory = mongoose.model('Inventory', inventorySchema);
