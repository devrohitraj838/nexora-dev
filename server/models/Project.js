const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  // Links this specific project to the logged-in user
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  techStack: [{ 
    type: String // We save the stack as an array of strings
  }],
  status: { 
    type: String, 
    enum: ["Planned", "In Progress", "Completed"], 
    default: "Planned" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);