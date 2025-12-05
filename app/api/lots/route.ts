import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface SessionUser {
  id: string;
  role: "Admin" | "Secrétaire" | "Employé";
  companyId: string;
}

// Fonction pour récupérer l'utilisateur connecté depuis le JWT
async function getSessionUser(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;
  try {
    const { jwtVerify } = await import("jose");
    const secret = new TextEncoder().encode(process.env.GENUKA_CLIENT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

// GET : liste des lots pour la company de l'utilisateur
export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lots = await prisma.lot.findMany({
    where: {
      companyId: user.companyId, // ✅ filtrage direct via companyId
    },
    include: { batiment: true },
  });

  return NextResponse.json(lots);
}

// POST : création d'un nouveau lot (Admin ou Secrétaire)
export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user || (user.role !== "Admin" && user.role !== "Secrétaire")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // Création du lot avec le companyId assigné
  const lot = await prisma.lot.create({
    data: {
      ...body,
      companyId: user.companyId, // ✅ OK ici
    },
  });

  return NextResponse.json(lot);
}
