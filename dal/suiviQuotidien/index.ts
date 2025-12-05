import  prisma  from "@/lib/prisma";
import { 
  CreateSuiviQuotidienInput, 
  UpdateSuiviQuotidienInput,
  GetSuiviQuotidiensParams 
} from "@/types/suiviQuotidien";
import { Decimal } from "@prisma/client/runtime/client";

/**
 * Créer un suivi quotidien et mettre à jour le stock du produit
 */
export const createSuiviQuotidien = async (data: CreateSuiviQuotidienInput) => {
  try {
    // Utiliser une transaction pour garantir la cohérence
    const result = await prisma.$transaction(async (tx) => {
      // 1. Créer le suivi quotidien
      const suivi = await tx.suiviQuotidien.create({
        data: {
          companyId: data.companyId,
          lotId: data.lotId,
          productId: data.productId,
          dateSuivi: new Date(data.dateSuivi),
          mortalite: data.mortalite || 0,
          quantiteAlimentKg: data.quantiteAlimentKg || 0,
          observations: data.observations,
        },
        include: {
          company: true,
          lot: true,
          product: true,
        },
      });

      // 2. Mettre à jour le stock du produit si un productId est fourni
      if (data.productId && data.quantiteAlimentKg) {
        const product = await tx.product.findUnique({
          where: { id: data.productId },
        });

        if (product) {
          const currentContent = parseFloat(product.content);
          const quantiteConsommee = typeof data.quantiteAlimentKg === 'number' 
            ? data.quantiteAlimentKg 
            : parseFloat(data.quantiteAlimentKg.toString());
          
          const newContent = Math.max(0, currentContent - quantiteConsommee);

          await tx.product.update({
            where: { id: data.productId },
            data: { content: newContent.toString() },
          });
        }
      }

      return suivi;
    });

    return result;
  } catch (error) {
    console.error("Error creating suivi quotidien:", error);
    throw error;
  }
};

/**
 * Obtenir un suivi quotidien par ID
 */
export const getSuiviQuotidienById = async (id: string) => {
  try {
    const suivi = await prisma.suiviQuotidien.findUnique({
      where: { id },
      include: {
        company: true,
        lot: true,
        product: true,
      },
    });
    return suivi;
  } catch (error) {
    console.error(`Error fetching suivi quotidien ${id}:`, error);
    throw error;
  }
};

/**
 * Obtenir tous les suivis quotidiens avec filtres optionnels
 */
export const getSuivisQuotidiens = async (params: GetSuiviQuotidiensParams = {}) => {
  try {
    const where: any = {};

    if (params.companyId) where.companyId = params.companyId;
    if (params.lotId) where.lotId = params.lotId;
    if (params.productId) where.productId = params.productId;
    
    if (params.dateDebut || params.dateFin) {
      where.dateSuivi = {};
      if (params.dateDebut) where.dateSuivi.gte = new Date(params.dateDebut);
      if (params.dateFin) where.dateSuivi.lte = new Date(params.dateFin);
    }

    const suivis = await prisma.suiviQuotidien.findMany({
      where,
      include: {
        company: true,
        lot: true,
        product: true,
      },
      orderBy: { dateSuivi: 'desc' },
      take: params.limit || 100,
      skip: params.offset || 0,
    });

    return suivis;
  } catch (error) {
    console.error("Error fetching suivis quotidiens:", error);
    throw error;
  }
};

/**
 * Mettre à jour un suivi quotidien
 */
