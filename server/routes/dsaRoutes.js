const express = require("express");
const router = express.Router();
const { getDsaProblems, logDsaProblem } = require("../controllers/dsaController");
const { protect } = require("../middleware/authMiddleware");


router.route("/")
  .get(protect, getDsaProblems)
  .post(protect, logDsaProblem);

module.exports = router;