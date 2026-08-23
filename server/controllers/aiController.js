const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getDailyInsight = async (req, res) => {
  try {
    const { 
      userName = "Developer", 
      commitsCount = 0, 
      projectsCount = 0, 
      dsaCount = 0,
      latestProject = "None yet",
      latestDsa = "None yet",
      latestRepo = "None yet"
    } = req.body || {};

    const prompt = `
      You are an AI developer mentor inside a dashboard for a developer named ${userName}.
      
      Current developer metrics:
      - Total GitHub Commits: ${commitsCount} (Most recent repo: ${latestRepo})
      - Portfolio Projects: ${projectsCount} (Most recent project: ${latestProject})
      - DSA Problems Solved: ${dsaCount} (Most recent problem: ${latestDsa})
      
      Write a concise, 2-sentence motivational insight for them today.
      Reference their specific recent activity or numbers naturally. Keep it encouraging, practical, and casual.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({ insight: response.text });
  } catch (error) {
    console.error("AI Generation Error Details:", error);
    // Return a 200 with a fallback insight so the frontend UI doesn't crash
    res.status(200).json({ 
      insight: "Consistency is key. Keep building, logging your problems, and shipping code every single day!" 
    });
  }
};

module.exports = { getDailyInsight };