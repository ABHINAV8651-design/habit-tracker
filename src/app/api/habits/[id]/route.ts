import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const habit = await prisma.habit.findFirst({
    where: { id, userId: session.userId },
    include: { logs: { orderBy: { date: "desc" }, take: 30 } },
  });
  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(habit);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const habit = await prisma.habit.findFirst({
    where: { id, userId: session.userId },
  });
  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const updated = await prisma.habit.update({
    where: { id },
    data: {
      name: body.name ?? habit.name,
      type: body.type ?? habit.type,
      targetFrequency: body.targetFrequency ?? habit.targetFrequency,
      targetHours: body.targetHours != null ? Number(body.targetHours) : habit.targetHours,
      targetCount: body.targetCount != null ? Number(body.targetCount) : habit.targetCount,
      reminderTime: body.reminderTime ?? habit.reminderTime,
      priority: body.priority != null ? Number(body.priority) : habit.priority,
      categoryTag: body.categoryTag ?? habit.categoryTag,
      notes: body.notes ?? habit.notes,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const habit = await prisma.habit.findFirst({
    where: { id, userId: session.userId },
  });
  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.habit.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
