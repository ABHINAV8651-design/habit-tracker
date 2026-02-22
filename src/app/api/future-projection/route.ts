import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { futureProjectionEstimate, successAlignmentPercent, calculateStreak } from "@/lib/core";
import { startOfDay } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [user, habits, habitLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { mainGoal: true, dreamLifeDesc: true },
    }),
    prisma.habit.findMany({
      where: { userId: session.userId },
      select: { type: true, consistencyPct: true },
    }),
    prisma.habitLog.findMany({
      where: { userId: session.userId },
      take: 200,
    }),
  ]);

  const today = startOfDay(new Date());
  const completedByDay = new Map<string, number>();
  habitLogs.filter((l) => l.completed).forEach((l) => {
    const k = l.date.toISOString().slice(0, 10);
    completedByDay.set(k, (completedByDay.get(k) || 0) + 1);
  });
  const totalPossible = habits.length * 90;
  const totalCompleted = Array.from(completedByDay.values()).reduce((a, b) => a + b, 0);
  const currentConsistency = totalPossible ? (totalCompleted / totalPossible) * 100 : 0;
  const sortedDates = habitLogs
    .filter((l) => l.completed)
    .map((l) => l.date);
  const currentStreak = calculateStreak(sortedDates, new Date());

  const horizons = [
    { key: "3m", months: 3, label: "3 months" },
    { key: "6m", months: 6, label: "6 months" },
    { key: "1y", months: 12, label: "1 year" },
    { key: "3y", months: 36, label: "3 years" },
  ];

  const consistencyByType: Record<string, number> = {};
  habits.forEach((h) => {
    consistencyByType[h.type] = h.consistencyPct;
  });
  const dreamAlignment = successAlignmentPercent(
    user?.mainGoal ?? "custom",
    habits.map((h) => h.type),
    consistencyByType
  );

  const projections = horizons.map(({ key, months, label }) => {
    const est = futureProjectionEstimate(months, currentConsistency, currentStreak);
    return {
      horizon: key,
      label,
      ...est,
    };
  });

  return NextResponse.json({
    currentConsistency,
    currentStreak,
    dreamAlignment,
    dreamLifeDesc: user?.dreamLifeDesc ?? null,
    projections,
  });
}
