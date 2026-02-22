import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, onboardingComplete: true },
    });
  } catch {
    redirect("/login");
  }
  if (!user) {
    redirect("/login");
  }
  if (!user.onboardingComplete) {
    redirect("/onboarding");
  }
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">{children}</main>
    </div>
  );
}
