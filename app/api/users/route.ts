import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

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

// GET : liste des utilisateurs pour la company (Admin seulement)
export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "Admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    where: { companyId: user.companyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(users);
}

// POST : créer un nouvel utilisateur (Admin seulement)
export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user || user.role !== "Admin") 
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  if (!body.name || !body.email || !body.password || !body.roleId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const createdUser = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      roleId: body.roleId,
      companyId: user.companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(createdUser);
}
