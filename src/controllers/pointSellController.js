import {
  getAllPointsSell,
  getPointSellById,
  createPointSell,
  replacePointSellById,
  deletePointSellById,
  getPointsSellByType,
  getPointsSellByState,
  getPointsSellByOwner
} from "../services/pointSellService.js";

import { validatePointSellBody } from "../utils/pointSellValidator.js";

// GET /api/sales-points
export async function findPointsSell(req, res, next) {
  const { type, state, owner } = req.query;

  let pointsSell;

  if (type) {
    pointsSell = await getPointsSellByType(type);
  } else if (state) {
    pointsSell = await getPointsSellByState(state);
  } else if (owner) {
    pointsSell = await getPointsSellByOwner(owner);
  } else {
    pointsSell = await getAllPointsSell();
  }

  if (pointsSell.length === 0) {
    return res.success(200, "No points of sale found with the specified criteria", []);
  }

  return res.success(200, "Points of sale retrieved successfully", pointsSell);
}

// GET /api/sales-points/:id
export async function findPointSellById(req, res, next) {
  const id = req.params.id;

  const pointSell = await getPointSellById(id);

  if (!pointSell) {
    const error = Error("Point of sale not found");
    error.statusCode = 404;
    return next(error);
  }

  return res.success(200, `Point of sale with id ${id} successfully retrieved`, pointSell);
}

// POST /api/sales-points
export async function savePointSell(req, res, next) {
  const validator = validatePointSellBody(req.body, true);

  if (!validator.validation) {
    const error = Error(validator.message);
    error.statusCode = 400;
    return next(error);
  }

  try {
    const newPointSell = await createPointSell({
      name: req.body.name,
      type: req.body.type,
      direction: req.body.direction,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      state: req.body.state || "PENDIENTE",
      owner: req.body.owner || req.user.id
    });

    return res.success(201, "Point of sale created successfully", newPointSell);
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
}

// PUT /api/sales-points/:id
export async function replacePointSell(req, res, next) {
  const id = req.params.id;

  const validator = validatePointSellBody(req.body, true);

  if (!validator.validation) {
    const error = Error(validator.message);
    error.statusCode = 400;
    return next(error);
  }

  try {
    const replacedPointSell = await replacePointSellById(id, {
      name: req.body.name,
      type: req.body.type,
      direction: req.body.direction,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      state: req.body.state,
      owner: req.body.owner
    });

    if (!replacedPointSell) {
      const error = Error(`Point of sale with id ${id} not found`);
      error.statusCode = 404;
      return next(error);
    }

    return res.success(
      200,
      `Point of sale with id ${id} successfully replaced`,
      replacedPointSell
    );
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
}

// DELETE /api/sales-points/:id
export async function deletePointSell(req, res, next) {
  const id = req.params.id;

  try {
    const deletedPointSell = await deletePointSellById(id);

    if (!deletedPointSell) {
      const error = Error(`Point of sale with id ${id} not found`);
      error.statusCode = 404;
      return next(error);
    }

    return res.success(
      200,
      `Point of sale with id ${id} successfully deleted`,
      deletedPointSell
    );
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
}
