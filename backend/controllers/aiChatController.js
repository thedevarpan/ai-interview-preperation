const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const handleChat = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const text = response.text || "No reply.";

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error.message || error);
    res.status(500).json({ error: "Failed to get Gemini response" });
  }
};

module.exports = { handleChat };