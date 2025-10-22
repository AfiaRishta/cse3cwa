import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/session → list all sessions
export async function GET() {
  console.log("[instrument] api", { path: "/api/session", method: "GET" });
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { id: "desc" },
      take: 20,
    });
    return NextResponse.json(sessions, { status: 200 });
  } catch (err) {
    console.error("[instrument] api-error", {
      path: "/api/session",
      method: "GET",
      err,
    });
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

// POST /api/session → create new session
export async function POST(req: Request) {
  console.log("[instrument] api", { path: "/api/session", method: "POST" });
  try {
    const body = await req.json();
    const newSession = await prisma.session.create({
      data: {
        minutes: body.minutes ?? 5,
        doneAlt: body.done?.alt ?? false,
        doneValidation: body.done?.validation ?? false,
        doneLogin: body.done?.login ?? false,
        doneSecureDb: body.done?.securedb ?? false,
        doneTitleColor: body.done?.titlecolor ?? false,
      },
    });
    return NextResponse.json(newSession, { status: 201 });
  } catch (err) {
    console.error("[instrument] api-error", {
      path: "/api/session",
      method: "POST",
      err,
    });
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
