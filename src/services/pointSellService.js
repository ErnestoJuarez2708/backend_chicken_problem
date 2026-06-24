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


export async function getNearestPointsell({ lat, long }) {

  const ORS_API_KEY = process.env.ORS_API_KEY;

  const pointsSell = await PointSell.find();

  const routes = await Promise.all(
    pointsSell.map(async (pointSell) => {
      try {
        const response = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            method: "POST",
            headers: {
              Authorization: ORS_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coordinates: [
                [Number(long), Number(lat)], // start [lng, lat]
                [
                  Number(pointSell.longitude),
                  Number(pointSell.latitude),
                ], // destination [lng, lat]
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`ORS request failed: ${response.status}`);
        }

        const data = await response.json();

        const summary = data?.routes?.[0]?.summary;

        return {
          pointSell,
          distance: summary?.distance ?? Number.MAX_SAFE_INTEGER,
          duration: summary?.duration ?? Number.MAX_SAFE_INTEGER,
        };
      } catch (error) {
        console.error(
          `Failed to calculate route for PointSell ${pointSell._id}`,
          error
        );

        return {
          pointSell,
          distance: Number.MAX_SAFE_INTEGER,
          duration: Number.MAX_SAFE_INTEGER,
        };
      }
    })
  );

  return routes
    .sort((a, b) => a.duration - b.duration)
    .slice(0, 3);
}