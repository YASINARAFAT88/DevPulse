import express from "express";
import cors from "cors";
import globalErrorHandler from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import auth from "./middleware/auth.middleware"; // Temp

const app = express();


app.get("/", (req, res) => {
  res.send("DevPulse API Running");
});

app.get("/api/test", auth, (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
); // Temporary route to test auth middleware

app.use(cors());
app.use(express.json());
app.use(globalErrorHandler);

app.use("/api/auth", authRoutes);


export default app;