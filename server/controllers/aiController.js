const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getDailyInsight = async (req, res) => {
  try {
    const {
      userName = "Developer",
      role = "Student",
      year = "1st Year",
      goal = "Internship",
      commitsCount = 0,
      projectsCount = 0,
      dsaCount = 0,
      latestProject = "None yet",
      latestDsa = "None yet",
      latestRepo = "None yet"
    } = req.body || {};

    const prompt = `
      You are an elite, highly personalized AI career mentor for software developers. 
      Mentee Profile: ${userName} is a ${year} ${role} targeting: ${goal}.
      
      Live Developer Telemetry:
      - GitHub Activity: ${commitsCount} commits recorded. Most recent repository actively worked on: "${latestRepo}".
      - Portfolio Workspace: ${projectsCount} projects built. Most recent project title: "${latestProject}".
      - Problem-Solving Log: ${dsaCount} total problems solved. Most recent problem tackled: "${latestDsa}".

      Analyze these specific data points against their target (${goal}).
      Provide feedback referencing their recent project ("${latestProject}") and recent repository ("${latestRepo}") where applicable.

      Follow this exact JSON structure:
      {
        "focus": "1 short, punchy sentence addressing ${userName} directly regarding their absolute #1 execution priority today based on their ${goal}.",
        "dsaAdvice": "1 specific DSA pattern they should master next, building directly upon their experience with ${latestDsa}.",
        "projectAdvice": "1 highly specific, technical architectural upgrade or feature they should add to their project '${latestProject}' or repo '${latestRepo}'."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text ? response.text.trim() : "{}";
    const parsedInsight = JSON.parse(rawText);
    
    return res.status(200).json(parsedInsight);
  } catch (error) {
    console.error("AI Generation Error Details:", error);
    return res.status(200).json({
      focus: "Consistency is key. Keep logging your daily activity.",
      dsaAdvice: "Review the foundational patterns of Arrays and Strings.",
      projectAdvice: "Ensure your latest GitHub repository has a strong README.md."
    });
  }
};

module.exports = { getDailyInsight };