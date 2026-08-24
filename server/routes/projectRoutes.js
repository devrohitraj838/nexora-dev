const express = require("express");
const router = express.Router();
const { createProject, getProjects } = require("../controllers/projectController");

// This imports the middleware you already built for your auth routes
const { protect } = require("../middleware/authMiddleware"); 

// Both routes use the 'protect' middleware to ensure a valid token is present
router.route("/")
  .post(protect, createProject)
  .get(protect, getProjects);

module.exports = router;