const Dsa = require("../models/Dsa");


const getDsaProblems = async (req, res) => {
  try {
    const problems = await Dsa.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const logDsaProblem = async (req, res) => {
  try {
    const { title, platform, difficulty, topic } = req.body;

    const problem = await Dsa.create({
      title,
      platform,
      difficulty,
      topic,
      user: req.user.id,
    });

    res.status(201).json({ message: "Problem logged successfully", problem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDsaProblems,
  logDsaProblem,
};