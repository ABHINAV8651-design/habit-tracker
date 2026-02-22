import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/utils";

const HABIT_TYPES = [
  "Study",
  "Gym",
  "Water intake",
  "Calories",
  "Cardio",
  "Meditation",
  "Reading",
  "Business work",
  "Content creation",
  "Custom",
];

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const withToday = searchParams.get("withToday") === "1";
  const habits = await prisma.habit.findMany({
    where: { userId: session.userId },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  });
  if (!withToday) return NextResponse.json(habits);
  const today = startOfDay(new Date());
  const logs = await prisma.habitLog.findMany({
    where: { userId: session.userId, date: today, completed: true },
    select: { habitId: true },
  });
  const todaySet = new Set(logs.map((l) => l.habitId));
  return NextResponse.json(
    habits.map((h) => ({ ...h, todayCompleted: todaySet.has(h.id) }))
  );
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {
      name,
      type,
      targetFrequency,
      targetHours,
      targetCount,
      reminderTime,
      priority,
      categoryTag,
      notes,
    } = body;
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type required" },
        { status: 400 }
      );
    }
    const habit = await prisma.habit.create({
      data: {
        userId: session.userId,
        name,
        type: HABIT_TYPES.includes(type) ? type : "Custom",
        targetFrequency: targetFrequency || "daily",
        targetHours: targetHours != null ? Number(targetHours) : null,
        targetCount: targetCount != null ? Number(targetCount) : null,
        reminderTime: reminderTime || null,
        priority: priority != null ? Number(priority) : 1,
        categoryTag: categoryTag || null,
        notes: notes || null,
      },
    });
    return NextResponse.json(habit);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
