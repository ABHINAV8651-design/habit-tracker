import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, addDays } from "@/lib/utils";
import { calculateStreak } from "@/lib/core";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { habitId, completed, timeSpent, value, date } = body;
    if (!habitId) {
      return NextResponse.json(
        { error: "habitId required" },
        { status: 400 }
      );
    }
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.userId },
    });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }
    const logDate = date ? startOfDay(new Date(date)) : startOfDay(new Date());
    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: { habitId, date: logDate },
      },
      create: {
        habitId,
        userId: session.userId,
        date: logDate,
        completed: completed ?? true,
        timeSpent: timeSpent != null ? Number(timeSpent) : null,
        value: value != null ? Number(value) : null,
      },
      update: {
        completed: completed ?? true,
        timeSpent: timeSpent != null ? Number(timeSpent) : undefined,
        value: value != null ? Number(value) : undefined,
      },
    });

    const habitLogs = await prisma.habitLog.findMany({
      where: { habitId },
      select: { date: true, completed: true },
    });
    const completedDates = habitLogs.filter((l) => l.completed).map((l) => l.date);
    const streak = calculateStreak(completedDates, new Date());
    const frequency = habit.targetFrequency || "daily";
    const now = new Date();
    const cutoff = addDays(startOfDay(now), frequency === "daily" ? -90 : frequency === "weekly" ? -84 : -90);
    const recentCompleted = completedDates.filter((d) => d >= cutoff);
    const uniqueDays = new Set(recentCompleted.map((d) => startOfDay(d).toISOString())).size;
    const totalDays = frequency === "daily" ? 90 : frequency === "weekly" ? 12 : 3;
    const consistencyPct = totalDays > 0 ? Math.min(100, (uniqueDays / totalDays) * 100) : 0;
    const failureRate = Math.max(0, 100 - consistencyPct);
    const strengthScore = Math.min(100, consistencyPct * 0.5 + Math.min(streak / 30, 1) * 30);
    await prisma.habit.update({
      where: { id: habitId },
      data: { streak, consistencyPct, failureRate, strengthScore },
    });

    return NextResponse.json(log);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to log habit" },
      { status: 500 }
    );
  }
}
