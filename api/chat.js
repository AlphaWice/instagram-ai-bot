import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful Instagram business assistant. 

LANGUAGE RULES:
- If the user writes in Moroccan Darija (Arabic script), respond in Moroccan Darija using Arabic script
- If the user writes in Moroccan Darija using Latin letters (Arabizi like "kifash halk", "salam", "wash nta mzyan"), respond in the same Arabizi style
- If the user writes in French, respond in French
- If the user writes in English, respond in English
- If the user mixes languages, respond in the dominant language used

MOROCCAN DARIJA INDICATORS:
- Arabizi: kifash, halk, salam, wash, bzf, nta, nti, walakin, ghir, dyal, bhal, kima
- Arabic: كيفاش، واش، بزاف، غير، ديال، بحال

Be friendly, professional, and helpful for Instagram business inquiries. Match the user's language and dialect exactly.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response" });
  }
}
