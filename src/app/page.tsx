import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", backgroundColor: "hsl(240 10% 4%)" }}
    >
      <div className="text-center max-w-2xl animate-fade-in" style={{ maxWidth: "42rem", textAlign: "center" }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary mb-6" style={{ color: "hsl(263 70% 58%)", marginBottom: "1.5rem" }}>
          <Sparkles className="h-4 w-4" />
          Your Life Operating System
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 700, marginBottom: "1rem", color: "hsl(0 0% 98%)" }}>
          FutureMe <span className="text-primary" style={{ color: "hsl(263 70% 58%)" }}>AI</span>
          <br />
          Life OS
        </h1>
        <p className="text-lg text-muted-foreground mb-10" style={{ fontSize: "1.125rem", marginBottom: "2.5rem", color: "hsl(240 5% 65%)" }}>
          Habits · Fitness · Productivity · AI Coach · Future Projection
        </p>
        <div className="flex flex-wrap gap-4 justify-center" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/login">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg" className="rounded-2xl">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
