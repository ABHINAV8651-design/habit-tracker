import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const insights = await prisma.aIInsight.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(insights);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 503 }
    );
  }
  try {
    const [user, habits, habitLogs, productivityLogs] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          mainGoal: true,
          currentStruggles: true,
          wakeUpTime: true,
          sleepTime: true,
          fitnessLevel: true,
          dailyFreeTime: true,
        },
      }),
      prisma.habit.findMany({
        where: { userId: session.userId },
        select: { name: true, type: true, consistencyPct: true, streak: true },
      }),
      prisma.habitLog.findMany({
        where: { userId: session.userId },
        take: 100,
        orderBy: { date: "desc" },
      }),
      prisma.productivityLog.findMany({
        where: { userId: session.userId },
        take: 14,
        orderBy: { date: "desc" },
      }),
    ]);

    const prompt = `You are an AI life coach. Based on this user data, provide 3-5 short, actionable insights as JSON array of objects with "title" and "content" and "category" (one of: habit, schedule, fitness, productivity, rest, motivation).

User goal: ${user?.mainGoal ?? "Not set"}
Struggles: ${user?.currentStruggles ?? "Not set"}
Wake: ${user?.wakeUpTime ?? "—"} Sleep: ${user?.sleepTime ?? "—"}
Free time/day: ${user?.dailyFreeTime ?? "—"}
Fitness level: ${user?.fitnessLevel ?? "—"}

Habits and consistency:
${habits.map((h) => `- ${h.name} (${h.type}): ${h.consistencyPct}% consistent, streak ${h.streak}`).join("\n")}

Recent productivity (last 14 days): ${productivityLogs.map((p) => p.score).join(", ")}

Return ONLY a JSON array, no markdown or explanation. Example: [{"title":"...","content":"...","category":"habit"}]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    const raw = completion.choices[0]?.message?.content?.trim() || "[]";
    const parsed = JSON.parse(raw.replace(/^```json?\s*|\s*```$/g, ""));
    if (!Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }

    for (const item of parsed.slice(0, 5)) {
      await prisma.aIInsight.create({
        data: {
          userId: session.userId,
          type: "suggestion",
          title: item.title || "Insight",
          content: item.content || "",
          category: item.category || "habit",
        },
      });
    }

    const updated = await prisma.aIInsight.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
