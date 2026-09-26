import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { writeLog } from "@/lib/log";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, code } = await req.json();
  const script = await prisma.script.update({
    where: { id },
    data: { name, code, version: { increment: 1 } },
  });
  await writeLog(session.id, "UPDATE_SCRIPT", script.scriptId);
  return NextResponse.json(script);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const script = await prisma.script.delete({ where: { id } });
  await writeLog(session.id, "DELETE_SCRIPT", script.scriptId);
  return NextResponse.json({ ok: true });
}
