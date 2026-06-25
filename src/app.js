import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import * as OpenApiValidator from "express-openapi-validator";

import { errorHandler, responseFormatter } from "./middlewares/formatingMiddleware.js";

import pointSellRoutes from "./routes/pointSellRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import statisticRoutes from "./routes/statisticsRoutes.js";

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware de formato de respuestas
app.use(responseFormatter);

// Swagger UI
const openApiDocument = YAML.load("./docs/api.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// OpenAPI Validator
app.use(OpenApiValidator.middleware({
  apiSpec: "./docs/api.yaml",
  validateRequests: true,
  validateResponses: false,
}));

// Rutas
app.use("/api/sales-points", pointSellRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/statistics", statisticRoutes);

// Middleware de errores (debe ir al final)
app.use(errorHandler);

export default app;