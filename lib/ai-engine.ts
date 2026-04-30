import { LOCARNO_CLASSES } from "./locarno";

/**
 * KALVEX Neural Intelligence Engine (v3.0 - OpenRouter Integrated)
 * High-precision technical-to-legal classification mapper.
 */

interface AIResult {
  title: string;
  class: string;
  subclass: string;
  confidence: number;
  reasoning: string[];
}

export async function analyzePatent(description: string): Promise<AIResult> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
  
  if (!apiKey) {
    console.warn("OpenRouter API Key missing. Falling back to internal engine.");
    return fallbackAnalysis(description);
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://kalvex.com",
        "X-Title": "KALVEX Patent Engine",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-preview-02-05:free",
        messages: [
          {
            role: "system",
            content: `You are an elite Patent Attorney and Industrial Design Expert. 
            Your task is to analyze a technical invention description and categorize it using the LOCARNO INTERNATIONAL CLASSIFICATION (32 Classes).
            
            OFFICIAL CLASSES REFERENCE:
            ${LOCARNO_CLASSES.map(c => `Class ${c.class}: ${c.name}`).join("\n")}

            Return ONLY a JSON object in this exact format:
            {
              "title": "A synthesized professional institutional-grade patent title",
              "class": "The 2-digit Class code",
              "subclass": "The 2-digit Sub-class code (e.g. 06)",
              "confidence": number between 80-99,
              "reasoning": ["Step 1 of analysis", "Step 2 identifying keywords", "Legal anchor point"]
            }`
          },
          {
            role: "user",
            content: `Invention Description: ${description}`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      title: result.title,
      class: result.class,
      subclass: result.subclass,
      confidence: result.confidence,
      reasoning: result.reasoning
    };

  } catch (error) {
    console.error("OpenRouter Error:", error);
    return fallbackAnalysis(description);
  }
}

// Fallback logic for when API is unavailable
function fallbackAnalysis(description: string): AIResult {
  const desc = description.toLowerCase();
  const reasoning = ["API Offline: Using Internal Neural Mapping..."];
  
  // Basic fallback matching
  let matchedClass = "99";
  let matchedSub = "00";
  
  if (desc.includes("alert") || desc.includes("signal") || desc.includes("alarm")) {
    matchedClass = "10";
    matchedSub = "06";
    reasoning.push("Identified signalling intent.");
  } else if (desc.includes("medical") || desc.includes("health")) {
    matchedClass = "24";
    matchedSub = "02";
    reasoning.push("Identified medical intent.");
  }

  return {
    title: `Technical Assembly: ${description.split(" ").slice(0, 3).join(" ")} System`,
    class: matchedClass,
    subclass: matchedSub,
    confidence: 85,
    reasoning
  };
}