export const updateSuiviQuotidien = async (
  id: string, 
  data: UpdateSuiviQuotidienInput
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Récupérer l'ancien suivi pour calculer la différence
      const oldSuivi = await tx.suiviQuotidien.findUnique({
        where: { id },
      });

      if (!oldSuivi) {
        throw new Error(`Suivi quotidien ${id} not found`);
      }

      // Mettre à jour le suivi
      const updateData: any = {};
      if (data.lotId !== undefined) updateData.lotId = data.lotId;
      if (data.productId !== undefined) updateData.productId = data.productId;
      if (data.dateSuivi !== undefined) updateData.dateSuivi = new Date(data.dateSuivi);
      if (data.mortalite !== undefined) updateData.mortalite = data.mortalite;
      if (data.quantiteAlimentKg !== undefined) updateData.quantiteAlimentKg = data.quantiteAlimentKg;
      if (data.observations !== undefined) updateData.observations = data.observations;

      const updatedSuivi = await tx.suiviQuotidien.update({
        where: { id },
        data: updateData,
        include: {
          company: true,
          lot: true,
          product: true,
        },
      });

      // Ajuster le stock du produit si la quantité d'aliment a changé
      if (data.quantiteAlimentKg !== undefined && oldSuivi.productId) {
        const product = await tx.product.findUnique({
          where: { id: oldSuivi.productId },
        });

        if (product) {
          const currentContent = parseFloat(product.content);
          const oldQuantite = parseFloat(oldSuivi.quantiteAlimentKg.toString());
          const newQuantite = typeof data.quantiteAlimentKg === 'number' 
            ? data.quantiteAlimentKg 
            : parseFloat(data.quantiteAlimentKg.toString());
          
          // Ajouter l'ancienne quantité (remettre en stock) puis soustraire la nouvelle
          const adjustedContent = currentContent + oldQuantite - newQuantite;
          const finalContent = Math.max(0, adjustedContent);

          await tx.product.update({
            where: { id: oldSuivi.productId },
            data: { content: finalContent.toString() },
          });
        }
      }

      return updatedSuivi;
    });

    return result;
  } catch (error) {
    console.error(`Error updating suivi quotidien ${id}:`, error);
    throw error;
  }
};

/**
 * Supprimer un suivi quotidien
 */
export const deleteSuiviQuotidien = async (id: string) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Récupérer le suivi avant de le supprimer
      const suivi = await tx.suiviQuotidien.findUnique({
        where: { id },
      });

      if (!suivi) {
        throw new Error(`Suivi quotidien ${id} not found`);
      }

      // Remettre la quantité en stock si un produit est associé
      if (suivi.productId) {
        const product = await tx.product.findUnique({
          where: { id: suivi.productId },
        });

        if (product) {
          const currentContent = parseFloat(product.content);
          const quantiteConsommee = parseFloat(suivi.quantiteAlimentKg.toString());
          const newContent = currentContent + quantiteConsommee;

          await tx.product.update({
            where: { id: suivi.productId },
            data: { content: newContent.toString() },
          });
        }
      }

      // Supprimer le suivi
      await tx.suiviQuotidien.delete({
        where: { id },
      });

      return { success: true, message: `Suivi quotidien ${id} deleted successfully` };
    });

    return result;
  } catch (error) {
    console.error(`Error deleting suivi quotidien ${id}:`, error);
    throw error;
  }
};

/**
 * Obtenir les statistiques d'un lot sur une période
 */
export const getStatistiquesLot = async (
  lotId: string, 
  dateDebut?: Date, 
  dateFin?: Date
) => {
  try {
    const where: any = { lotId };
    
    if (dateDebut || dateFin) {
      where.dateSuivi = {};
      if (dateDebut) where.dateSuivi.gte = dateDebut;
      if (dateFin) where.dateSuivi.lte = dateFin;
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
      stats.moyenneMortaliteParJour = stats.totalMortalite / stats.nombreJours;
      stats.moyenneAlimentParJour = stats.totalAlimentKg / stats.nombreJours;
    }

    return stats;
  } catch (error) {
    console.error(`Error getting statistics for lot ${lotId}:`, error);
    throw error;
  }
};

export const suiviQuotidienDal = {
  create: createSuiviQuotidien,
  getById: getSuiviQuotidienById,
  getAll: getSuivisQuotidiens,
  update: updateSuiviQuotidien,
  delete: deleteSuiviQuotidien,
  getStatistiques: getStatistiquesLot,
};