const { OpenAI } = require("openai");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

module.exports = async (req, res) => {
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

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const formattedMessages = [
      {
        role: "system",
        content: "Jesteś Inkanto, pomocnym i uprzejmym asystentem AI. Twoim celem jest pomaganie użytkownikom w sposób zwięzły i przyjazny. Odpowiadaj zawsze po polsku.",
      },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }))
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
    });

    const responseText = response.choices[0].message.content;

    return res.status(200).json({ content: responseText });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
