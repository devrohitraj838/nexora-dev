const express = require("express");
const router = express.Router();
const { getDailyInsight } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// Using POST so we can securely send the stats in the request body
router.post("/insight", protect, getDailyInsight);

module.exports = router;