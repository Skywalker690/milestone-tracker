import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

export interface SuggestedMilestone {
  title: string;
  description: string;
  daysFromNow: number;
}

export const geminiService = {
  suggestBreakdown: async (goal: string): Promise<SuggestedMilestone[]> => {
    const ai = getAiClient();
    if (!ai) {
      throw new Error("AI Client not initialized");
    }

    const prompt = `
      I have a main goal: "${goal}".
      Break this down into 3-5 concrete, actionable milestones.
      For each milestone, provide a title, a short description, and a suggested number of days from today to achieve it (logic progression).
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                daysFromNow: { type: Type.INTEGER },
              },
              required: ["title", "description", "daysFromNow"],
            },
          },
        },
      });

      const text = response.text;
      if (!text) return [];

      return JSON.parse(text) as SuggestedMilestone[];
    } catch (error) {
      console.error("Gemini suggestion failed:", error);
      throw error;
    }
  },

  generateMotivation: async (completedCount: number): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "Keep pushing forward! You're doing great.";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a short, punchy, 1-sentence motivational quote for a user who has completed ${completedCount} milestones. Avoid using Markdown formatting.`,
      });

      return (response.text || "Great job on your progress!")
        .replace(/\*\*/g, ""); // <-- FIX
    } catch (e) {
      return "Every step counts!";
    }
  }

};