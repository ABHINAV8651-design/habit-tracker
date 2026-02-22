import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {
      name,
      age,
      gender,
      mainGoal,
      currentStruggles,
      wakeUpTime,
      sleepTime,
      fitnessLevel,
      weight,
      height,
      dailyFreeTime,
      dreamLifeDesc,
    } = body;
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: name ?? undefined,
        age: age != null ? Number(age) : undefined,
        gender: gender ?? undefined,
        mainGoal: mainGoal ?? undefined,
        currentStruggles: currentStruggles ?? undefined,
        wakeUpTime: wakeUpTime ?? undefined,
        sleepTime: sleepTime ?? undefined,
        fitnessLevel: fitnessLevel ?? undefined,
        weight: weight != null ? Number(weight) : undefined,
        height: height != null ? Number(height) : undefined,
        dailyFreeTime: dailyFreeTime ?? undefined,
        dreamLifeDesc: dreamLifeDesc ?? undefined,
        onboardingComplete: true,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Onboarding update failed" },
      { status: 500 }
    );
  }
}
