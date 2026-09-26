import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [scripts, keys, downloads, uniqueDevices, trend] = await Promise.all([
    prisma.script.count(),
    prisma.key.count(),
    prisma.download.count({ where: { success: true } }),
    prisma.download.groupBy({ by: ["hwid"] }).then((r) => r.length),
    // last 30 days downloads grouped by day
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(*) as count
      FROM "Download"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC
    `,
  ]);

  const bannedKeys = await prisma.key.count({ where: { banned: true } });

  return NextResponse.json({
    scripts,
    keys,
    activeKeys: keys - bannedKeys,
    bannedKeys,
    downloads,
    uniqueDevices,
    trend: trend.map((t) => ({ day: t.day, count: Number(t.count) })),
  });
}
