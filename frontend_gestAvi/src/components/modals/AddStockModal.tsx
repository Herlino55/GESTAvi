import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { useFarmStore } from '../../stores/useFarmStore';

interface AddStockModalProps {
  onClose: () => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({ onClose }) => {
  const { aliments, addStock } = useFarmStore();
  const [formData, setFormData] = useState({
    aliment_id: '',
    quantite: '',
    cout: ''
  });

  const handleSubmit = () => {
    addStock({
      aliment_id: Number(formData.aliment_id),
      quantite: Number(formData.quantite),
      cout: Number(formData.cout)
    });
    onClose();
  };

  return (
    <ModalLayout 
      title="Achat d'Aliment" 
      onSubmit={handleSubmit} 
      onClose={onClose}
      submitLabel="Confirmer Achat"
    >
      <Select
        label="Type Aliment"
        options={aliments.map(a => ({
          value: a.id,
          label: a.nom
        }))}
        value={formData.aliment_id}
        onChange={(e) => setFormData({ ...formData, aliment_id: e.target.value })}
        required
      />
      <Input
        label="Quantité (kg)"
        type="number"
        min="1"
        value={formData.quantite}
        onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
        required
      />
      <Input
        label="Coût Total (FCFA)"
        type="number"
        min="0"
        value={formData.cout}
        onChange={(e) => setFormData({ ...formData, cout: e.target.value })}
        required
      />
    </ModalLayout>
  );
};