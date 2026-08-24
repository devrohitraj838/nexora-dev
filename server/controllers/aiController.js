const Groq = require("groq-sdk");

// Initialize Groq with the new environment variable
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

    // Make the call to Groq using the newly supported model
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b", // <-- THIS IS THE ONLY CHANGE
    });

    // Extract the response text
    const aiText = chatCompletion.choices[0]?.message?.content || "Keep building!";

    res.status(200).json({ insight: aiText });
  } catch (error) {
    console.error("Groq AI Generation Error Details:", error);
    // Return a 200 with a fallback insight so the frontend UI doesn't crash
    res.status(200).json({ 
      insight: "Consistency is key. Keep building, logging your problems, and shipping code every single day!" 
    });
  }
};

module.exports = { getDailyInsight };