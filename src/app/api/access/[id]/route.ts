import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth";
import { writeLog } from "@/lib/log";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireOwner().catch(() => null);
  if (!session) return NextResponse.json({ error: "Owner only" }, { status: 403 });

  const { id } = await params;
  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (target.role === "OWNER") return NextResponse.json({ error: "Cannot delete owner" }, { status: 400 });

  await prisma.admin.delete({ where: { id } });
  await writeLog(session.id, "DELETE_ACCESS", target.username);
  return NextResponse.json({ ok: true });
}
