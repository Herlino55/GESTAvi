import React from 'react';
import { Plus, AlertCircle, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../stores/useAuthStore';

interface AdminProps {
  onOpenModal: (modalType: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ onOpenModal }) => {
  const { users, deleteUser, currentUser } = useAuthStore();

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="text-center p-12 text-rose-600 bg-rose-50 rounded-xl">
        <AlertCircle size={32} className="mx-auto mb-4" />
        Accès refusé. Cette section est réservée aux administrateurs.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Administration Utilisateurs</h2>
        <Button icon={Plus} onClick={() => onOpenModal('NEW_USER')}>
          Nouvel Utilisateur
        </Button>
      </div>
      <Card>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 font-bold">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${u.avatar_color} flex items-center justify-center text-white font-bold`}>
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={
                    u.role === 'ADMIN' ? 'danger' : 
                    u.role === 'SECRETAIRE' ? 'info' : 
                    'success'
                  }>
                    {u.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {u.id !== currentUser.id && (
                    <Button 
                        variant="danger"
                        className="p-2"
                        icon={Trash2}
                        onClick={() => deleteUser(u.id)} 
                        children={undefined}                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};