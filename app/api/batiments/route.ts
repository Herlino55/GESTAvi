import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface SessionUser { id: string; role: "Admin" | "Secrétaire" | "Employé"; companyId: string; }

async function getSessionUser(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;
  try { const { jwtVerify } = await import("jose"); const secret = new TextEncoder().encode(process.env.GENUKA_CLIENT_SECRET!); const { payload } = await jwtVerify(token, secret); return payload as unknown as SessionUser; } 
  catch { return null; }
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const batiments = await prisma.batiment.findMany({ where: { companyId: user.companyId } });
  return NextResponse.json(batiments);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user || (user.role !== "Admin" && user.role !== "Secrétaire")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const created = await prisma.batiment.create({ data: { ...body, companyId: user.companyId } });

  return NextResponse.json(created);
}
