import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateSuiviQuotidienInput } from "@/types/suiviQuotidien";

/**
 * GET /api/suivi-quotidiens/[id]
 * Récupérer un suivi quotidien par ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const suivi = await prisma.suiviQuotidien.findUnique({
      where: { id },
      include: {
        company: true,
        lot: true,
        product: true,
      },
    });

    if (!suivi) {
      return NextResponse.json(
        { success: false, error: "Suivi quotidien not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: suivi });
  } catch (error: any) {
    console.error(`Error GET /suivi-quotidiens/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch suivi quotidien" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/suivi-quotidiens/[id]
 * Mettre à jour un suivi quotidien et ajuster le stock
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateSuiviQuotidienInput = await request.json();

    const updatedSuivi = await prisma.$transaction(async (tx) => {
      // 1️⃣ Récupérer l'ancien suivi
      const oldSuivi = await tx.suiviQuotidien.findUnique({
        where: { id },
      });

      if (!oldSuivi) throw new Error(`Suivi quotidien ${id} not found`);

      // 2️⃣ Vérifier si le lot existe si on change de lot
      if (body.lotId && body.lotId !== oldSuivi.lotId) {
        const lotExists = await tx.shop.findUnique({ where: { id: body.lotId } });
        if (!lotExists) throw new Error(`Lot ${body.lotId} not found`);
      }

      // 3️⃣ Vérifier si le produit existe si on change de produit
      if (body.productId && body.productId !== oldSuivi.productId) {
        const productExists = await tx.product.findUnique({ where: { id: body.productId } });
        if (!productExists) throw new Error(`Product ${body.productId} not found`);
      }

      // 4️⃣ Construire updateData dynamiquement
      const updateData: any = {};
      if (body.lotId !== undefined) updateData.lotId = body.lotId;
      if (body.productId !== undefined) updateData.productId = body.productId;
      if (body.dateSuivi !== undefined) updateData.dateSuivi = new Date(body.dateSuivi);
      if (body.mortalite !== undefined) updateData.mortalite = body.mortalite;
      if (body.quantiteAlimentKg !== undefined) updateData.quantiteAlimentKg = body.quantiteAlimentKg;
      if (body.observations !== undefined) updateData.observations = body.observations;

      // 5️⃣ Mise à jour du suivi
      const suivi = await tx.suiviQuotidien.update({
        where: { id },
        data: updateData,
        include: { company: true, lot: true, product: true },
      });

      // 6️⃣ Ajustement du stock si productId présent
      const oldProductId = oldSuivi.productId;
      const newProductId = body.productId ?? oldProductId;

      if (newProductId) {
        const product = await tx.product.findUnique({ where: { id: newProductId } });
        if (product) {
          let currentContent = parseFloat(product.content) || 0;

          // Calcul de la quantité précédente à remettre
          const oldQuantite = (oldSuivi.productId === newProductId)
            ? parseFloat(oldSuivi.quantiteAlimentKg.toString())
            : 0;

          // Nouvelle quantité à retirer
          const newQuantite = body.quantiteAlimentKg !== undefined
            ? parseFloat(body.quantiteAlimentKg.toString())
            : parseFloat(oldSuivi.quantiteAlimentKg.toString());

          // Si changement de produit, remettre l’ancienne quantité au stock du produit précédent
          if (oldProductId && oldProductId !== newProductId) {
            const oldProduct = await tx.product.findUnique({ where: { id: oldProductId } });
            if (oldProduct) {
              const oldContent = parseFloat(oldProduct.content) || 0;
              await tx.product.update({
                where: { id: oldProductId },
                data: { content: (oldContent + parseFloat(oldSuivi.quantiteAlimentKg.toString())).toString() },
              });
            }
            currentContent = parseFloat(product.content) || 0; // refresh stock du nouveau produit
          }

          const adjustedContent = Math.max(0, currentContent + oldQuantite - newQuantite);

          await tx.product.update({
            where: { id: newProductId },
            data: { content: adjustedContent.toString() },
          });
        }
      }

      return suivi;
    });

    return NextResponse.json({
      success: true,
      data: updatedSuivi,
      message: "Suivi quotidien updated successfully",
    });
  } catch (error: any) {
    console.error(`Error PUT /suivi-quotidiens/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update suivi quotidien" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/suivi-quotidiens/[id]
 * Supprimer un suivi quotidien et remettre la quantité en stock
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await prisma.$transaction(async (tx) => {
      const suivi = await tx.suiviQuotidien.findUnique({ where: { id } });
      if (!suivi) throw new Error(`Suivi quotidien ${id} not found`);

      // Remettre la quantité au stock si produit associé
      if (suivi.productId) {
        const product = await tx.product.findUnique({ where: { id: suivi.productId } });
        if (product) {
          const currentContent = parseFloat(product.content) || 0;
          const quantite = parseFloat(suivi.quantiteAlimentKg.toString());
          await tx.product.update({
            where: { id: suivi.productId },
            data: { content: (currentContent + quantite).toString() },
          });
        }
      }

      await tx.suiviQuotidien.delete({ where: { id } });

      return { success: true, message: `Suivi quotidien ${id} deleted successfully` };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error DELETE /suivi-quotidiens/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete suivi quotidien" },
      { status: 500 }
    );
  }
}
