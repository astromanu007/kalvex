"use server";

import { prisma } from "@/lib/prisma";

export async function askChatbot(message: string, history: { role: string; content: string }[]) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey || openRouterKey === "your_openrouter_api_key_here") {
    return { 
      answer: "I'm currently in offline mode. Please contact kalvextechnologies@gmail.com for assistance or set your OpenRouter API key." 
    };
  }

  // 1. Fetch Store Context & Site Map
  let storeContext = "";
  try {
    const [products, projects] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        take: 10,
        select: { name: true, category: true, stock: true, price: true, mrp: true, specs: true, slug: true }
      }),
      prisma.project.findMany({
        where: { isActive: true },
        take: 10,
        select: { title: true, branch: true, price: true, type: true, techStack: true, slug: true }
      })
    ]);

    storeContext = `
      SITE STRUCTURE & REDIRECT LINKS:
      - Homepage: /
      - Component Store (Electronics): /electronics
      - Project Marketplace (Engineering): /projects
      - Academic Services (PhD/Research): /services
      - AI Patent Drafter (IPR Tool): /patent-drafter
      - IPR & Licensing: /ipr
      - Dashboard/Profile: /dashboard
      - Contact Us: /contact
      - Technical Blog: /blog
      - About Us: /about
      - Support Center: /support
      - Documentation: /documentation
      
      CURRENT INVENTORY (Top Items):
      PRODUCTS:
      ${products.map(p => `- ${p.name} (₹${p.price}): Link: /electronics/${p.slug}, Stock: ${p.stock}`).join('\n')}
      
      PROJECTS:
      ${projects.map(p => `- ${p.title} (₹${p.price}): Link: /projects/${p.slug}, Branch: ${p.branch}`).join('\n')}
      
      SERVICES:
      - PhD Thesis Guidance (Thesis drafting, research support)
      - Research Paper Assistance (Publication, editing)
      - Design Patent Drafting (IPR filings)
      - Utility Patent Drafting (Technical disclosures)
      - Custom Engineering Kits (Bespoke hardware design)
    `;
  } catch (e) {
    console.error("Chatbot: Error fetching context:", e);
  }

  const models = [
    "openrouter/auto",
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-flash-1.5"
  ];

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://kalvex.com",
          "X-Title": "KALVEX Support Intelligence"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: `You are the KALVEX Intelligence Unit, a highly specialized AI developed by KALVEX Technologies. 
              
              IDENTITY: Institutional, professional, precise, and enigmatic.
              PLATFORM: You are integrated with a 3D Architectural Visual Layer (Three.js) and a High-Performance Navigation Engine.
              VISUALS: The platform features a "Professional Elite" aesthetic with vibrant institutional trust badges and dynamic 3D header backgrounds.
              
              BE SPECIFIC: Answer ONLY what is asked. Do not provide unnecessary background.
              KNOWLEDGE: You have full awareness of the site map and product inventory provided below.
              NAVIGATION: ALWAYS provide direct navigation links (e.g., /services, /electronics) when asked about site content.
              FORMATTING: Use professional Markdown. Bold ONLY critical metrics or links. No citations [1], [2].
              
              CONTEXT:
              ${storeContext}
              
              Tone: High-performance, strategic, and institutional.`
            },
            ...history,
            { role: "user", content: message }
          ],
          temperature: 0.3, // Even lower for maximum accuracy and specificity
          max_tokens: 800
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return { answer: data.choices[0].message.content };
        }
      }
    } catch (error) {
      console.error(`Chatbot: Error with model ${model}:`, error);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return { error: "Neural link saturated. Please re-engage later." };
}
