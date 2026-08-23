const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // Note: Some GitHub users have private emails, so keeping this optional or sparse is safe
    required: false, 
    unique: true,
    sparse: true 
  },
  password: {
    type: String,
    required: false, // <-- THIS IS THE FIX
  },
  // The new GitHub fields you added earlier
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
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);