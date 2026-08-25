const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getDailyInsight = async (req, res) => {
  try {
    const {
      userName = "Developer",
      // --- NEW FIELDS ---
      role = "Student",
      year = "1st Year",
      goal = "Internship",
      // ------------------
      commitsCount = 0,
      projectsCount = 0,
      dsaCount = 0,
      latestProject = "None yet",
      latestDsa = "None yet",
      latestRepo = "None yet"
    } = req.body || {};

    const prompt = `
      You are an elite AI career mentor. 
      Mentee Profile: ${userName} is a ${year} ${role} whose primary goal is: ${goal}.
      
      Current developer metrics:
      - GitHub Commits: ${commitsCount} (Most recent repo: ${latestRepo})
      - Portfolio Projects: ${projectsCount} (Most recent project: ${latestProject})
      - DSA Problems Solved: ${dsaCount} (Most recent problem: ${latestDsa})

      Analyze their metrics and goals. Return exactly THREE highly actionable, distinct pieces of advice.
      
      CRITICAL: You must return ONLY a raw, valid JSON object. Do not include markdown formatting, do not include \`\`\`json, and do not include any conversational text.

      Use this exact JSON schema:
      {
        "focus": "1 short, punchy sentence on their overarching priority today to reach their specific goal.",
        "dsaAdvice": "1 specific DSA topic or pattern they should tackle next based on their latest problem.",
        "projectAdvice": "1 highly specific, technical step to improve their latest project or portfolio."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Clean the response just in case Gemini accidentally adds markdown code blocks
    let rawText = response.text.trim();
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Parse the string into an actual JSON object
    const parsedInsight = JSON.parse(rawText);

    // Send the JSON object back to the frontend
    res.status(200).json(parsedInsight);
  } catch (error) {
    console.error("AI Generation Error Details:", error);
    
    // Fallback JSON so the frontend Action Hub doesn't crash
    res.status(200).json({
      focus: "Consistency is key. Keep logging your daily activity.",
      dsaAdvice: "Review the foundational patterns of Arrays and Strings.",
      projectAdvice: "Ensure your latest GitHub repository has a strong README.md."
    });
  }
};

module.exports = { getDailyInsight };