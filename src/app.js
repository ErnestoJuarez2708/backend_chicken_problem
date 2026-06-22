import express from "express";
import dotenv from "dotenv";
import { errorHandler, responseFormatter } from "./middlewares/formatingMiddleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import * as OpenApiValidator from "express-openapi-validator";
import pointSellRoutes from "./routes/pointSellRoutes.js";
import { connectToMongoDB } from "./data/mongoConnection.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

await connectToMongoDB();

const openApiDocument = YAML.load("./src/docs/api.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(express.json());

app.use(responseFormatter);

app.use("/api/sales-points", pointSellRoutes);

app.use(OpenApiValidator.middleware({
  apiSpec: "./src/docs/api.yaml",
  validateRequests: true,
  validateResponses: false,
}));

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});