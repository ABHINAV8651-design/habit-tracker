import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, addDays, daysBetween } from "@/lib/utils";
import { calculateStreak, productivityScore, fitnessScore } from "@/lib/core";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const today = startOfDay(new Date());
  const weekAgo = addDays(today, -7);

  const [user, habits, habitLogs, waterLogs, calorieLogs, productivityLogs, workouts] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          name: true,
          xp: true,
          level: true,
          disciplineScore: true,
          mainGoal: true,
        },
      }),
      prisma.habit.findMany({
        where: { userId: session.userId },
        orderBy: { priority: "desc" },
      }),
      prisma.habitLog.findMany({
        where: { userId: session.userId, date: { gte: weekAgo, lte: today } },
      }),
      prisma.waterLog.findMany({
        where: { userId: session.userId, date: today },
      }),
      prisma.calorieLog.findMany({
        where: { userId: session.userId, date: today },
      }),
      prisma.productivityLog.findMany({
        where: { userId: session.userId, date: { gte: weekAgo, lte: today } },
      }),
      prisma.workout.findMany({
        where: { userId: session.userId, date: { gte: weekAgo, lte: today } },
      }),
    ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const todayLogs = habitLogs.filter(
    (l) => startOfDay(l.date).getTime() === today.getTime()
  );
  const completedToday = todayLogs.filter((l) => l.completed).length;
  const totalHabits = habits.length;
  const dailyProgress = totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0;

  const allLogDates = habitLogs.filter((l) => l.completed).map((l) => l.date);
  const streak = calculateStreak(allLogDates, new Date());

  const waterTotal = waterLogs.reduce((s, l) => s + l.amount, 0);
  const caloriesTotal = calorieLogs.reduce((s, l) => s + l.calories, 0);

  const todayProductivity = productivityLogs.find(
    (p) => startOfDay(p.date).getTime() === today.getTime()
  );
  const prodScore = todayProductivity
    ? productivityScore(
        todayProductivity.focusMinutes,
        todayProductivity.tasksCompleted,
        todayProductivity.distractions
      )
    : 0;

  const workoutsThisWeek = workouts.length;
  const fitnessScoreVal = fitnessScore(workoutsThisWeek, 4, dailyProgress);

  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const dayLogs = habitLogs.filter(
      (l) => startOfDay(l.date).getTime() === startOfDay(d).getTime()
    );
    const completed = dayLogs.filter((l) => l.completed).length;
    weekData.push({
      date: d.toISOString().slice(0, 10),
      label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
      completed,
      total: habits.length,
      pct: habits.length ? Math.round((completed / habits.length) * 100) : 0,
    });
  }

  const heatmapData: { date: string; count: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = addDays(today, -i);
    const dayLogs = habitLogs.filter(
      (l) => startOfDay(l.date).getTime() === startOfDay(d).getTime()
    );
    const completed = dayLogs.filter((l) => l.completed).length;
    heatmapData.push({
      date: d.toISOString().slice(0, 10),
      count: habits.length ? Math.round((completed / habits.length) * 100) : 0,
    });
  }

  const aiMessage =
    dailyProgress >= 80
      ? "You're on fire today! Keep this energy."
      : dailyProgress >= 50
        ? "Solid progress. One more habit could make it a great day."
        : streak > 0
          ? "Your streak is alive. Add one small win today."
          : "Every day is a fresh start. Pick one habit and nail it.";

  return NextResponse.json({
    user: { name: user.name, xp: user.xp, level: user.level, disciplineScore: user.disciplineScore },
    todayHabits: habits.map((h) => {
      const log = todayLogs.find((l) => l.habitId === h.id);
      return {
        id: h.id,
        name: h.name,
        type: h.type,
        completed: log?.completed ?? false,
        timeSpent: log?.timeSpent,
        value: log?.value,
      };
    }),
    progressRing: dailyProgress,
    streak,
    productivityScore: prodScore,
    fitnessScore: fitnessScoreVal,
    waterTotal,
    waterGoal: 8,
    caloriesTotal,
    caloriesGoal: 2200,
    sleepSummary: null,
    aiMessage,
    weekData,
    heatmapData,
  });
}
