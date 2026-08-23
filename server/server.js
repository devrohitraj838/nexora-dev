require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dsaRoutes = require("./routes/dsaRoutes"); // Your new route!
const aiRoutes = require("./routes/aiRoutes");

// Initialize the app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// Add Middleware
app.use(cors());          
app.use(express.json());

// 3. Connect to Database
connectDB();

//standard routes
app.get("/", (req, res) => {
  res.send("🚀 Nexora Dev Backend Running...");
});

//Mount API Routes AFTER the app is initialized
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/ai", aiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});