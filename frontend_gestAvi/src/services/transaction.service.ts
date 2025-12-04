/* eslint-disable @typescript-eslint/no-unused-vars */
import { Transaction } from '../types/transaction';

export const TransactionService = {
  addTransaction(data: Omit<Transaction, 'id'>, transactions: Transaction[]): Transaction {
    return {
      ...data,
      id: Date.now()
    };
  },

  getRecettes(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'RECETTE')
      .reduce((sum, t) => sum + t.montant, 0);
  },

  getDepenses(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'DEPENSE')
      .reduce((sum, t) => sum + t.montant, 0);
  },

  getBalance(transactions: Transaction[]): number {
    const recettes = this.getRecettes(transactions);
    const depenses = this.getDepenses(transactions);
    return recettes - depenses;
  },

  getTransactionsByCategory(transactions: Transaction[], categorie: string): Transaction[] {
    return transactions.filter(t => t.categorie === categorie);
  },

  getTransactionsByPeriod(
    transactions: Transaction[], 
    startDate: string, 
    endDate: string
  ): Transaction[] {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  },

  getDepensesByCategory(transactions: Transaction[]): { [key: string]: number } {
    return transactions
      .filter(t => t.type === 'DEPENSE')
      .reduce((acc, t) => {
        acc[t.categorie] = (acc[t.categorie] || 0) + t.montant;
        return acc;
      }, {} as { [key: string]: number });
  }
};