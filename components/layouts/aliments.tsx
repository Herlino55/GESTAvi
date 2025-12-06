/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Plus, AlertTriangle, Edit, Trash2, X } from 'lucide-react';

// --- SIMULATIONS DE COMPOSANTS ---
// REMPLACEZ CES SIMULATIONS PAR VOS VRAIS COMPOSANTS DE L'UI (Shadcn/Mantine/etc.)
const Card = ({ className, children, onClick }) => (
    <div 
        className={`rounded-lg bg-white shadow-md transition duration-300 ${className}`} 
        onClick={onClick}
    >
        {children}
    </div>
);
const Button = ({ className, icon: Icon, onClick, children, type }) => (
    <button 
        type={type || 'button'}
        className={`flex items-center justify-center px-4 py-2 font-semibold rounded-lg text-sm transition duration-200 ${className}`} 
        onClick={onClick}
    >
        {Icon && <Icon size={18} className="mr-2" />}
        {children}
    </button>
);
// --- FIN DES SIMULATIONS ---

interface Aliment {
  id: number;
  nom: string;
  stock_actuel: number;
  seuil_alerte: number;
  seuil_critique: number;
}

interface AlimentsProps {
  aliments: Aliment[]; 
}


// Composant principal Aliments (avec gestion d'état interne)
export const Aliments: React.FC<AlimentsProps> = ({ aliments: initialAliments }) => {
  const [aliments, setAliments] = useState(initialAliments);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAliment, setSelectedAliment] = useState<Aliment | null>(null);

  // LOGIQUE SIMULÉE DE CRUD (non modifiée)
  const handleAddAliment = (newAlimentData: any) => {
    const newAliment = {
      id: Date.now(),
      ...newAlimentData,
      stock_actuel: parseInt(newAlimentData.stock_actuel),
      seuil_alerte: parseInt(newAlimentData.seuil_alerte),
      seuil_critique: parseInt(newAlimentData.seuil_critique),
    };
    setAliments([...aliments, newAliment]);
    setIsAddModalOpen(false);
  };

  const handleEditAliment = (updatedData: any) => {
    setAliments(aliments.map(a =>
      a.id === updatedData.id ? { 
          ...a, 
          ...updatedData,
          stock_actuel: parseInt(updatedData.stock_actuel),
          seuil_alerte: parseInt(updatedData.seuil_alerte),
          seuil_critique: parseInt(updatedData.seuil_critique),
      } : a
    ));
    setIsEditModalOpen(false);
    setSelectedAliment(null);
  };

  const handleDeleteAliment = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet aliment ?")) {
      setAliments(aliments.filter(a => a.id !== id));
      setIsEditModalOpen(false);
      setSelectedAliment(null);
    }
  };


  // --- COMPOSANT DE DIALOGUE (AJOUT) AVEC FLOU ---

  const AddAlimentModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ nom: '', stock_actuel: '0', seuil_alerte: '0', seuil_critique: '0' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    if (!isOpen) return null;

    return (
      // CLASSE AJOUTÉE : backdrop-blur-sm pour l'effet de flou léger
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-xl font-bold text-emerald-700">Ajouter un Stock</h3>
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={20} className="text-slate-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700">Nom</label><input type="text" name="nom" required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700">Stock Initial (kg)</label><input type="number" name="stock_actuel" required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700">Seuil d'Alerte (kg)</label><input type="number" name="seuil_alerte" required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700">Seuil Critique (kg)</label><input type="number" name="seuil_critique" required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" /></div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Sauvegarder</Button>
          </form>
        </Card>
      </div>
    );
  };

  // --- COMPOSANT DE DIALOGUE (MODIFICATION/SUPPRESSION) AVEC FLOU ---

  const EditAlimentModal = ({ isOpen, onClose, aliment, onSave, onDelete }) => {
    const [formData, setFormData] = useState(aliment);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev!, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    if (!isOpen || !aliment) return null;

    return (
      // CLASSE AJOUTÉE : backdrop-blur-sm pour l'effet de flou léger
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-xl font-bold text-emerald-700">Modifier {aliment.nom}</h3>
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={20} className="text-slate-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700">Nom</label><input type="text" name="nom" value={formData.nom} required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700">Stock Actuel (kg)</label><input type="number" name="stock_actuel" value={formData.stock_actuel} required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700">Seuil d'Alerte (kg)</label><input type="number" name="seuil_alerte" value={formData.seuil_alerte} required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700">Seuil Critique (kg)</label><input type="number" name="seuil_critique" value={formData.seuil_critique} required onChange={handleChange} className="w-full border p-2 rounded focus:ring-emerald-500 focus:border-emerald-500" /></div>
            
            <div className="flex justify-between gap-4 pt-2">
                <Button 
                    type="button" 
                    icon={Trash2} 
                    onClick={() => onDelete(aliment.id)} 
                    className="bg-rose-600 hover:bg-rose-700 text-white w-1/3"
                >
                    Supprimer
                </Button>
                <Button 
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white w-2/3"
                >
                    <Edit size={16} className="mr-2" />Modifier
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
      <AddAlimentModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleAddAliment}
      />
      <EditAlimentModal 
          isOpen={isEditModalOpen} 
          onClose={() => { setIsEditModalOpen(false); setSelectedAliment(null); }} 
          aliment={selectedAliment}
          onSave={handleEditAliment}
          onDelete={handleDeleteAliment}
      />


      {/* EN-TÊTE ET BOUTON D'AJOUT */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-emerald-700">Stock Alimentation</h2>
        <Button  
            onClick={() => setIsAddModalOpen(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus size={16} className="mr-2" />Ajouter
        </Button>
      </div>

      {/* GRILLE DES ALIMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> 
        {aliments.map(a => {
          const isCritical = a.stock_actuel <= a.seuil_critique;
          const isLow = a.stock_actuel <= a.seuil_alerte && a.stock_actuel > a.seuil_critique;
          
          let borderColor = 'border-l-emerald-500';
          let textColor = 'text-slate-800';

          if (isCritical) {
            borderColor = 'border-l-rose-500';
            textColor = 'text-rose-600';
          } else if (isLow) {
            borderColor = 'border-l-amber-500';
            textColor = 'text-amber-600';
          }

          return (
            <Card 
              key={a.id}
              className={`py-4 px-6 border-l-4 ${borderColor} hover:shadow-xl transition duration-300 cursor-pointer`}
              onClick={() => {
                  setSelectedAliment(a);
                  setIsEditModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg mb-1 text-slate-800">{a.nom}</h3>
                    <p className="text-sm text-slate-500 mb-2">
                      Alerte: {a.seuil_alerte} kg
                    </p>

                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${textColor}`}> 
                        {a.stock_actuel}
                      </span>
                      <span className="text-base text-slate-500 font-semibold">kg</span> 
                    </div>

                    {(isCritical || isLow) && (
                      <div 
                        className={`mt-3 text-xs font-bold p-1 rounded flex items-center gap-2 w-fit ${
                          isCritical ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'
                        }`}
                      >
                        <AlertTriangle size={14} /> 
                        {isCritical ? 'CRITIQUE' : 'FAIBLE'}
                      </div>
                    )}
                </div>
                
                {/* Icône de Modification */}
                <Edit size={20} className={`mt-2 ${isCritical ? 'text-rose-400' : 'text-slate-400'} hover:text-emerald-500 transition`} />

              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};