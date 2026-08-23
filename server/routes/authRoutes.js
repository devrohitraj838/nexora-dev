const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  githubAuth,
  githubCallback,
} = require("../controllers/authController");

// Standard Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// GitHub OAuth Routes
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

module.exports = router;