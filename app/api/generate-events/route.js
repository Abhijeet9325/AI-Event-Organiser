import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 🔥 OpenRouter API call
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an event planning assistant.

Return ONLY raw JSON. Do NOT add any text before or after JSON.

{
  "title": "Event title",
  "description": "2-3 sentence description in one line",
  "category": "tech | music | sports | art | food | business | health | education | gaming | networking | outdoor | community",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}

Rules:
- No markdown
- No explanation
- No line breaks`
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    // 🔥 Raw AI response
   console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

if (!data.choices || !data.choices[0]) {
  return NextResponse.json(
    { error: "No choices returned from AI" },
    { status: 500 }
  );
}

let text = data.choices[0].message.content;

    console.log("RAW AI:", text); // debug

    // 🔥 Clean markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 🔥 Extract JSON only
    const jsonMatch = text.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      console.error("No JSON found:", text);
      return NextResponse.json(
        { error: "AI did not return JSON" },
        { status: 500 }
      );
    }

    let eventData;

    try {
      eventData = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("Parse failed:", jsonMatch[0]);
      return NextResponse.json(
        { error: "AI returned invalid format" },
        { status: 500 }
      );
    }

    // 🔥 Final success
    return NextResponse.json(eventData);

  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Failed to generate event: " + error.message },
      { status: 500 }
    );
  }
}