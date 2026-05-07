import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CUSTOMER_SYSTEM_PROMPT = `You are the friendly virtual assistant for "MS Salon & Academy", a luxury hair, beauty, nails, and skincare salon.

Help users with questions about the app and salon. Keep replies concise, warm, and clear. Use markdown.

When relevant, suggest these in-app links (use markdown links):
- Home: [/](/)
- Services & pricing: [/services](/services)
- Photo gallery (before/after): [/gallery](/gallery)
- Book an appointment: [/book](/book)
- Customer login: [/login](/login)
- Sign up: [/signup](/signup)
- My dashboard (bookings, profile, reviews): [/dashboard](/dashboard)
- Admin login: [/admin/login](/admin/login)

Topics you can help with:
- How to book, reschedule, or cancel appointments
- Services we offer (hair, nails, skin, bridal, academy courses)
- Finding stylists/experts
- Viewing the gallery and customer reviews
- Account, profile, and login issues
- Admin features (analytics, reports, GST, staff commission) — only at a high level

If a user asks something outside the salon/app scope, politely steer back. Never invent prices, hours, or staff details you don't know — instead point them to the relevant page.`;

const ADMIN_SYSTEM_PROMPT = `You are the virtual assistant for the **admin dashboard** of "MS Salon & Academy". The user is currently signed in as an admin.

Keep replies concise, professional, and clear. Use markdown.

## Link policy (STRICT — must follow)

You may ONLY emit in-app links whose path begins with \`/admin\`. The complete allow-list is:
- [/admin/dashboard](/admin/dashboard)
- [/admin/login](/admin/login)

You MUST NOT, under any circumstances, output markdown links, bare URLs, or HTML anchors to any of these (or any other non-\`/admin\` path):
\`/\`, \`/book\`, \`/services\`, \`/gallery\`, \`/login\`, \`/signup\`, \`/dashboard\`, \`/profile\`, \`/reviews\`.

If the user asks for a customer page, DO NOT link it. Instead, describe how the admin can manage that flow from the admin dashboard. Refuse politely if pressed (e.g. "I can only link to admin pages from here.").

Never invent new routes. Never wrap a forbidden path in a markdown link, even as an example. Never include external URLs unless they are well-known docs explicitly relevant to an admin task.

Explain what is available in the admin area:
- **Bookings** — view all appointments, update status (confirm, complete, cancel), reschedule
- **Services** — create, edit, and remove salon services and pricing
- **Experts (Stylists)** — add or edit stylists, including their per-staff **commission rate**
- **Analytics** — total bookings, daily revenue, most popular service, peak hours, staff performance
- **Reports & Accounting** — daily sales, monthly revenue, **GST report** (CGST + SGST split), staff commission; all exportable as CSV

Rules:
- Stay focused on admin tasks. If asked about customer-facing flows, briefly explain how the admin can manage them from the dashboard instead of linking customers pages.
- Never invent data (specific revenue numbers, staff names, booking counts). Point the admin to the relevant tab.
- Do not expose credentials, secrets, or internal implementation details.
- If asked something outside the admin/app scope, politely steer back to admin features.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const systemPrompt =
      context === "admin" ? ADMIN_SYSTEM_PROMPT : CUSTOMER_SYSTEM_PROMPT;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Lovable workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});