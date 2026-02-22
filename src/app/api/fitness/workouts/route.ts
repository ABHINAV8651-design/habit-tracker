import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const workouts = await prisma.workout.findMany({
    where: {
      userId: session.userId,
      ...(from && to
        ? {
            date: {
              gte: new Date(from),
              lte: new Date(to),
            },
          }
        : {}),
    },
    include: { exercises: true },
    orderBy: { date: "desc" },
    take: 50,
  });
  return NextResponse.json(workouts);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, date, duration, notes, exercises } = body;
    const workout = await prisma.workout.create({
      data: {
        userId: session.userId,
        name: name || "Workout",
        date: date ? new Date(date) : new Date(),
        duration: duration != null ? Number(duration) : null,
        notes: notes || null,
      },
    });
    if (Array.isArray(exercises) && exercises.length > 0) {
      await prisma.exercise.createMany({
        data: exercises.map((e: { name: string; sets?: number; reps?: number; weight?: number; duration?: number }) => ({
          workoutId: workout.id,
          name: e.name,
          sets: e.sets ?? null,
          reps: e.reps ?? null,
          weight: e.weight ?? null,
          duration: e.duration ?? null,
        })),
      });
    }
    const withExercises = await prisma.workout.findUnique({
      where: { id: workout.id },
      include: { exercises: true },
    });
    return NextResponse.json(withExercises);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    );
  }
}
