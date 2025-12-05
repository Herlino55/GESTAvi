import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const roles = await prisma.role.findMany();
  return NextResponse.json(roles);
}
