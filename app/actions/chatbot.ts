"use server";

export async function askChatbot(message: string, history: { role: string; content: string }[]) {
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey || openRouterKey === "your_openrouter_api_key_here") {
      return { 
        answer: "I'm currently in offline mode. Please contact support@kalvex.com for assistance or set your OpenRouter API key." 
      };
    }

    console.log("Chatbot: Engaging OpenRouter with model google/gemini-flash-1.5");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kalvex.com",
        "X-Title": "KALVEX Support Intelligence"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct:free", // Switching to high-availability free model for testing
        messages: [
          {
            role: "system",
            content: "You are the KALVEX AI Support Intelligence. KALVEX is India's premier engineering and academic services portal. You specialize in PhD thesis guidance, patent drafting (IPR), and providing high-quality engineering project kits. Be professional, institutional, and highly concise."
          },
          ...history,
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      const status = response.status;
      console.error(`OpenRouter API Error [Status ${status}]:`, errorText);
      return { error: `Link failure [${status}]. System is recalibrating.` };
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("OpenRouter Unexpected Response:", data);
      return { error: "Neural link timeout. Please re-engage." };
    }

    return { answer: data.choices[0].message.content };
  } catch (error) {
    console.error("Chatbot Action Exception:", error);
    return { error: "Total system blackout. Contact KALVEX Command." };
  }
}
