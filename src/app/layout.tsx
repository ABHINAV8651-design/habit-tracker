import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FutureMe AI – Life OS",
  description: "Your personal life operating system. Habits, fitness, productivity & AI coaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationError className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground`}
        style={{ backgroundColor: "hsl(240 10% 4%)", color: "hsl(0 0% 98%)" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <noscript>
          <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
            FutureMe AI – Life OS. Please enable JavaScript to use the app.
          </div>
        </noscript>
      </body>
    </html>
  );
}
