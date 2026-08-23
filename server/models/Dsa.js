const mongoose = require("mongoose");

const dsaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      enum: ["LeetCode", "HackerRank", "GeeksforGeeks", "Codeforces", "Other"],
      default: "LeetCode",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    topic: {
      type: String, // e.g., "Arrays", "Dynamic Programming", "Graphs"
      default: "General",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // This automatically records the date you solved it!
  }
);

module.exports = mongoose.model("Dsa", dsaSchema);