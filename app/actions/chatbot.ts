"use server";

export async function askChatbot(message: string, history: { role: string; content: string }[]) {
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey || openRouterKey === "your_openrouter_api_key_here") {
      return { 
        answer: "I'm currently in offline mode. Please contact support@kalvex.com for assistance or set your OpenRouter API key." 
      };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kalvex.com",
        "X-Title": "KALVEX Support"
      },
      body: JSON.stringify({
        model: "google/gemini-pro-1.5",
        messages: [
          {
            role: "system",
            content: "You are the KALVEX AI Assistant. KALVEX is India's leading platform for engineering services, patents, and academic projects. Be professional, helpful, and concise. Help users find services like PhD thesis assistance, patent drafting, and project kits."
          },
          ...history,
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    return { answer: data.choices[0].message.content };
  } catch (error) {
    console.error("Chatbot Error:", error);
    return { error: "I'm having trouble connecting to my brain. Please try again." };
  }
}
