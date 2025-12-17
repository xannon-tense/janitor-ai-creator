import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  // Construct the prompt for AI to summarize and expand fields
  const prompt = `
You are a professional character AI writer. The user provides short info for each field of a character. 
Summarize each field into ONE concise paragraph per section, straightforward and clear, keeping the information accurate.
Format headings exactly like this, starting with '>': 
- > IDENTITY
- > BACKSTORY
- > RESIDENCE
- > RELATIONSHIPS
- > PERSONALITY
- > INTIMACY
- > SPEECH
- > SIDE CHARACTERS

Include the setting at the top in <setting> tags. Expand all short input info into a brief paragraph (max one paragraph per field).

<setting>
${data.setting || ""}
</setting>

> IDENTITY
Full Name: ${data.name}
Aliases: ${data.aliases}
Species: ${data.species}
Race: ${data.race}
Age: ${data.age}
Height: ${data.height}
Sexuality: ${data.sexuality}
Occupation/Role: ${data.role}
Appearance: ${data.appearance}
Scent: ${data.scent}
Clothing: ${data.clothing}

> BACKSTORY
${data.backstory}

> RESIDENCE
${data.residence}

> RELATIONSHIPS
${data.relationships}

> PERSONALITY
Traits: ${data.traits}
Likes: ${data.likes}
Dislikes: ${data.dislikes}
Insecurities: ${data.insecurities}
Physical behavior: ${data.behavior}

> INTIMACY
Turn-ons: ${data.turnons}
Kinks: ${data.kinks}
During Sex: ${data.during}

> SPEECH
Commanding: ${data.commanding}
Annoyed: ${data.annoyed}
Possessive: ${data.possessive}
Teasing: ${data.teasing}
Soft (rare): ${data.soft}

> SIDE CHARACTERS
${data.sidechars}

Return the final character sheet as plain text.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;
    res.status(200).json({ text });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
}
