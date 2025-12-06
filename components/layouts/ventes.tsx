import React, { useState } from 'react';
import { Plus, X, Edit, Trash2, Calendar, DollarSign, Package } from 'lucide-react';

// --- SIMULATIONS DE COMPOSANTS (Gardées pour la compatibilité) ---
const Card = ({ className, children }) => (
    <div className={`rounded-lg bg-white shadow-md transition duration-300 overflow-hidden ${className}`}>
        {children}
    </div>
);
const Button = ({ className, icon: Icon, onClick, children, type, variant = 'default' }) => (
    <button 
        type={type || 'button'}
        className={`flex items-center justify-center px-4 py-2 font-semibold rounded-lg text-sm transition duration-200 
        ${variant === 'default' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 
          variant === 'outline' ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : ''}
        ${className}`} 
        onClick={onClick}
    >
        {Icon && <Icon size={18} className="mr-2" />}
        {children}
    </button>
);
// --- FIN DES SIMULATIONS ---

interface Vente {
  id: number;
  date: string; // Format YYYY-MM-DD pour la facilité
  lot_code: string;
  quantite: number;
  prix_unitaire: number;
  montant_total: number;
}

interface VentesProps {
  ventes: Vente[]; // 👈 les ventes initiales viennent des props
}

// Composant principal
export const Ventes: React.FC<VentesProps> = ({ ventes: initialVentes }) => {
  const [ventes, setVentes] = useState(initialVentes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVente, setEditingVente] = useState<Vente | null>(null);

  // --- LOGIQUE CRUD SIMULÉE ---

  const handleSaveVente = (data: Omit<Vente, 'id' | 'montant_total'> & { id?: number }) => {
    const total = data.quantite * data.prix_unitaire;
    
    if (data.id) {
      // Modification
      setVentes(ventes.map(v =>
        v.id === data.id ? { ...v, ...data, montant_total: total } : v
      ));
    } else {
      // Ajout
      const newVente: Vente = {
        id: Date.now(),
        ...data,
        montant_total: total,
      } as Vente;
      setVentes([newVente, ...ventes]);
    }
    setIsModalOpen(false);
    setEditingVente(null);
  };

  const handleDeleteVente = (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette vente ?")) {
      setVentes(ventes.filter(v => v.id !== id));
      setIsModalOpen(false);
      setEditingVente(null);
    }
  };

  const openModalForNew = () => {
    setEditingVente(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (vente: Vente) => {
    setEditingVente(vente);
    setIsModalOpen(true);
  };


  // --- COMPOSANT DE DIALOGUE (AJOUT/MODIFICATION) ---
  
  const VenteModal = ({ isOpen, onClose, vente, onSave, onDelete }) => {
    const isEditing = !!vente;
    const initialData = vente || { date: new Date().toISOString().substring(0, 10), lot_code: '', quantite: 0, prix_unitaire: 0 };
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: name === 'quantite' || name === 'prix_unitaire' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ ...formData, id: isEditing ? vente!.id : undefined });
    };

    if (!isOpen) return null;

    // Calcul du total en temps réel
    const calculatedTotal = formData.quantite * formData.prix_unitaire;

    return (
      // Ajout de backdrop-blur-sm pour le fond flou
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-xl font-bold text-emerald-700">{isEditing ? `Modifier Vente #${vente?.id}` : 'Nouvelle Vente'}</h3>
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={20} className="text-slate-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Champ Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center"><Calendar size={14} className="mr-1 text-gray-500"/> Date</label>
              <input type="date" name="date" value={formData.date} required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            {/* Champ Lot */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center"><Package size={14} className="mr-1 text-gray-500"/> Code Lot</label>
              <input type="text" name="lot_code" value={formData.lot_code} required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            {/* Quantité et Prix Unitaire (Alignés) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantité Vendue</label>
                    <input type="number" name="quantite" value={formData.quantite} required onChange={handleChange} min="0" className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prix Unitaire (FCFA)</label>
                    <input type="number" name="prix_unitaire" value={formData.prix_unitaire} required onChange={handleChange} min="0" className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
            </div>

            {/* Montant Total Affiché */}
            <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded flex justify-between items-center">
                <span className="font-bold text-amber-800">Montant Total Calculé:</span>
                <span className="text-xl font-bold text-emerald-700">{calculatedTotal.toLocaleString()} FCFA</span>
            </div>
            
            <div className="flex justify-between gap-4 pt-2">
                {isEditing && (
                    <Button 
                        type="button" 
                        icon={Trash2} 
                        onClick={() => onDelete(vente!.id)} 
                        className="bg-rose-600 hover:bg-rose-700 text-white w-1/3"
                    >
                        Supprimer
                    </Button>
                )}
                <Button 
                    type="submit" 
                    icon={isEditing ? Edit : Plus} 
                    className={`${isEditing ? 'bg-amber-600 hover:bg-amber-700 w-2/3' : 'bg-emerald-600 hover:bg-emerald-700 w-full'} text-white`}
                >
                    {isEditing ? 'Sauvegarder Modifs' : 'Enregistrer Vente'}
                </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };


  return (
    <div className="space-y-6">
      
      {/* Modals */}
      <VenteModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingVente(null); }} 
          vente={editingVente}
          onSave={handleSaveVente}
          onDelete={handleDeleteVente}
      />


      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-emerald-700">Historique des Ventes</h2>
        <Button 
            icon={Plus} 
            onClick={openModalForNew} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Nouvelle Vente
        </Button>
      </div>

      <Card className="shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-emerald-50 uppercase text-emerald-800 border-b border-emerald-200">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Lot</th>
              <th className="px-6 py-3">Quantité</th>
              <th className="px-6 py-3">Prix Unit.</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {ventes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 font-medium">
                  <DollarSign size={20} className="inline mr-2 align-middle"/>
                  Aucune vente enregistrée.
                </td>
              </tr>
            ) : (
              ventes.map(v => (
                <tr key={v.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 text-gray-600">{v.date}</td>
                  <td className="px-6 py-4 text-amber-700 font-semibold">{v.lot_code}</td>
                  <td className="px-6 py-4 text-gray-800">{v.quantite.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">FCFA {v.prix_unitaire.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-700">
                    FCFA {v.montant_total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => openModalForEdit(v)}
                        className="text-emerald-500 hover:text-amber-600 p-1 rounded transition duration-150"
                        title="Modifier la vente"
                    >
                        <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};