import openai from "../config/openai.js";
import { buildAnalysisPrompt } from "../prompts/analyzeResume.js";

export const analyzeResume = async (resumeText) => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Resume text is too short - Cannot analyze");
  }

  const {system, user} = buildAnalysisPrompt(resumeText);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.3,
    max_tokens: 1500
  });

  const raw = response.choices[0].message.content;

  try{
    return JSON.parse(raw);
  } catch{
    throw new Error("Failed to parse analysis response as JSON: " + raw);
  }
};
