const express = require("express");
const router = express.Router();
const { getDailyInsight } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/insights", protect, getDailyInsight);

module.exports = router;