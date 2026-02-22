"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Insight = {
  id: string;
  title: string;
  content: string;
  category: string;
  type: string;
  createdAt: string;
};

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  function load() {
    fetch("/api/ai-insights")
      .then((r) => r.json())
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai-insights", { method: "POST" });
      const data = await res.json();
      if (res.ok) setInsights(data);
      else alert(data.error || "Failed to generate");
    } finally {
      setGenerating(false);
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
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <Button
          className="rounded-2xl"
          onClick={generate}
          disabled={generating}
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generating…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate insights
            </span>
          )}
        </Button>
      </div>

      <p className="text-muted-foreground max-w-xl">
        AI analyzes your habits, schedule, and productivity to suggest improvements,
        detect burnout, and recommend habit stacking or rest.
      </p>

      <div className="grid gap-4">
        {insights.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No insights yet. Click &quot;Generate insights&quot; to get personalized suggestions.</p>
              <Button className="mt-4 rounded-2xl" onClick={generate} disabled={generating}>
                Generate insights
              </Button>
            </CardContent>
          </Card>
        ) : (
          insights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {insight.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground capitalize">
                    {insight.category}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {insight.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
