import { PointSell } from "../data/pointSell.js";

export async function getAllPointsSell() {
  const pointsSell = await PointSell.find();
  return pointsSell;
}

export async function getPointSellById(id) {
  const pointSell = await PointSell.findById(id);
  return pointSell;
}

export async function createPointSell(pointSellData) {
  const newPointSell = await PointSell.create(pointSellData);
  return newPointSell;
}

export async function replacePointSellById(id, replacementData) {
  const replacedPointSell = await PointSell.findByIdAndUpdate(
    id,
    replacementData,
    { new: true, runValidators: true }
  );
  return replacedPointSell;
}

export async function deletePointSellById(id) {
  const deletedPointSell = await PointSell.findByIdAndDelete(id);
  return deletedPointSell;
}

export async function getPointsSellByType(type) {
  const pointsSell = await PointSell.find({ type });
  return pointsSell;
}

export async function getPointsSellByState(state) {
  const pointsSell = await PointSell.find({ state });
  return pointsSell;
}

export async function getPointsSellByOwner(ownerId) {
  const pointsSell = await PointSell.find({ owner: ownerId });
  return pointsSell;
}
