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
  const logs = await prisma.calorieLog.findMany({
    where: { userId: session.userId, date: day },
  });
  const total = logs.reduce((s, l) => s + l.calories, 0);
  const protein = logs.reduce((s, l) => s + (l.protein ?? 0), 0);
  return NextResponse.json({ logs, total, protein });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { calories, protein, date, mealType, notes } = body;
    const day = date ? startOfDay(new Date(date)) : startOfDay(new Date());
    await prisma.calorieLog.create({
      data: {
        userId: session.userId,
        calories: Number(calories) || 0,
        protein: protein != null ? Number(protein) : null,
        date: day,
        mealType: mealType || null,
        notes: notes || null,
      },
    });
    const logs = await prisma.calorieLog.findMany({
      where: { userId: session.userId, date: day },
    });
    const total = logs.reduce((s, l) => s + l.calories, 0);
    const proteinTotal = logs.reduce((s, l) => s + (l.protein ?? 0), 0);
    return NextResponse.json({ logs, total, protein: proteinTotal });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to log calories" },
      { status: 500 }
    );
  }
}
