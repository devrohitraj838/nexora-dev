const express = require("express");
const router = express.Router();
const { getDsaProblems, logDsaProblem } = require("../controllers/dsaController");
const { protect } = require("../middleware/authMiddleware");

// Apply the protect middleware so can add your problems
router.route("/")
  .get(protect, getDsaProblems)
  .post(protect, logDsaProblem);

module.exports = router;