"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Plus,
  Droplets,
  Flame,
  TrendingUp,
  Beef,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function FitnessPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [waterTotal, setWaterTotal] = useState(0);
  const [caloriesTotal, setCaloriesTotal] = useState(0);
  const [proteinTotal, setProteinTotal] = useState(0);
  const [waterGoal] = useState(8);
  const [caloriesGoal] = useState(2200);
  const [loading, setLoading] = useState(true);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    name: "",
    duration: "",
    notes: "",
  });

  function load() {
    const today = new Date().toISOString().slice(0, 10);
    Promise.all([
      fetch("/api/fitness/workouts?from=" + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + "&to=" + today)
        .then((r) => r.json()),
      fetch("/api/fitness/water?date=" + today).then((r) => r.json()),
      fetch("/api/fitness/calories?date=" + today).then((r) => r.json()),
    ])
      .then(([w, water, cal]) => {
        setWorkouts(w);
        setWaterTotal(water.total ?? 0);
        setCaloriesTotal(cal.total ?? 0);
        setProteinTotal(cal.protein ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function addWater() {
    const res = await fetch("/api/fitness/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1 }),
    });
    const data = await res.json();
    if (data.total != null) setWaterTotal(data.total);
  }

  async function addWorkout(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/fitness/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: workoutForm.name || "Workout",
        duration: workoutForm.duration ? Number(workoutForm.duration) : null,
        notes: workoutForm.notes || null,
      }),
    });
    if (res.ok) {
      setWorkoutForm({ name: "", duration: "", notes: "" });
      setShowWorkoutForm(false);
      load();
    }
  }

  const weightData = workouts
    .filter((w) => w.duration != null)
    .slice(0, 14)
    .reverse()
    .map((w, i) => ({
      day: new Date(w.date).toLocaleDateString("en-US", { weekday: "short" }),
      duration: w.duration,
    }));

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fitness</h1>
        <Button
          className="rounded-2xl"
          onClick={() => setShowWorkoutForm((s) => !s)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Log workout
        </Button>
      </div>

      {showWorkoutForm && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Log workout</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addWorkout} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={workoutForm.name}
                    onChange={(e) =>
                      setWorkoutForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Upper body"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input
                    type="number"
                    value={workoutForm.duration}
                    onChange={(e) =>
                      setWorkoutForm((f) => ({ ...f, duration: e.target.value }))
                    }
                    placeholder="45"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={workoutForm.notes}
                    onChange={(e) =>
                      setWorkoutForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    placeholder="Optional"
                  />
                </div>
                <Button type="submit" className="rounded-2xl">
                  Save
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Water
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{waterTotal} / {waterGoal} glasses</p>
            <Progress
              value={Math.min(100, (waterTotal / waterGoal) * 100)}
              className="h-2 mt-2"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-3 rounded-xl"
              onClick={addWater}
            >
              +1 glass
            </Button>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{caloriesTotal} / {caloriesGoal} kcal</p>
            <Progress
              value={Math.min(100, (caloriesTotal / caloriesGoal) * 100)}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Beef className="h-5 w-5 text-amber-500" />
              Protein
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(proteinTotal)}g</p>
            <p className="text-sm text-muted-foreground">today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Workout duration (last 14)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">Log workouts to see progress.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Recent workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No workouts yet.</p>
          ) : (
            <ul className="space-y-2">
              {workouts.slice(0, 10).map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2"
                >
                  <span className="font-medium">{w.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(w.date).toLocaleDateString()} · {w.duration ?? "—"} min
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
