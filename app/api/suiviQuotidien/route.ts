import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// const prisma = new Prisma.PrismaClient();

// Schéma de validation pour la création
const createSuiviQuotidienSchema = z.object({
  lotId: z.string().uuid(),
  dateSuivi: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mortalite: z.number().int().min(0).optional().default(0),
  quantiteAlimentKg: z.number().min(0).optional().default(0),
  observations: z.string().optional(),
});

// Schéma de validation pour la mise à jour
const updateSuiviQuotidienSchema = z.object({
  mortalite: z.number().int().min(0).optional(),
  quantiteAlimentKg: z.number().min(0).optional(),
  observations: z.string().optional(),
});

// GET - Récupérer tous les suivis quotidiens d'une entreprise
export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('X-Company');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID manquant dans les headers' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const lotId = searchParams.get('lotId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const whereClause: any = {
      companyId,
    };

    if (lotId) {
      whereClause.lotId = lotId;
    }

    if (startDate && endDate) {
      whereClause.dateSuivi = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const suivis = await prisma.suiviQuotidien.findMany({
      where: whereClause,
      include: {
        // CORRECTION : utiliser le bon nom de relation (lot) et pas shop
        lot: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        dateSuivi: 'desc',
      },
    });

    return NextResponse.json(suivis);
  } catch (error) {
    console.log('Erreur lors de la récupération des suivis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur',errore: error },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau suivi quotidien
export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get('X-Company');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID manquant dans les headers' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validation des données d'entrée
    const validationResult = createSuiviQuotidienSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error },
        { status: 400 }
      );
    }

    const { lotId, dateSuivi, mortalite, quantiteAlimentKg, observations } =
      validationResult.data;

    // Vérifier si le lot existe et appartient à la company
    const lot = await prisma.shop.findFirst({
      where: {
        id: lotId,
        companyId,
      },
    });

    if (!lot) {
      return NextResponse.json(
        { error: "Lot non trouvé ou n'appartenant pas à cette entreprise" },
        { status: 404 }
      );
    }

    // Vérifier si un suivi existe déjà pour cette date et ce lot
    const existingSuivi = await prisma.suiviQuotidien.findFirst({
      where: {
        // CORRECTION : ce champ n'existe que si tu as bien ajouté @@unique([lotId, dateSuivi])
        lotId_dateSuivi: {
          lotId,
          dateSuivi: new Date(dateSuivi),
        },
      },
    });

    if (existingSuivi) {
      return NextResponse.json(
        { error: 'Un suivi existe déjà pour cette date et ce lot' },
        { status: 409 }
      );
    }

    // Créer le suivi quotidien
    const suiviQuotidien = await prisma.suiviQuotidien.create({
      data: {
        companyId,
        lotId,
        dateSuivi: new Date(dateSuivi),
        mortalite,
        quantiteAlimentKg,
        observations,
      },
      include: {
        lot: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Mettre à jour le produit associé (content)
    // Rechercher le produit correspondant au lot
    const product = await prisma.product.findFirst({
      where: {
        handle: lotId, // ou un autre champ qui fait le lien
      },
    });

    if (product) {
      const currentContent = parseInt(product.content) || 0;
      const newContent = currentContent - (mortalite ?? 0);

      await prisma.product.update({
        where: { id: product.id },
        data: { content: newContent.toString() },
      });

      // Optionnel: mise à jour via l'API Genuka
      try {
        // await updateProduct(product.id, { content: newContent.toString() }, { id: companyId, accessToken: 'token' });
      } catch (apiError) {
        console.error('Erreur lors de la mise à jour via API Genuka:', apiError);
        // On ne bloque pas la réponse si l'API externe échoue
      }
    }

    return NextResponse.json(suiviQuotidien, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du suivi:', error);

    if (
      error instanceof Error &&
      error.message.includes('Unique constraint')
    ) {
      return NextResponse.json(
        { error: 'Un suivi existe déjà pour cette date et ce lot' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}