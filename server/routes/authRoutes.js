const express = require("express");
const router = express.Router();

// 1. Destructure 'protect' with curly braces because it was exported as an object
const { protect } = require("../middleware/authMiddleware"); 

const {
  registerUser,
  loginUser,
  githubAuth,
  githubCallback,
  onboardUser
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

// 2. Use 'protect' instead of 'authMiddleware'
router.post("/onboard", protect, onboardUser); 

module.exports = router;