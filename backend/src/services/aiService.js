const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    // Updated to the working Gemini 3 model name
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    });
  }

  async analyzeIncident(title, description) {
    const prompt = `
      You are a Senior SOC Analyst. Analyze this incident:
      Title: ${title}
      Details: ${description}

      Provide response in this EXACT format:
      ROOT CAUSE: [One sentence]
      FIX: [One sentence]
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const rootCauseMatch = text.match(/ROOT CAUSE:\s*(.*)/i);
      const fixMatch = text.match(/FIX:\s*(.*)/i);

      return {
        root_cause: rootCauseMatch ? rootCauseMatch[1].trim() : "Analysis pending deeper inspection.",
        suggested_fix: fixMatch ? fixMatch[1].trim() : "Initiate standard security response."
      };
    } catch (err) {
      console.error("Gemini Error:", err.message);
      return {
        root_cause: "AI Engine connectivity issue.",
        suggested_fix: "Check container internet access or API quota."
      };
    }
  }
}

module.exports = new AIService();