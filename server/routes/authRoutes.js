const express = require("express");
const router = express.Router();

// 1. Import your auth middleware (Ensure the variable name matches what you exported in authMiddleware.js)
const authMiddleware = require("../middleware/authMiddleware"); 

const {
  registerUser,
  loginUser,
  githubAuth,
  githubCallback,
  onboardUser // <-- 2. Added this import
} = require("../controllers/authController");

// Standard Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// GitHub OAuth Routes
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

// Profile Onboarding Route
// 3. Added the POST route, protected by the middleware
router.post("/onboard", authMiddleware, onboardUser); 

module.exports = router;