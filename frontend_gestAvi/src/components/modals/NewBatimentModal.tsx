import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { Input } from '../ui/input';
import { useFarmStore } from '../../stores/useFarmStore';

interface NewBatimentModalProps {
  onClose: () => void;
}

export const NewBatimentModal: React.FC<NewBatimentModalProps> = ({ onClose }) => {
  const { addBatiment } = useFarmStore();
  const [formData, setFormData] = useState({
    nom: '',
    capacite: ''
  });

  const handleSubmit = () => {
    addBatiment({
      nom: formData.nom,
      capacite_max: Number(formData.capacite)
    });
    onClose();
  };

  return (
    <ModalLayout 
      title="Créer Bâtiment" 
      onSubmit={handleSubmit} 
      onClose={onClose}
      submitLabel="Créer"
    >
      <Input
        label="Nom"
        value={formData.nom}
        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
        required
      />
      <Input
        label="Capacité Max"
        type="number"
        min="1"
        value={formData.capacite}
        onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
        required
      />
    </ModalLayout>
  );
};