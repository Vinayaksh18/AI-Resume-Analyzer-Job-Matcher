export const buildAnalysisPrompt = (resumeText) => ({
  system: `You are an expert resume analyst and career coach with 15+ years of hiring experience across tech, finance, and business. Analyze the resume and return ONLY a valid JSON object — no markdown, no explanation, no preamble.`,

  user: `Analyze this resume and return ONLY this exact JSON structure:

{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "experience_years": <number>,
  "skills": {
    "technical": ["...", "..."],
    "soft": ["...", "..."],
    "tools": ["...", "..."]
  },
  "experience": [
    {
      "company": "...",
      "role": "...",
      "duration": "...",
      "highlights": ["...", "..."]
    }
  ],
  "education": [
    {
      "institution": "...",
      "degree": "...",
      "year": "..."
    }
  ],
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "ats_checks": {
    "has_contact_info": true,
    "has_measurable_results": true,
    "no_tables_or_columns": true,
    "uses_standard_headings": true,
    "no_photos_or_graphics": true
  },
  "improvement_tips": ["...", "..."]
}

Resume text:
"""
${resumeText}
"""`,
});