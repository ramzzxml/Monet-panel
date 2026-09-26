import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Run once to seed owner. Delete this file after first deploy.
export async function POST() {
  const existing = await prisma.admin.findFirst({ where: { role: "OWNER" } });
  if (existing) return NextResponse.json({ error: "Owner already exists" }, { status: 400 });

  const username = process.env.OWNER_USERNAME;
  const password = process.env.OWNER_PASSWORD;
  if (!username || !password) return NextResponse.json({ error: "Set OWNER_USERNAME and OWNER_PASSWORD env vars" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({ data: { username, password: hashed, role: "OWNER" } });
  return NextResponse.json({ ok: true, id: admin.id });
}
