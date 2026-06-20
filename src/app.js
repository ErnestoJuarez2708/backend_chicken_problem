import express from "express";
import dotenv from "dotenv";
import { errorHandler, responseFormatter } from "./middlewares/formatingMiddleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import * as OpenApiValidator from "express-openapi-validator";
import pointSellRoutes from "./routes/pointSellRoutes.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(responseFormatter);

app.use("/api/sales-points", pointSellRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});