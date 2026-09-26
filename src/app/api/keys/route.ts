import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { writeLog } from "@/lib/log";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const scriptId = req.nextUrl.searchParams.get("scriptId");
  const keys = await prisma.key.findMany({
    where: scriptId ? { scriptId } : undefined,
    include: { script: { select: { name: true, scriptId: true } }, _count: { select: { downloads: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(keys);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { scriptId } = await req.json();
  if (!scriptId) return NextResponse.json({ error: "scriptId required" }, { status: 400 });

  const script = await prisma.script.findUnique({ where: { id: scriptId } });
  if (!script) return NextResponse.json({ error: "Script not found" }, { status: 404 });

  const key = await prisma.key.create({ data: { scriptId } });
  await writeLog(session.id, "CREATE_KEY", script.scriptId);
  return NextResponse.json(key, { status: 201 });
}
