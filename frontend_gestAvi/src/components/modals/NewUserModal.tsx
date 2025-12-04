/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ModalLayout } from './ModalLayout';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { useAuthStore } from '../../stores/useAuthStore';
import { SEED_AVATAR_COLORS } from '../../data/seed.avatarColor';

interface NewUserModalProps {
  onClose: () => void;
}

export const NewUserModal: React.FC<NewUserModalProps> = ({ onClose }) => {
  const { addUser, currentUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'EMPLOYE'
  });

  const handleSubmit = () => {
    if (currentUser?.role !== 'ADMIN') {
      alert("Vous n'avez pas la permission de créer des utilisateurs.");
      return;
    }

    addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role as any,
      avatar_color: SEED_AVATAR_COLORS[Math.floor(Math.random() * SEED_AVATAR_COLORS.length)]
    });
    onClose();
  };

  if (currentUser?.role !== 'ADMIN') {
    return (
      <ModalLayout 
        title="Créer Utilisateur" 
        onSubmit={onClose} 
        onClose={onClose}
        submitLabel="Fermer"
      >
        <p className="text-rose-500 font-medium">
          Vous n'avez pas la permission de créer de nouveaux utilisateurs.
        </p>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout 
      title="Créer Utilisateur" 
      onSubmit={handleSubmit} 
      onClose={onClose}
      submitLabel="Créer"
    >
      <Input
        label="Nom complet"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Select
        label="Rôle"
        options={[
          { value: 'ADMIN', label: 'Admin' },
          { value: 'SECRETAIRE', label: 'Secrétaire' },
          { value: 'EMPLOYE', label: 'Employé' }
        ]}
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        required
      />
    </ModalLayout>
  );
};