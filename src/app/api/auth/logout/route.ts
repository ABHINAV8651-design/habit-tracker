import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "http://localhost:3000";
  const res = NextResponse.redirect(new URL("/", url));
  res.cookies.set("auth-token", "", { maxAge: 0, path: "/" });
  return res;
}
