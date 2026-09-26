import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { writeLog } from "@/lib/log";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { banned } = await req.json();
  const key = await prisma.key.update({ where: { id }, data: { banned } });
  await writeLog(session.id, "BAN_KEY", key.key);
  return NextResponse.json(key);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const key = await prisma.key.delete({ where: { id } });
  await writeLog(session.id, "DELETE_KEY", key.key);
  return NextResponse.json({ ok: true });
}
