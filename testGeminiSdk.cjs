const { GoogleGenerativeAI } = require("./functions/node_modules/@google/generative-ai");

async function test() {
  const apiKey = "AQ.Ab8RN6K3nj1egAfr4i_iRNsHp0sKfPssWJY6wsa7ajVkqaanyg";
  console.log("Testing key:", apiKey.substring(0, 10) + "...");
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are a professional resume reviewer. Output JSON only."
    });

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Analyze resume: Software Engineer with React experience." }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    console.log("SUCCESS! Output length:", response.response.text().length);
    console.log("Preview:", response.response.text().substring(0, 200));
  } catch (err) {
    console.error("SDK ERROR:", err);
  }
}

test();
