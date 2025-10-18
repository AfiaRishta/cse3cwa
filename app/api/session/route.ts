import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/session → list all sessions
export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return NextResponse.json(sessions);
}

// POST /api/session → create new session
export async function POST(req: Request) {
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
}
