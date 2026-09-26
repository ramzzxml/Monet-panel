import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth";
import { writeLog } from "@/lib/log";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await requireOwner().catch(() => null);
  if (!session) return NextResponse.json({ error: "Owner only" }, { status: 403 });

  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, username: true, role: true, createdAt: true } });
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const session = await requireOwner().catch(() => null);
  if (!session) return NextResponse.json({ error: "Owner only" }, { status: 403 });

  const { username, password } = await req.json();
  if (!username || !password || password.length < 6)
    return NextResponse.json({ error: "username and password (min 6 chars) required" }, { status: 400 });

  const exists = await prisma.admin.findUnique({ where: { username } });
  if (exists) return NextResponse.json({ error: "Username taken" }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({ data: { username, password: hashed, role: "ADMIN" } });
  await writeLog(session.id, "CREATE_ACCESS", username);
  return NextResponse.json({ id: admin.id, username: admin.username, role: admin.role }, { status: 201 });
}
