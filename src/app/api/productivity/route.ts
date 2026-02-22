import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const day = date ? startOfDay(new Date(date)) : startOfDay(new Date());
  let log = await prisma.productivityLog.findUnique({
    where: {
      userId_date: { userId: session.userId, date: day },
    },
  });
  if (!log) {
    log = await prisma.productivityLog.create({
      data: {
        userId: session.userId,
        date: day,
      },
    });
  }
  return NextResponse.json(log);
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const day = body.date ? startOfDay(new Date(body.date)) : startOfDay(new Date());
    const {
      pomodoroCount,
      focusMinutes,
      deepWorkHours,
      distractions,
      tasksCompleted,
      notes,
    } = body;
    const log = await prisma.productivityLog.upsert({
      where: {
        userId_date: { userId: session.userId, date: day },
      },
      create: {
        userId: session.userId,
        date: day,
        pomodoroCount: pomodoroCount ?? 0,
        focusMinutes: focusMinutes ?? 0,
        deepWorkHours: deepWorkHours ?? 0,
        distractions: distractions ?? 0,
        tasksCompleted: tasksCompleted ?? 0,
        notes: notes ?? null,
      },
      update: {
        pomodoroCount: pomodoroCount ?? undefined,
        focusMinutes: focusMinutes ?? undefined,
        deepWorkHours: deepWorkHours ?? undefined,
        distractions: distractions ?? undefined,
        tasksCompleted: tasksCompleted ?? undefined,
        notes: notes ?? undefined,
      },
    });
    if (log.focusMinutes != null || log.tasksCompleted != null) {
      const score = Math.min(
        100,
        (log.focusMinutes ?? 0) / 4 +
          (log.tasksCompleted ?? 0) * 5 -
          (log.distractions ?? 0) * 5
      );
      await prisma.productivityLog.update({
        where: { id: log.id },
        data: { score: Math.max(0, score) },
      });
      log.score = Math.max(0, score);
    }
    return NextResponse.json(log);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update productivity" },
      { status: 500 }
    );
  }
}
