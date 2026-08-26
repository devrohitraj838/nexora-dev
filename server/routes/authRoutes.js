const express = require("express");
const router = express.Router();


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


router.post("/onboard", protect, onboardUser); 

module.exports = router;