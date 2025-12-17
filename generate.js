import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

  try{
    const { name, aliases, species, race, age, height, sexuality, role,
            appearance, scent, clothing, backstory, residence, relationships,
            traits, likes, dislikes, insecurities, behavior,
            turnons, kinks, during, commanding, annoyed, possessive,
            teasing, soft, sidechars, setting } = req.body;

    const prompt = `
Summarize each field concisely (1 paragraph max) for a Janitor AI character sheet.
Include > before category titles in the output.

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
      model:"gpt-4o-mini",
      messages:[{role:"user", content:prompt}]
    });

    res.status(200).json({ text: completion.choices[0].message.content });
  } catch(err){
    console.error(err);
    res.status(500).json({ error:"Server error" });
  }
}
