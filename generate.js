import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const startTime = Date.now();

    const {
      name, aliases, species, race, age, height, sexuality, role,
      appearance, scent, clothing, backstory, residence, relationships,
      traits, likes, dislikes, insecurities, behavior,
      turnons, kinks, during,
      commanding, annoyed, possessive, teasing, soft,
      sidechars, setting
    } = req.body;

    // Build a prompt that tells AI to summarize each field concisely (1 paragraph each)
    const prompt = `
You are creating a Janitor AI character sheet. Expand and summarize each field provided. Use 1 paragraph max for each. Include > in front of category titles in the output. Here's the info:

> IDENTITY
* Full Name: ${name}
* Aliases: ${aliases}
* Species: ${species}
* Race: ${race}
* Age: ${age}
* Height: ${height}
* Sexuality: ${sexuality}
* Occupation/Role: ${role}
* Appearance: ${appearance}
* Scent: ${scent}
* Clothing: ${clothing}

> BACKSTORY
${backstory}

> RESIDENCE
${residence}

> RELATIONSHIPS
${relationships}

> PERSONALITY
* Traits: ${traits}
* Likes: ${likes}
* Dislikes: ${dislikes}
* Insecurities: ${insecurities}
* Physical behavior: ${behavior}

> INTIMACY
* Turn-ons: ${turnons}
* Kinks: ${kinks}
* During Sex: ${during}

> SPEECH
* Commanding: ${commanding}
* Annoyed: ${annoyed}
* Possessive: ${possessive}
* Teasing: ${teasing}
* Soft (rare): ${soft}

> SIDE CHARACTERS
${sidechars}

> SETTING
${setting}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const aiText = completion.choices[0].message.content;

    // Enforce minimum 15-second wait
    const elapsed = Date.now() - startTime;
    const minWait = 15000; // 15 seconds in ms
    if (elapsed < minWait) {
      await new Promise(resolve => setTimeout(resolve, minWait - elapsed));
    }

    res.status(200).json({ text: aiText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
