"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, Timer, Target, Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;

export default function ProductivityPage() {
  const [log, setLog] = useState<{
    pomodoroCount: number;
    focusMinutes: number;
    deepWorkHours: number;
    distractions: number;
    tasksCompleted: number;
    score: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timerSecs, setTimerSecs] = useState(POMODORO_WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  function load() {
    fetch("/api/productivity")
      .then((r) => r.json())
      .then(setLog)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => {
      setTimerSecs((s) => {
        if (s <= 1) {
          setIsRunning(false);
          if (isBreak) {
            setTimerSecs(POMODORO_WORK);
            setIsBreak(false);
          } else {
            setTimerSecs(POMODORO_BREAK);
            setIsBreak(true);
            fetch("/api/productivity")
              .then((r) => r.json())
              .then((current) => {
                return fetch("/api/productivity", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    pomodoroCount: (current.pomodoroCount ?? 0) + 1,
                    focusMinutes: (current.focusMinutes ?? 0) + 25,
                    tasksCompleted: current.tasksCompleted ?? 0,
                    distractions: current.distractions ?? 0,
                  }),
                });
              })
              .then(() => load());
          }
          return isBreak ? POMODORO_WORK : POMODORO_BREAK;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isRunning, isBreak]);

  async function updateField(field: string, delta: number) {
    const next = Math.max(0, (log as any)[field] + delta);
    const body: any = { ...log, [field]: next };
    const res = await fetch("/api/productivity", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) load();
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading || !log) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Productivity</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Pomodoro
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Focus for 25 min, then 5 min break.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <p className="text-4xl font-mono font-bold tabular-nums">
                {formatTime(timerSecs)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isBreak ? "Break" : "Focus"}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                className="rounded-2xl"
                onClick={() => {
                  if (timerSecs === POMODORO_WORK || timerSecs === POMODORO_BREAK) {
                    setTimerSecs(isBreak ? POMODORO_BREAK : POMODORO_WORK);
                  }
                  setIsRunning(true);
                }}
                disabled={isRunning}
              >
                Start
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => setIsRunning(false)}
              >
                Pause
              </Button>
              <Button
                variant="ghost"
                className="rounded-2xl"
                onClick={() => {
                  setIsRunning(false);
                  setTimerSecs(POMODORO_WORK);
                  setIsBreak(false);
                }}
              >
                Reset
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Sessions today: {log.pomodoroCount}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today&apos;s stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Focus (min)</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  onClick={() => updateField("focusMinutes", -15)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-mono">{log.focusMinutes}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  onClick={() => updateField("focusMinutes", 15)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Tasks completed</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  onClick={() => updateField("tasksCompleted", -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-mono">{log.tasksCompleted}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  onClick={() => updateField("tasksCompleted", 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Distractions</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  onClick={() => updateField("distractions", -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-mono">{log.distractions}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  onClick={() => updateField("distractions", 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Productivity score</Label>
              <Progress value={Math.min(100, log.score)} className="h-2 mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round(Math.min(100, log.score))} / 100
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
