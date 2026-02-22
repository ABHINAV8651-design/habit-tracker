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
  const logs = await prisma.waterLog.findMany({
    where: { userId: session.userId, date: day },
  });
  const total = logs.reduce((s, l) => s + l.amount, 0);
  return NextResponse.json({ logs, total });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { amount, date } = body;
    const day = date ? startOfDay(new Date(date)) : startOfDay(new Date());
    await prisma.waterLog.create({
      data: {
        userId: session.userId,
        amount: Number(amount) || 1,
        date: day,
      },
    });
    const logs = await prisma.waterLog.findMany({
      where: { userId: session.userId, date: day },
    });
    const total = logs.reduce((s, l) => s + l.amount, 0);
    return NextResponse.json({ logs, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to log water" },
      { status: 500 }
    );
  }
}
