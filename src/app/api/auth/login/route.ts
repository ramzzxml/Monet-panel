import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await signToken({ id: admin.id, username: admin.username, role: admin.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
