import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import { errorHandler } from "./utils/errorHandler.js";
import path from "path";

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", routes);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
