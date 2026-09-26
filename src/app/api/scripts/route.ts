import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { writeLog } from "@/lib/log";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const scripts = await prisma.script.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { keys: true } } },
  });
  return NextResponse.json(scripts);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { scriptId, name, code } = await req.json();
  if (!scriptId || !name) return NextResponse.json({ error: "scriptId and name required" }, { status: 400 });

  const existing = await prisma.script.findUnique({ where: { scriptId } });
  if (existing) return NextResponse.json({ error: "Script ID already exists" }, { status: 409 });

  const script = await prisma.script.create({ data: { scriptId, name, code: code ?? "" } });
  await writeLog(session.id, "CREATE_SCRIPT", scriptId);
  return NextResponse.json(script, { status: 201 });
}
