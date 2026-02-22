"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type UserData = {
  name: string | null;
  email: string;
  age: number | null;
  gender: string | null;
  mainGoal: string | null;
  wakeUpTime: string | null;
  sleepTime: string | null;
  fitnessLevel: string | null;
  weight: number | null;
  height: number | null;
  xp: number;
  level: number;
  disciplineScore: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !user) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Name</span> {user.name ?? "—"}</p>
            <p><span className="text-muted-foreground">Email</span> {user.email}</p>
            <p><span className="text-muted-foreground">Age</span> {user.age ?? "—"}</p>
            <p><span className="text-muted-foreground">Gender</span> {user.gender ?? "—"}</p>
            <p><span className="text-muted-foreground">Main goal</span> {user.mainGoal ?? "—"}</p>
            <p><span className="text-muted-foreground">Wake / Sleep</span> {user.wakeUpTime ?? "—"} / {user.sleepTime ?? "—"}</p>
            <p><span className="text-muted-foreground">Fitness level</span> {user.fitnessLevel ?? "—"}</p>
            <p><span className="text-muted-foreground">Weight / Height</span> {user.weight ?? "—"} kg / {user.height ?? "—"} cm</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Gamification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-2xl font-bold">{user.level}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">XP</p>
              <p className="text-2xl font-bold">{user.xp}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Discipline score</p>
              <Progress value={Math.min(100, user.disciplineScore)} className="h-2 mt-1" />
              <p className="text-lg font-semibold mt-1">{Math.round(user.disciplineScore)}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
