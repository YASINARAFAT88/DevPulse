import express from "express";
import cors from "cors";
import globalErrorHandler from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";

const app = express();



app.get("/", (req, res) => {
  res.send("DevPulse API Running");
});
app.use(cors());
app.use(express.json());
app.use(globalErrorHandler);

app.use("/api/auth", authRoutes);


export default app;