import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import router from "./router/routers";
import { PORT } from "./config/system.variable";
import { mongoConnection } from "./config/db.connection";
import { handleCustomError } from "./midddleware/errorHandler.midleware";

const app = express();

app.use(express.json());

app.use("/api/v1", router);

app.use(handleCustomError);

mongoConnection();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
