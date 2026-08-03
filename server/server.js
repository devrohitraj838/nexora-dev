
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect Database
connectDB();

app.get("/", (req, res) => {
  res.send("🚀 Nexora Dev Backend Running...");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});