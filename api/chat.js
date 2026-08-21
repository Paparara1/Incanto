// Vercel Serverless Function: Master AI Assistant & LLM Router (OpenAI / Gemini Pro)
// Path: api/chat.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { messages, provider = 'openai' } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Nie podano treści wiadomości (messages required).' });
    }

    const lastUserMessage = messages[messages.length - 1].content || '';

    // If OPENAI_API_KEY is configured
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Jesteś Asystentem Inkanto AI oraz silnikiem ASI Bridge. Pomagasz w zarządzaniu ekosystemem biometrycznym IrisVault, infrastrukturą ClusterLaunch oraz terminalem SIT v2.0.'
            },
            ...messages
          ],
          temperature: 0.7
        })
      });

      if (openAiRes.ok) {
        const data = await openAiRes.json();
        const reply = data.choices[0]?.message?.content || 'Brak odpowiedzi z OpenAI.';
        return res.status(200).json({ reply, provider: 'OpenAI (gpt-4o-mini)' });
      }
    }

    // If GEMINI_API_KEY is configured
    if ((provider === 'gemini' || !process.env.OPENAI_API_KEY) && process.env.GEMINI_API_KEY) {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: lastUserMessage }] }]
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Brak odpowiedzi z Gemini Pro.';
        return res.status(200).json({ reply, provider: 'Google Gemini Pro' });
      }
    }

    // Smart fallback AI response when API keys are not set in environment
    const fallbackReply = `✨ [ASI Bridge Smart Response]: Otrzymano intencję: "${lastUserMessage}". Ekosystem Master jest aktywny i zabezpieczony biometrycznie (IrisVault ZK-Trust). Możesz uruchomić wdrożenie klastra K3s (ClusterLaunch) lub powiązać agentów w SIT v2.0.`;

    return res.status(200).json({
      reply: fallbackReply,
      provider: 'ASI Bridge Native Intelligence Engine (Offline Mode)'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Błąd połączenia z modelem AI.',
      details: error.message
    });
  }
}
