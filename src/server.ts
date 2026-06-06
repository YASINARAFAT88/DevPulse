import app from "./app";
import { pool } from "./config/db";

const PORT = 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

startServer();
