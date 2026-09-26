import { prisma } from "./prisma";
import { LogAction } from "@prisma/client";

export async function writeLog(adminId: string, action: LogAction, detail?: string) {
  await prisma.log.create({ data: { adminId, action, detail } });
}
