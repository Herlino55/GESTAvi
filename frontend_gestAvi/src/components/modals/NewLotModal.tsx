import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { useFarmStore } from '../../stores/useFarmStore';

interface NewLotModalProps {
  onClose: () => void;
}

export const NewLotModal: React.FC<NewLotModalProps> = ({ onClose }) => {
  const { batiments, createLot } = useFarmStore();
  const [formData, setFormData] = useState({
    batiment_id: '',
    quantite: '',
    cout: ''
  });

  const handleSubmit = () => {
    createLot({
      batiment_id: Number(formData.batiment_id),
      quantite: Number(formData.quantite),
      cout: Number(formData.cout)
    });
    onClose();
  };

  return (
    <ModalLayout 
      title="Lancer un Nouveau Lot" 
      onSubmit={handleSubmit} 
      onClose={onClose}
      submitLabel="Créer le lot"
    >
      <Select
        label="Bâtiment"
        options={batiments
          .filter(b => b.statut !== 'NETTOYAGE')
          .map(b => ({
            value: b.id,
            label: `${b.nom} (Cap: ${b.capacite_max - b.occupation_actuelle} restants)`
          }))}
        value={formData.batiment_id}
        onChange={(e) => setFormData({ ...formData, batiment_id: e.target.value })}
        required
      />
      <Input
        label="Quantité poussins"
        type="number"
        min="1"
        value={formData.quantite}
        onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
        required
      />
      <Input
        label="Investissement Total (Achat)"
        type="number"
        min="0"
        value={formData.cout}
        onChange={(e) => setFormData({ ...formData, cout: e.target.value })}
        required
      />
    </ModalLayout>
  );
};