import express from "express";
import cors from "cors";
import globalErrorHandler from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import issueRoutes from "./modules/issues/issue.routes";
import notFoundHandler from "./middleware/notFound.middleware";

const app = express();


app.get("/", (req, res) => {
  res.send("DevPulse API Running");
});

app.use(cors());
app.use(express.json());
app.use("/api/issues", issueRoutes );

app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);


export default app;