import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js 15’s generated types expect: { params: Promise<{ id: string }> }
type RouteCtxP = { params: Promise<{ id: string }> };

// GET /api/session/[id]
export async function GET(_req: Request, { params }: RouteCtxP) {
  const { id } = await params;
  const numId = Number(id);

  const s = await prisma.session.findUnique({ where: { id: numId } });
  if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(s);
}

// PUT /api/session/[id] → update a session
export async function PUT(req: Request, { params }: RouteCtxP) {
  const { id } = await params;
  const numId = Number(id);
  const body = await req.json();

  const updated = await prisma.session.update({
    where: { id: numId },
    data: {
      minutes: body.minutes,
      doneAlt: body.done?.alt ?? false,
      doneValidation: body.done?.validation ?? false,
      doneLogin: body.done?.login ?? false,
      doneSecureDb: body.done?.securedb ?? false,
      doneTitleColor: body.done?.titlecolor ?? false,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/session/[id] → delete a session
export async function DELETE(_req: Request, { params }: RouteCtxP) {
  const { id } = await params;
  const numId = Number(id);

  await prisma.session.delete({ where: { id: numId } });
  return NextResponse.json({ ok: true });
}
