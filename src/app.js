import express from "express";
import dotenv from "dotenv";
import { errorHandler, responseFormatter } from "./middlewares/formatingMiddleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import * as OpenApiValidator from "express-openapi-validator";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(responseFormatter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});