export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      style={{ backgroundColor: "hsl(240 10% 4%)", color: "hsl(0 0% 98%)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "hsl(263 70% 58%)", borderTopColor: "transparent" }}
        />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
