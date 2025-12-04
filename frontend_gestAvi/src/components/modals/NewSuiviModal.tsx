import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { useFarmStore } from '../../stores/useFarmStore';
import { useAuthStore } from '../../stores/useAuthStore';

interface NewSuiviModalProps {
  onClose: () => void;
  initialLotId?: number;
}

export const NewSuiviModal: React.FC<NewSuiviModalProps> = ({ onClose, initialLotId }) => {
  const { lots, aliments, addSuivi } = useFarmStore();
  const { currentUser } = useAuthStore();
  const [formData, setFormData] = useState({
    lot_id: initialLotId ? String(initialLotId) : '',
    mortalite: '0',
    aliment_id: '',
    quantite_alim: '0'
  });

  const handleSubmit = () => {
    if (!currentUser) return;

    addSuivi({
      lot_id: Number(formData.lot_id),
      mortalite: Number(formData.mortalite),
      aliment_id: Number(formData.aliment_id),
      quantite_alim: Number(formData.quantite_alim),
      observateur: currentUser.name
    });
    onClose();
  };

  return (
    <ModalLayout 
      title="Saisie Journalière" 
      onSubmit={handleSubmit} 
      onClose={onClose}
      submitLabel="Enregistrer"
    >
      <Select
        label="Lot Concerné"
        options={lots
          .filter(l => l.statut !== 'VENDU')
          .map(l => ({
            value: l.id,
            label: `${l.code} (Effectif: ${l.quantite_actuelle})`
          }))}
        value={formData.lot_id}
        onChange={(e) => setFormData({ ...formData, lot_id: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Mortalité (Nb)"
          type="number"
          min="0"
          value={formData.mortalite}
          onChange={(e) => setFormData({ ...formData, mortalite: e.target.value })}
        />
        <Input
          label="Aliment (kg)"
          type="number"
          min="0"
          value={formData.quantite_alim}
          onChange={(e) => setFormData({ ...formData, quantite_alim: e.target.value })}
        />
      </div>
      <Select
        label="Type d'aliment"
        options={aliments.map(a => ({
          value: a.id,
          label: `${a.nom} (Stock: ${a.stock_actuel}kg)`
        }))}
        value={formData.aliment_id}
        onChange={(e) => setFormData({ ...formData, aliment_id: e.target.value })}
      />
    </ModalLayout>
  );
};