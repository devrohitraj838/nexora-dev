require("dotenv").config();

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});