/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Plus, AlertCircle, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AdminProps {
  users: any[];
  currentUser: any;
  deleteUser: (id: string) => void;
  addUser: (newUser: any) => void;
}

export const Admin: React.FC<AdminProps> = ({
  users,
  currentUser,
  deleteUser,
  addUser
}) => {

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "ADMIN",
  });

  const handleCreate = () => {
    if (formData.password !== formData.confirm) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      avatar_color: "bg-blue-500"
    };

    addUser(newUser);

    // Reset form + close
    setFormData({ name: "", email: "", password: "", confirm: "", role: "ADMIN" });
    setIsCreateOpen(false);
  };

  const handleDelete = () => {
    deleteUser(userToDelete.id);
    setUserToDelete(null);
    setIsDeleteOpen(false);
  };

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

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Administration Utilisateurs</h2>

        {/* BTN OUVRIR MODAL AJOUT */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Ajouter un admin
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
            </DialogHeader>

            <form className="space-y-3 mt-3">
              {/* NOM */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Nom complet</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded border focus:ring"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom et prénom"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded border focus:ring"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Mot de passe</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded border focus:ring"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mot de passe"
                />
              </div>

              {/* CONFIRM */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Confirmer</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded border focus:ring"
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  placeholder="Confirmez le mot de passe"
                />
              </div>

              {/* ROLE */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Rôle</label>
                <select
                  className="w-full px-3 py-2 rounded border focus:ring"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="SECRETAIRE">SECRÉTAIRE</option>
                </select>
              </div>

              <Button
                type="button"
                className="w-full bg-slate-800 hover:bg-slate-900"
                onClick={handleCreate}
              >
                Créer le compte
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* LISTE UTILISATEURS */}
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

          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 font-bold flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${u.avatar_color} flex items-center justify-center text-white font-bold`}>
                    {u.name.charAt(0)}
                  </div>
                  {u.name}
                </td>

                <td className="px-6 py-4 text-slate-500">{u.email}</td>

                <td className="px-6 py-4">
                  <Badge>{u.role}</Badge>
                </td>

                <td className="px-6 py-4 text-right">
                  {u.id !== currentUser.id && (
                    <Button
                      variant="destructive"
                      className="p-2"
                      onClick={() => {
                        setUserToDelete(u);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* MODAL CONFIRM DELETE */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer cet utilisateur ?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-600">
            Voulez-vous vraiment supprimer l’utilisateur :  
            <strong> {userToDelete?.name}</strong> ?
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Annuler
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};
