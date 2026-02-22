import { startOfDay, addDays, daysBetween } from "./utils";

/**
 * Calculate current streak (consecutive days with at least one completion)
 */
export function calculateStreak(
  sortedDates: Date[],
  today: Date = new Date()
): number {
  if (sortedDates.length === 0) return 0;
  const todayStart = startOfDay(today);
  const uniqueDays = Array.from(
    new Set(sortedDates.map((d) => startOfDay(d).getTime()))
  )
    .map((t) => new Date(t))
    .sort((a, b) => b.getTime() - a.getTime());

  if (daysBetween(startOfDay(uniqueDays[0]!), todayStart) > 1) return 0;
  let streak = 0;
  let expected = todayStart;
  for (const d of uniqueDays) {
    const dStart = startOfDay(d);
    if (daysBetween(dStart, expected) <= 1) {
      streak++;
      expected = addDays(dStart, -1);
    } else break;
  }
  return streak;
}

/**
 * Habit strength: combines consistency, streak, and recency
 */
export function habitStrengthScore(
  consistencyPct: number,
  streak: number,
  totalLogs: number
): number {
  const consistency = Math.min(100, consistencyPct) / 100;
  const streakBonus = Math.min(streak / 30, 1) * 0.3;
  const volumeBonus = Math.min(totalLogs / 100, 1) * 0.2;
  return Math.round((consistency * 0.5 + streakBonus + volumeBonus) * 100);
}

/**
 * Productivity score (0-100) from focus time, tasks, distractions
 */
export function productivityScore(
  focusMinutes: number,
  tasksCompleted: number,
  distractions: number,
  targetFocusMinutes: number = 240
): number {
  const focusScore = Math.min(1, focusMinutes / targetFocusMinutes) * 40;
  const taskScore = Math.min(1, tasksCompleted / 8) * 35;
  const distractionPenalty = Math.max(0, 1 - distractions * 0.1) * 25;
  return Math.round(Math.min(100, focusScore + taskScore + distractionPenalty));
}

/**
 * Fitness score from workouts, consistency, progression
 */
export function fitnessScore(
  workoutsThisWeek: number,
  targetWorkouts: number,
  consistencyPct: number
): number {
  const volume = Math.min(1, workoutsThisWeek / Math.max(1, targetWorkouts)) * 50;
  const consistency = (consistencyPct / 100) * 50;
  return Math.round(Math.min(100, volume + consistency));
}

/**
 * Success alignment %: how much current habits align with dream goal
 */
export function successAlignmentPercent(
  mainGoal: string,
  habitTypes: string[],
  consistencyByHabit: Record<string, number>
): number {
  const goalMap: Record<string, string[]> = {
    gym: ["Gym", "Cardio", "Water intake", "Calories"],
    business: ["Business work", "Study", "Content creation"],
    study: ["Study", "Reading", "Meditation"],
    content: ["Content creation", "Study", "Reading"],
    discipline: ["Meditation", "Reading", "Study", "Gym"],
    custom: habitTypes,
  };
  const relevant = goalMap[mainGoal?.toLowerCase()] || habitTypes;
  if (relevant.length === 0) return 0;
  const scores = relevant
    .filter((t) => habitTypes.includes(t))
    .map((t) => consistencyByHabit[t] ?? 0);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  return Math.round(Math.min(100, avg));
}

/**
 * Future projection: estimate outcomes based on current consistency
 */
export function futureProjectionEstimate(
  horizonMonths: number,
  currentConsistency: number,
  currentStreak: number
): {
  bodyTransform: number;
  skillGrowth: number;
  productivityIncrease: number;
  successProbability: number;
  dreamAlignment: number;
} {
  const consistencyFactor = currentConsistency / 100;
  const streakFactor = Math.min(currentStreak / 30, 1);
  const timeFactor = Math.min(horizonMonths / 36, 1);
  const base = (consistencyFactor * 0.6 + streakFactor * 0.4) * timeFactor;
  return {
    bodyTransform: Math.round(base * 85 + Math.random() * 10),
    skillGrowth: Math.round(base * 90 + Math.random() * 8),
    productivityIncrease: Math.round(base * 80 + Math.random() * 12),
    successProbability: Math.round(base * 88 + Math.random() * 7),
    dreamAlignment: Math.round(base * 92 + Math.random() * 5),
  };
}
