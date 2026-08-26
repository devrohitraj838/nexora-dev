const Project = require("../models/Project");


exports.createProject = async (req, res) => {
  try {
    const { title, description, techStack, status } = req.body;

  
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


exports.getProjects = async (req, res) => {
  try {

    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};