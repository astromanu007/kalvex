import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    // 1. Get user session details dynamically
    const session = await auth();
    const userEmail = session?.user?.email;
    let userContext = "";

    if (userEmail) {
      const dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              orderNumber: true,
              status: true,
              amount: true,
              createdAt: true,
              serviceType: true,
            }
          }
        }
      });

      if (dbUser) {
        userContext = `
        AUTHENTICATED USER DETAILS:
        - Name: ${dbUser.name}
        - Email: ${dbUser.email}
        - Role: ${dbUser.role}
        - College: ${dbUser.college || "N/A"}
        - Department: ${dbUser.branch || "N/A"}
        - Referral Code: ${dbUser.referralCode}
        
        RECENT ORDERS:
        ${dbUser.orders.length > 0 
          ? dbUser.orders.map(o => `- Order #${o.orderNumber}: ${o.serviceType || 'Product'}, Status: ${o.status}, Amount: ₹${o.amount}, Date: ${new Date(o.createdAt).toLocaleDateString()}`).join("\n")
          : "No recent orders found."}
        `;
      }
    }

    // 2. Fetch Store Context (products/projects)
    let storeContext = "";
    try {
      const [products, projects] = await Promise.all([
        prisma.product.findMany({
          where: { isActive: true },
          take: 10,
          select: { name: true, category: true, stock: true, price: true, specs: true, slug: true }
        }),
        prisma.project.findMany({
          where: { isActive: true },
          take: 10,
          select: { title: true, branch: true, price: true, type: true, slug: true }
        })
      ]);

      storeContext = `
      SITE STRUCTURE & LINKS:
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
      console.error("Chatbot Route: Error fetching store context:", e);
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey || openRouterKey === "your_openrouter_api_key_here") {
      return new Response("I'm currently in offline mode. Please contact kalvextechnologies@gmail.com for assistance or set your OpenRouter API key.", { status: 503 });
    }

    const models = [
      "openrouter/auto",
      "google/gemini-2.0-flash-exp:free",
      "google/gemini-flash-1.5"
    ];

    // Filter out system error messages from history before passing to OpenRouter
    const cleanHistory = (history || []).filter(
      (m: any) => m.content && !m.content.startsWith("[SYSTEM ERROR]")
    );

    // Call OpenRouter with streaming
    let streamResponse: Response | null = null;
    for (const model of models) {
      try {
        const payload = {
          model: model,
          stream: true,
          messages: [
            {
              role: "system",
              content: `You are the KALVEX Intelligence Unit, a highly specialized AI developed by KALVEX Technologies. 
              
              IDENTITY: Institutional, professional, precise, and enigmatic.
              PLATFORM: You are integrated with a 3D Architectural Visual Layer (Three.js) and a High-Performance Navigation Engine.
              VISUALS: The platform features a "Professional Elite" aesthetic with vibrant institutional trust badges and dynamic 3D header backgrounds.
              
              BE SPECIFIC: Answer ONLY what is asked. Do not provide unnecessary background.
              KNOWLEDGE: You have full awareness of the site map, user details, order details, and product inventory provided below.
              NAVIGATION: ALWAYS provide clickable Markdown links (e.g., [Services](/services), [Electronics](/electronics), [About Us](/about)) when referring to site content or pages. Never output raw path strings (like "/about" or "/services") as plain text or bold text; they MUST be formatted as Markdown links so they are clickable.
              FORMATTING: Use professional Markdown. Bold ONLY critical metrics. No citations [1], [2]. Use clean Markdown code blocks for code snippets.
              
              USER CONTEXT:
              ${userContext}
              
              STORE CONTEXT:
              ${storeContext}
              
              Tone: High-performance, strategic, and institutional.`
            },
            ...cleanHistory,
            { role: "user", content: message }
          ],
          temperature: 0.3,
          max_tokens: 800
        };

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kalvex.com",
            "X-Title": "KALVEX Support Intelligence"
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          streamResponse = res;
          break;
        }
      } catch (err) {
        console.error(`Chatbot Route: Model ${model} failed:`, err);
      }
    }

    if (!streamResponse) {
      return new Response("Neural link saturated. Please re-engage later.", { status: 500 });
    }

    // Set up ReadableStream to pipe from OpenRouter stream to Client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const customStream = new ReadableStream({
      async start(controller) {
        const reader = streamResponse!.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const cleanedLine = line.trim();
              if (!cleanedLine) continue;

              if (cleanedLine === "data: [DONE]") {
                continue;
              }

              if (cleanedLine.startsWith("data: ")) {
                try {
                  const jsonStr = cleanedLine.slice(6);
                  const parsed = JSON.parse(jsonStr);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (jsonErr) {
                  // Ignore JSON parse errors for non-conforming lines
                }
              }
            }
          }
          if (buffer && buffer.startsWith("data: ")) {
             try {
               const parsed = JSON.parse(buffer.slice(6));
               const content = parsed.choices?.[0]?.delta?.content || "";
               if (content) {
                 controller.enqueue(encoder.encode(content));
               }
             } catch (e) {}
          }
        } catch (streamErr) {
          console.error("Chatbot Route: Streaming error:", streamErr);
          controller.error(streamErr);
        } finally {
          reader.releaseLock();
          controller.close();
        }
      }
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive"
      }
    });

  } catch (err: any) {
    console.error("Chatbot Route Error:", err);
    return new Response(err?.message || "Internal Server Error", { status: 500 });
  }
}
