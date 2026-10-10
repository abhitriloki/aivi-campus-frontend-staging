const { GoogleGenerativeAI } = require("./functions/node_modules/@google/generative-ai");

const systemPrompt = `You are an expert ATS resume reviewer and career strategist. Analyze the user's resume and return a strict JSON object with scores out of 100, bullet rewrite suggestions, missing keywords, and overall feedback.
Output JSON schema:
{
  "atsScore": 85,
  "summary": "Strong resume with clear experience.",
  "strengths": ["Clear formatting", "Good action verbs"],
  "improvements": ["Add quantified metrics"],
  "rewrites": [{"original": "Worked on React app", "improved": "Architected responsive React SPA serving 10k users"}]
}`;

const userMessage = "Analyze this resume:\n\nSoftware Engineer with 4 years experience in React, TypeScript, Node.js and AWS.";

async function testCallGemini() {
  const apiKey = "AQ.Ab8RN6K3nj1egAfr4i_iRNsHp0sKfPssWJY6wsa7ajVkqaanyg";
  try {
    console.log("Initializing GoogleGenerativeAI with key...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    console.log("Generating content...");
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const text = response.response.text();
    console.log("SUCCESS! Response text preview:", text.substring(0, 300));
  } catch (err) {
    console.error("EXACT GEMINI SDK ERROR:", err);
  }
}

testCallGemini();
