const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false, 
    unique: true,
    sparse: true 
  },
  password: {
    type: String,
    required: false, 
  },
  githubId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  githubUsername: { 
    type: String 
  },
  avatar: { 
    type: String 
  },

  isOnboarded: {
    type: Boolean,
    default: false
  },
  profile: {
    role: { type: String, default: "Student" },
    year: { type: String, default: "1st Year" },
    goal: { type: String, default: "Internship" }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);