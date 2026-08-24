const Project = require("../models/Project");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, techStack, status } = req.body;

    // Create a new project linked specifically to the logged-in user
    // (req.user is provided by your auth middleware)
    const newProject = new Project({
      user: req.user.id, 
      title,
      description,
      techStack,
      status,
    });

    const savedProject = await newProject.save();
    res.status(201).json({ project: savedProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error creating project" });
  }
};

// Get all projects for the logged-in user
exports.getProjects = async (req, res) => {
  try {
    // Only find projects where the user matches the token, sorted newest first
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};