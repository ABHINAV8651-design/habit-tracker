import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
          <Sparkles className="h-4 w-4" />
          Your Life Operating System
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          FutureMe <span className="text-primary">AI</span>
          <br />
          Life OS
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Habits · Fitness · Productivity · AI Coach · Future Projection
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
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
      </motion.div>
    </div>
  );
}
