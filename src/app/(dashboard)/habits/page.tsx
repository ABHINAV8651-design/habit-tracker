"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSuccess } from "@/lib/sound";
import {
  Plus,
  Target,
  Check,
  Trash2,
  ChevronDown,
  Droplets,
  Flame,
  BookOpen,
  Dumbbell,
  Brain,
  Zap,
  Briefcase,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const TYPE_ICONS: Record<string, LucideIcon> = {
  Study: BookOpen,
  Gym: Dumbbell,
  "Water intake": Droplets,
  Calories: Flame,
  Cardio: Zap,
  Meditation: Brain,
  Reading: BookOpen,
  "Business work": Briefcase,
  "Content creation": Video,
  Custom: Target,
};

type Habit = {
  id: string;
  name: string;
  type: string;
  targetFrequency: string;
  targetHours: number | null;
  targetCount: number | null;
  reminderTime: string | null;
  priority: number;
  categoryTag: string | null;
  notes: string | null;
  streak: number;
  consistencyPct: number;
  strengthScore: number;
  todayCompleted?: boolean;
};

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Custom",
    targetFrequency: "daily",
    targetHours: "",
    targetCount: "",
    reminderTime: "",
    priority: "1",
    categoryTag: "",
    notes: "",
  });
  const [todayLogs, setTodayLogs] = useState<Record<string, boolean>>({});

  function loadHabits() {
    fetch("/api/habits?withToday=1")
      .then((r) => r.json())
      .then((data) => {
        setHabits(data);
        const map: Record<string, boolean> = {};
        data.forEach((h: Habit) => {
          map[h.id] = !!h.todayCompleted;
        });
        setTodayLogs(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadHabits();
  }, []);

  async function toggleLog(habitId: string) {
    const next = !todayLogs[habitId];
    const res = await fetch("/api/habits/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, completed: next }),
    });
    if (res.ok) {
      if (next) playSuccess();
      setTodayLogs((prev) => ({ ...prev, [habitId]: next }));
      loadHabits();
    }
  }

  async function createHabit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        type: form.type,
        targetFrequency: form.targetFrequency,
        targetHours: form.targetHours ? Number(form.targetHours) : null,
        targetCount: form.targetCount ? Number(form.targetCount) : null,
        reminderTime: form.reminderTime || null,
        priority: Number(form.priority),
        categoryTag: form.categoryTag || null,
        notes: form.notes || null,
      }),
    });
    if (res.ok) {
      setForm({
        name: "",
        type: "Custom",
        targetFrequency: "daily",
        targetHours: "",
        targetCount: "",
        reminderTime: "",
        priority: "1",
        categoryTag: "",
        notes: "",
      });
      setShowForm(false);
      loadHabits();
    }
  }

  async function deleteHabit(id: string) {
    if (!confirm("Delete this habit?")) return;
    const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
    if (res.ok) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
      setTodayLogs((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
        <Button
          className="rounded-2xl"
          onClick={() => setShowForm((s) => !s)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add habit
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle>New habit</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                  <form onSubmit={createHabit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="e.g. Morning run"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={form.type}
                          onValueChange={(v) =>
                            setForm((f) => ({ ...f, type: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Study",
                              "Gym",
                              "Water intake",
                              "Calories",
                              "Cardio",
                              "Meditation",
                              "Reading",
                              "Business work",
                              "Content creation",
                              "Custom",
                            ].map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Target frequency</Label>
                        <Select
                          value={form.targetFrequency}
                          onValueChange={(v) =>
                            setForm((f) => ({ ...f, targetFrequency: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Priority (1–5)</Label>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={form.priority}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, priority: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={form.notes}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, notes: e.target.value }))
                        }
                        placeholder="Optional"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="rounded-2xl">
                        Create
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {habits.length === 0 && !showForm ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No habits yet. Add one to start tracking.</p>
              <Button
                className="mt-4 rounded-2xl"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          habits.map((habit, i) => {
            const Icon = TYPE_ICONS[habit.type] || Target;
            const completed = todayLogs[habit.id];
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleLog(habit.id)}
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <Check className="h-6 w-6" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{habit.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4" />
                        <span>{habit.type}</span>
                        <span>·</span>
                        <span>Streak {habit.streak}</span>
                        <span>·</span>
                        <span>{Math.round(habit.consistencyPct)}%</span>
                      </div>
                      <Progress
                        value={habit.consistencyPct}
                        className="h-1.5 mt-2"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive rounded-xl"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
