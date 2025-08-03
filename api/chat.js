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
          content: "You are a helpful Instagram business assistant. Respond in a friendly, professional manner."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    res.json({ 
      reply: completion.choices[0].message.content 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response" });
  }
}
