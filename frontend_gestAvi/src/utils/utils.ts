export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XAF', 
    maximumFractionDigits: 0 
  }).format(amount);
};