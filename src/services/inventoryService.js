import { Inventory } from "../data/inventory.js";

export async function getAllInventories() {
  const inventories = await Inventory.find().populate('pointSell');
  return inventories;
}

export async function getAvailableInventories() {
  const inventories = await Inventory.find({ estado: 'DISPONIBLE' }).populate('pointSell');
  return inventories;
}

export async function createInventory(inventoryData) {
  const newInventory = await Inventory.create(inventoryData);
  return await newInventory.populate('pointSell');
}

export async function updateInventoryById(id, updateData) {
  const updatedInventory = await Inventory.findByIdAndUpdate(
    id,
    { ...updateData, fechaActualizacion: new Date() },
    { new: true }
  ).populate('pointSell');
  return updatedInventory;
}

export async function searchNearby(latitude, longitude, maxDistance = 5000) {
  // busca puntos de venta cercanos con inventario disponible
  const inventories = await Inventory.find({ estado: 'DISPONIBLE' })
    .populate({
      path: 'pointSell',
      match: {
        $expr: {
          $lte: [
            {
              $sqrt: {
                $add: [
                  { $pow: [{ $subtract: ['$latitude', latitude] }, 2] },
                  { $pow: [{ $subtract: ['$longitude', longitude] }, 2] }
                ]
              }
            },
            maxDistance / 111000 // aproximación: 1 grado ≈ 111 km
          ]
        }
      }
    })
    .sort({ precioPorKg: 1 });

  return inventories.filter(inv => inv.pointSell !== null);
}
