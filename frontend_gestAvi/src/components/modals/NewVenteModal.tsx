import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { useFarmStore } from '../../stores/useFarmStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { formatMoney } from '../../utils/utils';

interface NewVenteModalProps {
  onClose: () => void;
  initialLotId?: number;
}

export const NewVenteModal: React.FC<NewVenteModalProps> = ({ onClose, initialLotId }) => {
  const { lots, createVente } = useFarmStore();
  const { currentUser } = useAuthStore();
  const [formData, setFormData] = useState({
    lot_id: initialLotId ? String(initialLotId) : '',
    quantite: '',
    prix: ''
  });

  const handleSubmit = () => {
    if (!currentUser) return;
    
    createVente({
      lot_id: Number(formData.lot_id),
      quantite: Number(formData.quantite),
      prix_unitaire: Number(formData.prix),
      enregistre_par: currentUser.name
    });
    onClose();
  };

  const total = Number(formData.quantite) * Number(formData.prix);

  return (
    <ModalLayout 
      title="Enregistrer une Vente" 
      onSubmit={handleSubmit} 
      onClose={onClose}
      submitLabel="Valider la vente"
    >
      <Select
        label="Lot"
        options={lots
          .filter(l => l.statut !== 'VENDU')
          .map(l => ({
            value: l.id,
            label: `${l.code} (Dispo: ${l.quantite_actuelle})`
          }))}
        value={formData.lot_id}
        onChange={(e) => setFormData({ ...formData, lot_id: e.target.value })}
        required
      />
      <Input
        label="Quantité vendue"
        type="number"
        min="1"
        value={formData.quantite}
        onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
        required
      />
      <Input
        label="Prix Unitaire (FCFA)"
        type="number"
        min="1"
        value={formData.prix}
        onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
        required
      />
      <div className="bg-slate-100 p-3 rounded text-right font-bold text-blue-600">
        Total: {formatMoney(total)}
      </div>
    </ModalLayout>
  );
};