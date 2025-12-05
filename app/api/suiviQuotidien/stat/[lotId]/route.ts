import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/suivi-quotidiens/stats/[lotId]
 * Obtenir les statistiques d'un lot sur une période
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { lotId: string } }
) {
  try {
    const { lotId } = params;
    const { searchParams } = new URL(request.url);
    
    const where: any = { lotId };
    
    if (searchParams.get('dateDebut') || searchParams.get('dateFin')) {
      where.dateSuivi = {};
      if (searchParams.get('dateDebut')) {
        where.dateSuivi.gte = new Date(searchParams.get('dateDebut')!);
      }
      if (searchParams.get('dateFin')) {
        where.dateSuivi.lte = new Date(searchParams.get('dateFin')!);
      }
    }

    const suivis = await prisma.suiviQuotidien.findMany({
      where,
      orderBy: { dateSuivi: 'asc' },
    });

    const stats = {
      totalMortalite: suivis.reduce((sum: any, s: { mortalite: any; }) => sum + s.mortalite, 0),
      totalAlimentKg: suivis.reduce(
        (sum: number, s: { quantiteAlimentKg: { toString: () => string; }; }) => sum + parseFloat(s.quantiteAlimentKg.toString()), 
        0
      ),
      nombreJours: suivis.length,
      moyenneMortaliteParJour: 0,
      moyenneAlimentParJour: 0,
    };

    if (stats.nombreJours > 0) {
      stats.moyenneMortaliteParJour = parseFloat((stats.totalMortalite / stats.nombreJours).toFixed(2));
      stats.moyenneAlimentParJour = parseFloat((stats.totalAlimentKg / stats.nombreJours).toFixed(2));
    }

    return NextResponse.json({
      success: true,
      data: stats,
      lotId,
    });
  } catch (error: any) {
    console.error(`Error in GET /api/suivi-quotidiens/stats/${params.lotId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch statistics",
      },
      { status: 500 }
    );
  }
}