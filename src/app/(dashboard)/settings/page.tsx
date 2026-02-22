"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  async function saveTheme(value: "dark" | "light") {
    setTheme(value);
    setSaving(true);
    try {
      await fetch("/api/user/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: value }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Appearance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose dark or light mode
            </p>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label>Theme</Label>
            <div className="flex gap-2">
              <Button
                variant={resolvedTheme === "dark" ? "default" : "outline"}
                size="sm"
                className="rounded-xl"
                onClick={() => saveTheme("dark")}
                disabled={saving}
              >
                Dark
              </Button>
              <Button
                variant={resolvedTheme === "light" ? "default" : "outline"}
                size="sm"
                className="rounded-xl"
                onClick={() => saveTheme("light")}
                disabled={saving}
              >
                Light
              </Button>
            </div>
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
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Smart reminders and daily summary (push ready)
            </p>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label>Enable notifications</Label>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
