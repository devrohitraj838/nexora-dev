const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  
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
    type: String 
  }],
  status: { 
    type: String, 
    enum: ["Planned", "In Progress", "Completed"], 
    default: "Planned" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);