"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground"
      style={{ backgroundColor: "hsl(240 10% 4%)", color: "hsl(0 0% 98%)" }}
    >
      <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground text-sm mb-6 text-center max-w-md">
        The app hit an error. You can try again or go back home.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} className="rounded-2xl">
          Try again
        </Button>
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
