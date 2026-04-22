import { GoogleGenAI  } from '@google/genai';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/httpError.js';

const generateStudyPlan = asyncHandler(async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new HttpError(500, "Gemini API key is not configured.");
  }

  const { prompt } = req.body;
  if (!prompt) {
    throw new HttpError(400, "Prompt is required.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      data: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new HttpError(500, "Failed to generate AI response.");
  }
});

export { generateStudyPlan,
 };
