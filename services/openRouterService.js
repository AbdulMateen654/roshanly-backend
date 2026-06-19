
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const summarizeText = async (text) => {
    try {

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "AI Study Assistant"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.1-8b-instruct",
                messages: [
                    {
                        role: "system",
content: `
You are an expert AI study assistant that creates rich, student-friendly summaries.

Return ONLY valid JSON, no markdown, no code fences:

{
  "title": "2 to 4 word title",
  "summary": ["point 1", "point 2", "point 3", "point 4", "point 5"]
}

HARD RULES:
- Title must be 2 to 4 meaningful words based on content only, no special characters
- Summary MUST be a JSON array of strings, never a single string
- Generate 5 to 7 points for rich coverage
- Each point must be a complete, informative sentence
- Where applicable, include real examples, numbers, dates, or facts from the content
  Example: Instead of "Processor speed increased" write "Processor speed doubled every 18 months, going from 1.5MHz in 1987 to 1.5GHz by 2002 (Moore's Law)"
- Explain the WHY or significance behind each point, not just the fact
  Example: Instead of "Moore noticed a pattern" write "Gordon Moore observed in 1965 that transistor count doubles every 18 months, which became the roadmap the entire tech industry followed"
- No bullet symbols like •, *, - inside strings
- No numbering like 1. or 1) inside strings
- If input is gibberish or random characters return:
  {"title": "Invalid Input", "summary": ["The provided text does not appear to be valid study material. Please paste actual study content."]}
- Return RAW JSON only, no extra text outside the JSON
`
                    },
                    {
                        role: "user",
                        content: text.slice(0, 2000)
                    }
                ]
            })
        });

        const data = await response.json();

        const content = data?.choices?.[0]?.message?.content;

        if (!content) throw new Error("Empty AI response");
const cleaned = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

const jsonStart = cleaned.indexOf("{");
const jsonEnd = cleaned.lastIndexOf("}");

if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found");

const extracted = cleaned.slice(jsonStart, jsonEnd + 1);

const fixedJson = extracted
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    .replace(/[\u0000-\u001F]/g, " ");

const parsed = JSON.parse(fixedJson);

// handle summary as string instead of array
if (typeof parsed.summary === "string") {
    parsed.summary = parsed.summary
        .split(/[•\*\n\r]+/)
        .map(s => s
            .replace(/^\d+[\.\)]\s*/, "")  // remove "1." or "1)" numbering
            .replace(/^[-–—]\s*/, "")       // remove dash bullets
            .trim()
        )
        .filter(s => s.length > 10);       // filter out empty or too-short fragments
}

// even if it IS an array, clean each item
if (Array.isArray(parsed.summary)) {
    parsed.summary = parsed.summary
        .map(s => s
            .replace(/^[•\*\-–—]\s*/, "")  // strip leading bullet symbols
            .replace(/^\d+[\.\)]\s*/, "")  // strip numbering
            .trim()
        )
        .filter(s => s.length > 10);
}

return parsed;
  

    } catch (error) {
        console.error("AI failed → fallback activated");

        return fallbackSummary(text);
    }
};

const fallbackSummary = (text) => {

    // 4–5 word title
    const title = text
        .split(" ")
        .slice(0, 5)
        .join(" ");

    // simple bullet summary
    const sentences = text.split(".").slice(0, 3);

    const summary = sentences
        .map(s => `• ${s.trim()}`)
        .join("\n");

    return {
        title: title || "Study Notes",
        summary: summary || "• No summary available"
    };
};
const generateQuiz = async (summary,retries = 2) => {
    try {

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "AI Study Assistant"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.1-8b-instruct",
                messages: [
                    {
                        role: "system",
                        content: `
You are an AI study assistant.

Return ONLY a valid JSON array. No markdown, no code fences, no explanation.

[
  {
    "question": "Question here?",
    "options": ["A) option", "B) option", "C) option", "D) option"],
    "answer": "A) correct option"
  }
]

Rules:
- Generate exactly 5 MCQs
- Each question must have exactly 4 options (A, B, C, D)
- Answer must match one of the options EXACTLY, character for character
- Base questions only on the provided summary
- Keep language simple for students
- Return RAW JSON only, no backticks, no markdown
                        `
                    },
                    {
                        role: "user",
                        content: summary.join("\n").slice(0, 2000)
                    }
                ]
            })
        });

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content) throw new Error("Empty AI response");

        // strip markdown fences and whitespace
const cleaned = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

const jsonStart = cleaned.indexOf("[");
const jsonEnd = cleaned.lastIndexOf("]");

if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON array found");

const extracted = cleaned.slice(jsonStart, jsonEnd + 1);

// fix common AI JSON mistakes before parsing
const fixedJson = extracted
    .replace(/,\s*]/g, "]")           // trailing comma in array
    .replace(/,\s*}/g, "}")           // trailing comma in object
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')  // unquoted keys
    .replace(/:\s*'([^']*)'/g, ': "$1"')   // single quoted values → double quotes
    .replace(/[\u0000-\u001F]/g, " "); // strip control characters

const parsed = JSON.parse(fixedJson);

        return parsed;

    } catch (error) {
        if (retries > 0) {
            console.error(`Quiz failed, retrying... (${retries} left)`);
            return generateQuiz(summary, retries - 1);
        }
        console.error("Quiz AI failed →", error.message);
        return fallbackQuiz();
    }
};
const fallbackQuiz = () => {
    return [{
        question: "Quiz generation is currently unavailable. Please try again.",
        options: ["A) Try again later", "B) Regenerate summary first", "C) Check your connection", "D) Refresh the page"],
        answer: "A) Try again later"
    }];
};
module.exports = { summarizeText, generateQuiz };  // 👈 export generateQuiz too
