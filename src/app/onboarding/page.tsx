"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEPS = [
  { key: "name", title: "About you", fields: ["name", "age", "gender"] },
  { key: "goal", title: "Your focus", fields: ["mainGoal", "currentStruggles"] },
  { key: "schedule", title: "Schedule", fields: ["wakeUpTime", "sleepTime", "dailyFreeTime"] },
  { key: "fitness", title: "Fitness", fields: ["fitnessLevel", "weight", "height"] },
  { key: "dream", title: "Your dream life", fields: ["dreamLifeDesc"] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string | number>>({
    name: "",
    age: "",
    gender: "",
    mainGoal: "",
    currentStruggles: "",
    wakeUpTime: "",
    sleepTime: "",
    fitnessLevel: "",
    weight: "",
    height: "",
    dailyFreeTime: "",
    dreamLifeDesc: "",
  });

  const currentStep = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  async function handleNext() {
    if (isLast) {
      setLoading(true);
      try {
        const res = await fetch("/api/onboarding", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed");
        router.push("/dashboard");
        router.refresh();
      } catch {
        setLoading(false);
      }
      return;
    }
    setStep((s) => s + 1);
  }

  function update(key: string, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <Card className="glass-card border-white/10">
          <CardHeader>
            <div className="flex gap-1 mb-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <CardTitle>{currentStep.title}</CardTitle>
            <CardDescription>Help us personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {currentStep.fields.includes("name") && (
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Your name"
                    value={String(form.name)}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
              )}
              {currentStep.fields.includes("age") && (
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={form.age || ""}
                    onChange={(e) => update("age", e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
              )}
              {currentStep.fields.includes("gender") && (
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={String(form.gender)}
                    onValueChange={(v) => update("gender", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {currentStep.fields.includes("mainGoal") && (
                <div className="space-y-2">
                  <Label>Main goal</Label>
                  <Select
                    value={String(form.mainGoal)}
                    onValueChange={(v) => update("mainGoal", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gym">Gym</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Content">Content</SelectItem>
                      <SelectItem value="Discipline">Discipline</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {currentStep.fields.includes("currentStruggles") && (
                <div className="space-y-2">
                  <Label>Current struggles</Label>
                  <Textarea
                    placeholder="What gets in your way?"
                    value={String(form.currentStruggles)}
                    onChange={(e) => update("currentStruggles", e.target.value)}
                    rows={3}
                  />
                </div>
              )}
              {currentStep.fields.includes("wakeUpTime") && (
                <div className="space-y-2">
                  <Label>Wake-up time</Label>
                  <Input
                    type="time"
                    value={String(form.wakeUpTime)}
                    onChange={(e) => update("wakeUpTime", e.target.value)}
                  />
                </div>
              )}
              {currentStep.fields.includes("sleepTime") && (
                <div className="space-y-2">
                  <Label>Sleep time</Label>
                  <Input
                    type="time"
                    value={String(form.sleepTime)}
                    onChange={(e) => update("sleepTime", e.target.value)}
                  />
                </div>
              )}
              {currentStep.fields.includes("dailyFreeTime") && (
                <div className="space-y-2">
                  <Label>Daily free time (e.g. 2 hours)</Label>
                  <Input
                    placeholder="e.g. 2"
                    value={String(form.dailyFreeTime)}
                    onChange={(e) => update("dailyFreeTime", e.target.value)}
                  />
                </div>
              )}
              {currentStep.fields.includes("fitnessLevel") && (
                <div className="space-y-2">
                  <Label>Fitness level</Label>
                  <Select
                    value={String(form.fitnessLevel)}
                    onValueChange={(v) => update("fitnessLevel", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Athlete">Athlete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {currentStep.fields.includes("weight") && (
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={form.weight || ""}
                    onChange={(e) => update("weight", e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
              )}
              {currentStep.fields.includes("height") && (
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="175"
                    value={form.height || ""}
                    onChange={(e) => update("height", e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
              )}
              {currentStep.fields.includes("dreamLifeDesc") && (
                <div className="space-y-2">
                  <Label>Describe your dream life</Label>
                  <Textarea
                    placeholder="Where do you see yourself in 3 years? What does success look like?"
                    value={String(form.dreamLifeDesc)}
                    onChange={(e) => update("dreamLifeDesc", e.target.value)}
                    rows={5}
                  />
                </div>
              )}
            </AnimatePresence>
            <div className="flex gap-2 pt-4">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                className="rounded-2xl flex-1"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Saving…" : isLast ? "Finish" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
