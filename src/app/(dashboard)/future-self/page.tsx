"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--primary) / 0.8)", "hsl(var(--primary) / 0.6)", "hsl(var(--primary) / 0.4)"];

type Projection = {
  horizon: string;
  label: string;
  bodyTransform: number;
  skillGrowth: number;
  productivityIncrease: number;
  successProbability: number;
  dreamAlignment: number;
};

type Data = {
  currentConsistency: number;
  currentStreak: number;
  dreamAlignment: number;
  dreamLifeDesc: string | null;
  projections: Projection[];
};

export default function FutureSelfPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/future-projection")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = data.projections.map((p) => ({
    name: p.label,
    body: p.bodyTransform,
    skill: p.skillGrowth,
    productivity: p.productivityIncrease,
    success: p.successProbability,
    dream: p.dreamAlignment,
  }));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Future Self</h1>
        <p className="text-muted-foreground mt-1">
          If you keep your current consistency, here’s where you could be.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Current you</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Consistency</p>
              <Progress value={data.currentConsistency} className="h-2 mt-1" />
              <p className="text-lg font-semibold mt-1">{Math.round(data.currentConsistency)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-lg font-semibold">{data.currentStreak} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dream alignment</p>
              <Progress value={data.dreamAlignment} className="h-2 mt-1" />
              <p className="text-lg font-semibold mt-1">{data.dreamAlignment}%</p>
            </div>
          </CardContent>
        </Card>
        {data.dreamLifeDesc && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Your dream life</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap line-clamp-6">
                {data.dreamLifeDesc}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Projected outcomes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estimated results if you maintain current habits
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, ""]}
                  labelFormatter={(_, payload) => payload[0]?.payload?.name}
                />
                <Bar dataKey="success" name="Success probability" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                <Bar dataKey="dream" name="Dream alignment" radius={[4, 4, 0, 0]} fill="hsl(var(--primary) / 0.7)" />
                <Bar dataKey="skillGrowth" name="Skill growth" radius={[4, 4, 0, 0]} fill="hsl(var(--primary) / 0.5)" />
                <Bar dataKey="productivityIncrease" name="Productivity" radius={[4, 4, 0, 0]} fill="hsl(var(--primary) / 0.3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.projections.map((p, i) => (
          <motion.div
            key={p.horizon}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{p.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Success probability</span> {p.successProbability}%</p>
                <p><span className="text-muted-foreground">Dream alignment</span> {p.dreamAlignment}%</p>
                <p><span className="text-muted-foreground">Skill growth</span> {p.skillGrowth}%</p>
                <p><span className="text-muted-foreground">Productivity</span> +{p.productivityIncrease}%</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
