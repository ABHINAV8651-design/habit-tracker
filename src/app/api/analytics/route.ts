import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, addDays } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const today = startOfDay(new Date());
  const yearAgo = addDays(today, -365);

  const [habits, habitLogs, productivityLogs] = await Promise.all([
    prisma.habit.findMany({
      where: { userId: session.userId },
      select: { id: true, name: true, type: true, consistencyPct: true, streak: true },
    }),
    prisma.habitLog.findMany({
      where: { userId: session.userId, date: { gte: yearAgo, lte: today } },
    }),
    prisma.productivityLog.findMany({
      where: { userId: session.userId, date: { gte: yearAgo, lte: today } },
    }),
  ]);

  const byHabitId = new Map<string, { completed: number; total: number }>();
  habitLogs.forEach((l) => {
    const key = l.habitId;
    const cur = byHabitId.get(key) || { completed: 0, total: 0 };
    cur.total++;
    if (l.completed) cur.completed++;
    byHabitId.set(key, cur);
  });

  const weekly: { week: string; completion: number; count: number }[] = [];
  for (let i = 51; i >= 0; i--) {
    const start = addDays(today, -i * 7);
    const end = addDays(start, 6);
    const weekLogs = habitLogs.filter(
      (l) => l.date >= start && l.date <= end && l.completed
    );
    const totalPossible = habits.length * 7;
    const pct = totalPossible ? (weekLogs.length / totalPossible) * 100 : 0;
    weekly.push({
      week: start.toISOString().slice(0, 10),
      completion: Math.round(pct),
      count: weekLogs.length,
    });
  }

  const monthly: { month: string; completion: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const start = startOfDay(d);
    const end = addDays(new Date(d.getFullYear(), d.getMonth() + 1, 0), 0);
    const monthLogs = habitLogs.filter(
      (l) => l.date >= start && l.date <= end && l.completed
    );
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const totalPossible = habits.length * daysInMonth;
    const pct = totalPossible ? (monthLogs.length / totalPossible) * 100 : 0;
    monthly.push({
      month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      completion: Math.round(pct),
    });
  }

  const habitStats = habits.map((h) => {
    const stat = byHabitId.get(h.id) || { completed: 0, total: 0 };
    const pct = stat.total ? (stat.completed / stat.total) * 100 : 0;
    return {
      id: h.id,
      name: h.name,
      type: h.type,
      consistencyPct: h.consistencyPct,
      streak: h.streak,
      loggedCompletion: pct,
    };
  });
  const mostConsistent = [...habitStats].sort((a, b) => b.consistencyPct - a.consistencyPct)[0];
  const weakest = [...habitStats].sort((a, b) => a.consistencyPct - b.consistencyPct)[0];

  const prodTrend = productivityLogs
    .slice(-30)
    .map((p) => p.score)
    .filter((s) => s != null);
  const avgProd = prodTrend.length
    ? prodTrend.reduce((a, b) => a + b, 0) / prodTrend.length
    : 0;

  return NextResponse.json({
    weekly,
    monthly,
    habitStats,
    mostConsistent: mostConsistent || null,
    weakest: weakest || null,
    productivityTrend: avgProd,
  });
}
