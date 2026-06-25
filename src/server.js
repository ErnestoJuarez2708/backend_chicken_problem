import dotenv from "dotenv";
import { connectToMongoDB } from "./data/mongoConnection.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToMongoDB();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger UI disponible en: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();