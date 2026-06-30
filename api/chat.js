import { GoogleGenerativeAI } from "@google/generative-ai";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  const { messages } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Jesteś Inkanto, pomocnym i uprzejmym asystentem AI. Twoim celem jest pomaganie użytkownikom w sposób zwięzły i przyjazny. Odpowiadaj zawsze po polsku.",
    });

    // Format messages for Gemini
    // Gemini expects 'user' and 'model' roles. We map 'assistant' to 'model'.
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return res.status(200).json({ content: responseText });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
