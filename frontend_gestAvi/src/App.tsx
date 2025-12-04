import React, { useState, useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useFarmStore } from './stores/useFarmStore';
import { Login } from './auth/login';
import { Sidebar } from './components/layout/sideBar';
import { Header } from './components/layout/header';

// Pages
import { Dashboard } from './pages/dashboard';
import { Lots } from './pages/lot';
import { Batiments } from './pages/Batiments';
import { Suivi } from './pages/Suivi';
import { Aliments } from './pages/Aliments';
import { Ventes } from './pages/Ventes';
import { Finances } from './pages/Finances';
import { Admin } from './pages/Admin';

// Modals
import { NewLotModal } from './components/modals/NewLotModal';
import { NewVenteModal } from './components/modals/NewVenteModal';
import { NewSuiviModal } from './components/modals/NewSuiviModal';
import { AddStockModal } from './components/modals/AddStockModal';
import { NewUserModal } from './components/modals/NewUserModal';
import { NewBatimentModal } from './components/modals/NewBatimentModal';

type ModalType = 
  | 'NONE' 
  | 'NEW_LOT' 
  | 'NEW_VENTE' 
  | 'NEW_SUIVI' 
  | 'ADD_STOCK' 
  | 'NEW_USER' 
  | 'NEW_BATIMENT';

export default function App() {
  const currentUser = useAuthStore(state => state.currentUser);
  const checkStockAlerts = useFarmStore(state => state.checkStockAlerts);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<ModalType>('NONE');
  const [selectedLotId, setSelectedLotId] = useState<number | undefined>();

  // Check stock alerts on mount and when aliments change
  useEffect(() => {
    if (currentUser) {
      checkStockAlerts();
    }
  }, [currentUser, checkStockAlerts]);

  const handleOpenModal = (modalType: string, lotId?: number) => {
    setModalOpen(modalType as ModalType);
    setSelectedLotId(lotId);
  };

  const handleCloseModal = () => {
    setModalOpen('NONE');
    setSelectedLotId(undefined);
  };

  // Render Login if not authenticated
  if (!currentUser) {
    return <Login />;
  }

  // Render Modals
  const renderModal = () => {
    switch (modalOpen) {
      case 'NEW_LOT':
        return <NewLotModal onClose={handleCloseModal} />;
      case 'NEW_VENTE':
        return <NewVenteModal onClose={handleCloseModal} initialLotId={selectedLotId} />;
      case 'NEW_SUIVI':
        return <NewSuiviModal onClose={handleCloseModal} initialLotId={selectedLotId} />;
      case 'ADD_STOCK':
        return <AddStockModal onClose={handleCloseModal} />;
      case 'NEW_USER':
        return <NewUserModal onClose={handleCloseModal} />;
      case 'NEW_BATIMENT':
        return <NewBatimentModal onClose={handleCloseModal} />;
      default:
        return null;
    }
  };

  // Render Active Page
  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onOpenModal={handleOpenModal} />;
      case 'lots':
        return <Lots onOpenModal={handleOpenModal} />;
      case 'batiments':
        return <Batiments onOpenModal={handleOpenModal} />;
      case 'suivi':
        return <Suivi onOpenModal={handleOpenModal} />;
      case 'aliments':
        return <Aliments onOpenModal={handleOpenModal} />;
      case 'ventes':
        return <Ventes onOpenModal={handleOpenModal} />;
      case 'finances':
        return <Finances />;
      case 'admin':
        return <Admin onOpenModal={handleOpenModal} />;
      default:
        return <Dashboard onOpenModal={handleOpenModal} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {renderModal()}
      
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-auto p-4 lg:p-8 relative">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

















// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from 'react';
// import { 
//   LayoutDashboard, Home, Bird, ClipboardList, Wheat, ShoppingCart, 
//   Wallet, Bell, LogOut, Menu, X, Plus, AlertTriangle, ChevronRight, Trash2, Users,
//   AlertCircle, TrendingUp
// } from 'lucide-react';
// import { 
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, Legend, PieChart, Pie, Cell 
// } from 'recharts';

// // ==========================================
// // 1. DÉFINITION DES TYPES (SCHEMA DE BD)
// // ==========================================

// type Role = 'ADMIN' | 'SECRETAIRE' | 'EMPLOYE';
// type StatutLot = 'DEMARRAGE' | 'CROISSANCE' | 'FINITION' | 'VENDU';
// type StatutBatiment = 'ACTIF' | 'INACTIF' | 'NETTOYAGE';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: Role;
//   avatar_color?: string;
// }

// interface Batiment {
//   id: number;
//   nom: string;
//   capacite_max: number;
//   statut: StatutBatiment;
//   occupation_actuelle: number;
// }

// interface Lot {
//   id: number;
//   code: string;
//   batiment_id: number;
//   batiment_nom: string;
//   quantite_initiale: number;
//   quantite_actuelle: number; // Diminue avec mortalité et ventes
//   date_debut: string;
//   statut: StatutLot;
//   cout_achat_poussins: number;
// }

// interface Aliment {
//   id: number;
//   nom: string;
//   stock_actuel: number; // kg
//   seuil_alerte: number;
//   seuil_critique: number;
//   prix_unitaire_moyen: number;
// }

// interface SuiviQuotidien {
//   id: number;
//   date: string;
//   lot_id: number;
//   lot_code: string;
//   mortalite: number;
//   aliment_distribue_kg: number;
//   aliment_id: number;
//   aliment_nom: string;
//   observateur: string;
//   notes?: string;
// }

// interface Vente {
//   id: number;
//   date: string;
//   lot_id: number;
//   lot_code: string;
//   quantite: number;
//   prix_unitaire: number;
//   montant_total: number; // Calculé
//   client?: string;
//   enregistre_par: string;
// }

// interface Transaction {
//   id: number;
//   date: string;
//   type: 'DEPENSE' | 'RECETTE';
//   categorie: string;
//   montant: number;
//   description: string;
//   ref_id?: number; // ID de la vente ou du lot lié
// }

// interface Notification {
//   id: number;
//   niveau: 'INFO' | 'WARNING' | 'URGENT';
//   titre: string;
//   message: string;
//   date: string;
//   lue: boolean;
// }

// // ==========================================
// // 2. DONNÉES INITIALES (SEED)
// // ==========================================

// const SEED_USERS: User[] = [
//   { id: 1, name: "Patron Admin", email: "admin@ferme.com", role: 'ADMIN', avatar_color: "bg-purple-600" },
//   { id: 2, name: "Sarah Secrétaire", email: "sarah@ferme.com", role: 'SECRETAIRE', avatar_color: "bg-blue-600" },
//   { id: 3, name: "Paul Employé", email: "paul@ferme.com", role: 'EMPLOYE', avatar_color: "bg-emerald-600" },
// ];

// const SEED_BATIMENTS: Batiment[] = [
//   { id: 1, nom: 'Poussinière Alpha', capacite_max: 1000, statut: 'ACTIF', occupation_actuelle: 950 },
//   { id: 2, nom: 'Hangar B (Croissance)', capacite_max: 2000, statut: 'ACTIF', occupation_actuelle: 0 },
//   { id: 3, nom: 'Hangar C', capacite_max: 1500, statut: 'NETTOYAGE', occupation_actuelle: 0 },
// ];

// const SEED_ALIMENTS: Aliment[] = [
//   { id: 1, nom: 'Démarrage Miettes', stock_actuel: 80, seuil_alerte: 100, seuil_critique: 50, prix_unitaire_moyen: 350 },
//   { id: 2, nom: 'Croissance Pellets', stock_actuel: 1200, seuil_alerte: 200, seuil_critique: 100, prix_unitaire_moyen: 320 },
//   { id: 3, nom: 'Finition', stock_actuel: 45, seuil_alerte: 150, seuil_critique: 80, prix_unitaire_moyen: 300 },
// ];

// const SEED_LOTS: Lot[] = [
//   { id: 1, code: 'L24-001', batiment_id: 1, batiment_nom: 'Poussinière Alpha', quantite_initiale: 1000, quantite_actuelle: 950, date_debut: '2023-10-15', statut: 'DEMARRAGE', cout_achat_poussins: 500000 },
// ];

// const SEED_TRANSACTIONS: Transaction[] = [
//   { id: 1, date: '2023-10-15', type: 'DEPENSE', categorie: 'Achat Poussins', montant: 500000, description: 'Lancement Lot L24-001 (1000 têtes)' },
//   { id: 2, date: '2023-10-16', type: 'DEPENSE', categorie: 'Achat Aliment', montant: 150000, description: 'Stock initial Démarrage' },
// ];

// const SEED_AVATAR_COLORS = ["bg-purple-600", "bg-blue-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600"];

// // ==========================================
// // 3. COMPOSANTS UTILITAIRES UI
// // ==========================================

// const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);

// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>{children}</div>
// );

// const Badge = ({ children, variant }: { children: React.ReactNode; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }) => {
//   const styles = {
//     success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
//     warning: 'bg-amber-100 text-amber-700 border-amber-200',
//     danger: 'bg-rose-100 text-rose-700 border-rose-200',
//     info: 'bg-blue-100 text-blue-700 border-blue-200',
//     neutral: 'bg-slate-100 text-slate-700 border-slate-200',
//   };
//   return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}>{children}</span>;
// };

// const Button = ({ children, onClick, variant = 'primary', icon: Icon, disabled, className = "", type = "button" }: any) => {
//   const base = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
//   const styles: any = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//     secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400",
//     danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
//     success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
//   };
//   return (
//     <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
//       {Icon && <Icon size={18} />} {children}
//     </button>
//   );
// };

// const Input = ({ label, type = "text", value, onChange, placeholder, required, min, max, disabled }: any) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-sm font-medium text-slate-700">{label} {required && <span className="text-rose-500">*</span>}</label>
//     <input 
//       type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} min={min} max={max} disabled={disabled}
//       className="px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
//     />
//   </div>
// );

// const Select = ({ label, value, onChange, options, required, disabled }: any) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-sm font-medium text-slate-700">{label} {required && <span className="text-rose-500">*</span>}</label>
//     <select 
//       value={value} onChange={onChange} required={required} disabled={disabled}
//       className="px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white transition-all disabled:bg-slate-100"
//     >
//       <option value="">-- Sélectionner --</option>
//       {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//     </select>
//   </div>
// );

// // ==========================================
// // 4. APPLICATION PRINCIPALE
// // ==========================================

// export default function App() {
//   // --- STATE DATABASE ---
//   const [users, setUsers] = useState<User[]>(SEED_USERS);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
  
//   const [batiments, setBatiments] = useState<Batiment[]>(SEED_BATIMENTS);
//   const [lots, setLots] = useState<Lot[]>(SEED_LOTS);
//   const [aliments, setAliments] = useState<Aliment[]>(SEED_ALIMENTS);
//   const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
//   const [suivis, setSuivis] = useState<SuiviQuotidien[]>([]);
//   const [ventes, setVentes] = useState<Vente[]>([]);
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   // --- STATE UI ---
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [modalOpen, setModalOpen] = useState<'NONE' | 'NEW_LOT' | 'NEW_VENTE' | 'NEW_SUIVI' | 'ADD_STOCK' | 'NEW_USER' | 'NEW_BATIMENT'>('NONE');
  
//   // --- STATE FORMS (Temp) ---
//   const [formLot, setFormLot] = useState({ batiment_id: '', quantite: '', cout: '' });
//   const [formVente, setFormVente] = useState({ lot_id: '', quantite: '', prix: '' });
//   const [formSuivi, setFormSuivi] = useState({ lot_id: '', mortalite: '0', aliment_id: '', quantite_alim: '0' });
//   const [formStock, setFormStock] = useState({ aliment_id: '', quantite: '', cout: '' });
//   const [formUser, setFormUser] = useState({ name: '', email: '', role: 'EMPLOYE' });
//   const [formBatiment, setFormBatiment] = useState({ nom: '', capacite: '' });

//   // --- EFFETS AUTOMATIQUES ---

//   // Vérification des stocks pour notifications
//   useEffect(() => {
//     const newNotifs: Notification[] = [];
//     aliments.forEach(alim => {
//       const existing = notifications.find(n => n.message.includes(alim.nom) && !n.lue);
//       if (!existing) {
//         if (alim.stock_actuel <= alim.seuil_critique) {
//           newNotifs.push({
//             id: Date.now() + Math.random(), niveau: 'URGENT', titre: 'Stock Critique',
//             message: `Le stock de ${alim.nom} est critique (${alim.stock_actuel}kg). Réapprovisionnez immédiatement.`,
//             date: new Date().toLocaleTimeString('fr-FR'), lue: false
//           });
//         } else if (alim.stock_actuel <= alim.seuil_alerte) {
//           newNotifs.push({
//             id: Date.now() + Math.random(), niveau: 'WARNING', titre: 'Stock Faible',
//             message: `Le stock de ${alim.nom} est bas (${alim.stock_actuel}kg).`,
//             date: new Date().toLocaleTimeString('fr-FR'), lue: false
//           });
//         }
//       }
//     });
//     if (newNotifs.length > 0) setNotifications(prev => [...newNotifs.filter(n => !prev.some(p => p.message === n.message)), ...prev]);
//   }, [aliments, notifications]); // Déclenché quand le stock change

//   // --- ACTIONS METIER (HANDLERS) ---

//   const handleLogin = (email: string) => {
//     const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
//     if (user) {
//       setCurrentUser(user);
//     } else {
//       alert("Email non reconnu. Veuillez réessayer."); // Utilisation d'un simple alert ici pour l'exemple de démo de login
//     }
//   };

//   const handleCreateLot = () => {
//     const bat = batiments.find(b => b.id === Number(formLot.batiment_id));
//     if (!bat) return;

//     const newLot: Lot = {
//       id: Date.now(),
//       code: `L24-${Math.floor(Math.random() * 1000)}`,
//       batiment_id: bat.id,
//       batiment_nom: bat.nom,
//       quantite_initiale: Number(formLot.quantite),
//       quantite_actuelle: Number(formLot.quantite),
//       date_debut: new Date().toISOString().split('T')[0],
//       statut: 'DEMARRAGE',
//       cout_achat_poussins: Number(formLot.cout)
//     };

//     // 1. Ajouter Lot
//     setLots([newLot, ...lots]);
//     // 2. Créer Transaction Dépense
//     setTransactions([{
//       id: Date.now(), date: new Date().toISOString().split('T')[0], type: 'DEPENSE',
//       categorie: 'Achat Poussins', montant: newLot.cout_achat_poussins, description: `Démarrage ${newLot.code}`
//     }, ...transactions]);
//     // 3. Mettre à jour Batiment
//     setBatiments(batiments.map(b => b.id === bat.id ? { ...b, occupation_actuelle: b.occupation_actuelle + newLot.quantite_initiale } : b));
    
//     setModalOpen('NONE');
//     setFormLot({ batiment_id: '', quantite: '', cout: '' });
//   };

//   const handleSuiviSubmit = () => {
//     const lotId = Number(formSuivi.lot_id);
//     const mort = Number(formSuivi.mortalite);
//     const alimId = Number(formSuivi.aliment_id);
//     const qteAlim = Number(formSuivi.quantite_alim);
    
//     const lot = lots.find(l => l.id === lotId);
//     const alim = aliments.find(a => a.id === alimId);
//     if (!lot) return;

//     // 1. Enregistrer le suivi
//     const newSuivi: SuiviQuotidien = {
//       id: Date.now(), date: new Date().toISOString().split('T')[0],
//       lot_id: lotId, lot_code: lot.code,
//       mortalite: mort, aliment_distribue_kg: qteAlim,
//       aliment_id: alimId, aliment_nom: alim ? alim.nom : 'Aucun',
//       observateur: currentUser?.name || 'Inconnu'
//     };
//     setSuivis([newSuivi, ...suivis]);

//     // 2. Mise à jour Quantité Poulets (Mortalité)
//     if (mort > 0) {
//       setLots(lots.map(l => l.id === lotId ? { ...l, quantite_actuelle: l.quantite_actuelle - mort } : l));
//       setBatiments(batiments.map(b => b.id === lot.batiment_id ? { ...b, occupation_actuelle: b.occupation_actuelle - mort } : b));
//     }

//     // 3. Mise à jour Stock Aliment
//     if (qteAlim > 0 && alim) {
//       setAliments(aliments.map(a => a.id === alimId ? { ...a, stock_actuel: a.stock_actuel - qteAlim } : a));
//     }

//     setModalOpen('NONE');
//     setFormSuivi({ lot_id: '', mortalite: '0', aliment_id: '', quantite_alim: '0' });
//   };

//   const handleVenteSubmit = () => {
//     const lotId = Number(formVente.lot_id);
//     const qte = Number(formVente.quantite);
//     const prix = Number(formVente.prix);
//     const lot = lots.find(l => l.id === lotId);
//     if (!lot) return;

//     const total = qte * prix;

//     // 1. Créer la vente
//     const newVente: Vente = {
//       id: Date.now(), date: new Date().toISOString().split('T')[0],
//       lot_id: lotId, lot_code: lot.code, quantite: qte, prix_unitaire: prix,
//       montant_total: total, enregistre_par: currentUser?.name || 'Admin'
//     };
//     setVentes([newVente, ...ventes]);

//     // 2. Créer Transaction Recette
//     setTransactions([{
//       id: Date.now(), date: new Date().toISOString().split('T')[0], type: 'RECETTE',
//       categorie: 'Vente Poulets', montant: total, description: `Vente ${qte} têtes ${lot.code}`
//     }, ...transactions]);

//     // 3. Déduire du Lot
//     const newQte = lot.quantite_actuelle - qte;
//     setLots(lots.map(l => l.id === lotId ? { 
//       ...l, 
//       quantite_actuelle: newQte,
//       statut: newQte <= 0 ? 'VENDU' : l.statut 
//     } : l));

//     // 4. Libérer Batiment
//     setBatiments(batiments.map(b => b.id === lot.batiment_id ? { ...b, occupation_actuelle: b.occupation_actuelle - qte } : b));

//     setModalOpen('NONE');
//     setFormVente({ lot_id: '', quantite: '', prix: '' });
//   };

//   const handleStockAdd = () => {
//     const alimId = Number(formStock.aliment_id);
//     const qte = Number(formStock.quantite);
//     const cout = Number(formStock.cout);
//     const alim = aliments.find(a => a.id === alimId);
//     if (!alim) return;

//     // 1. Update Stock
//     setAliments(aliments.map(a => a.id === alimId ? { ...a, stock_actuel: a.stock_actuel + qte } : a));
//     // 2. Transaction Dépense
//     setTransactions([{
//       id: Date.now(), date: new Date().toISOString().split('T')[0], type: 'DEPENSE',
//       categorie: 'Achat Aliment', montant: cout, description: `Achat ${qte}kg ${alim.nom}`
//     }, ...transactions]);

//     setModalOpen('NONE');
//     setFormStock({ aliment_id: '', quantite: '', cout: '' });
//   };

//   const handleCreateUser = () => {
//     if (currentUser?.role !== 'ADMIN') return;

//     const newUser: User = {
//       id: Date.now(),
//       name: formUser.name,
//       email: formUser.email,
//       role: formUser.role as Role,
//       avatar_color: SEED_AVATAR_COLORS[Math.floor(Math.random() * SEED_AVATAR_COLORS.length)]
//     };
//     setUsers([...users, newUser]);
//     setModalOpen('NONE');
//     setFormUser({ name: '', email: '', role: 'EMPLOYE' });
//   };

//   const handleCreateBatiment = () => {
//     const newBat: Batiment = {
//       id: Date.now(),
//       nom: formBatiment.nom,
//       capacite_max: Number(formBatiment.capacite),
//       statut: 'ACTIF',
//       occupation_actuelle: 0
//     };
//     setBatiments([...batiments, newBat]);
//     setModalOpen('NONE');
//     setFormBatiment({ nom: '', capacite: '' });
//   };

//   // --- STATISTIQUES DERIVEES ---
//   const totalRecettes = transactions.filter(t => t.type === 'RECETTE').reduce((sum, t) => sum + t.montant, 0);
//   const totalDepenses = transactions.filter(t => t.type === 'DEPENSE').reduce((sum, t) => sum + t.montant, 0);
//   const solde = totalRecettes - totalDepenses;
//   const totalPoulets = lots.filter(l => l.statut !== 'VENDU').reduce((sum, l) => sum + l.quantite_actuelle, 0);

//   // --- COMPOSANT LOGIN ---
//   const LoginView = () => {
//     const [email, setEmail] = useState('');

//     const handleSubmit = (e: React.FormEvent) => {
//       e.preventDefault();
//       handleLogin(email);
//     };

//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//           <div className="flex justify-center mb-6">
//             <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
//               <Bird size={40} className="text-white" />
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Ferme Manager Pro</h2>
//           <p className="text-center text-slate-500 mb-8">Connectez-vous à votre compte</p>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input 
//               label="Email de démonstration" 
//               type="email" 
//               placeholder="ex: admin@ferme.com"
//               value={email}
//               onChange={(e: any) => setEmail(e.target.value)}
//               required
//             />
//             <div className="text-sm text-slate-500 pt-2">
//                 <p className="font-bold mb-1">Emails de démo disponibles :</p>
//                 <ul className="list-disc list-inside space-y-0.5 text-xs ml-2">
//                     <li><Badge variant="info">ADMIN</Badge> : `admin@ferme.com`</li>
//                     <li><Badge variant="info">SECRETAIRE</Badge> : `sarah@ferme.com`</li>
//                     <li><Badge variant="info">EMPLOYE</Badge> : `paul@ferme.com`</li>
//                 </ul>
//             </div>
//             <Button type="submit" className="w-full mt-6" icon={ChevronRight}>Se connecter</Button>
//           </form>
//         </div>
//       </div>
//     );
//   };
  
//   // --- RENDU LOGIN ---
//   if (!currentUser) {
//     return <LoginView />;
//   }

//   // --- MENU DE NAVIGATION ---
//   const MENU_ITEMS = [
//     { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['ADMIN', 'SECRETAIRE', 'EMPLOYE'] },
//     { id: 'batiments', label: 'Bâtiments', icon: Home, roles: ['ADMIN', 'SECRETAIRE'] },
//     { id: 'lots', label: 'Gestion des Lots', icon: Bird, roles: ['ADMIN', 'SECRETAIRE', 'EMPLOYE'] },
//     { id: 'suivi', label: 'Suivi Quotidien', icon: ClipboardList, roles: ['ADMIN', 'SECRETAIRE', 'EMPLOYE'] },
//     { id: 'aliments', label: 'Stock Aliments', icon: Wheat, roles: ['ADMIN', 'SECRETAIRE'] },
//     { id: 'ventes', label: 'Ventes', icon: ShoppingCart, roles: ['ADMIN', 'SECRETAIRE'] },
//     { id: 'finances', label: 'Finances', icon: Wallet, roles: ['ADMIN', 'SECRETAIRE'] },
//     { id: 'admin', label: 'Administration', icon: Users, roles: ['ADMIN'] },
//   ];

//   // --- VUES DU CONTENU ---

//   // 1. DASHBOARD
//   const DashboardView = () => (
//     <div className="space-y-6 animate-fadeIn">
//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="p-4 flex items-center gap-4 bg-gradient-to-br from-blue-50 to-white">
//           <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Bird size={24} /></div>
//           <div><p className="text-sm text-slate-500">Poulets Actifs</p><p className="text-2xl font-bold text-slate-800">{totalPoulets}</p></div>
//         </Card>
//         {currentUser.role !== 'EMPLOYE' && (
//           <Card className="p-4 flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-white">
//             <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Wallet size={24} /></div>
//             <div><p className="text-sm text-slate-500">Solde Actuel</p><p className="text-2xl font-bold text-emerald-700">{formatMoney(solde)}</p></div>
//           </Card>
//         )}
//         <Card className="p-4 flex items-center gap-4 bg-gradient-to-br from-amber-50 to-white">
//           <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Wheat size={24} /></div>
//           <div>
//              <p className="text-sm text-slate-500">Stock Aliment Total</p>
//              <p className="text-2xl font-bold text-slate-800">{aliments.reduce((acc, a) => acc + a.stock_actuel, 0)} kg</p>
//           </div>
//         </Card>
//         <Card className="p-4 flex items-center gap-4 bg-gradient-to-br from-purple-50 to-white">
//           <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><AlertCircle size={24} /></div>
//           <div><p className="text-sm text-slate-500">Alertes</p><p className="text-2xl font-bold text-rose-600">{notifications.filter(n => !n.lue).length}</p></div>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2 p-6">
//           <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-blue-500"/> Performance Mortalité</h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={[
//                 {jour: 'J1', mortalite: 2}, {jour: 'J2', mortalite: 0}, {jour: 'J3', mortalite: 5}, 
//                 {jour: 'J4', mortalite: 1}, {jour: 'J5', mortalite: 3}, {jour: 'J6', mortalite: 0}, {jour: 'J7', mortalite: 2}
//               ]}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis dataKey="jour" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="mortalite" stroke="#ef4444" strokeWidth={2} dot={{r:4}} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </Card>

//         {/* Quick Actions */}
//         <Card className="p-6">
//           <h3 className="text-lg font-bold mb-4">Actions Rapides</h3>
//           <div className="space-y-3">
//             <Button className="w-full justify-start" variant="primary" icon={ClipboardList} onClick={() => setModalOpen('NEW_SUIVI')}>Saisir suivi quotidien</Button>
//             {currentUser.role !== 'EMPLOYE' && (
//               <>
//                 <Button className="w-full justify-start" variant="secondary" icon={ShoppingCart} onClick={() => setModalOpen('NEW_VENTE')}>Nouvelle Vente</Button>
//                 <Button className="w-full justify-start" variant="secondary" icon={Wheat} onClick={() => setModalOpen('ADD_STOCK')}>Réapprovisionner</Button>
//               </>
//             )}
//           </div>

//           <h3 className="text-lg font-bold mt-8 mb-4">Alertes Récentes</h3>
//           <div className="space-y-2">
//             {notifications.slice(0, 3).map(n => (
//               <div key={n.id} className={`p-3 rounded-lg text-sm border-l-4 ${n.niveau === 'URGENT' ? 'bg-rose-50 border-rose-500 text-rose-800' : 'bg-amber-50 border-amber-500 text-amber-800'}`}>
//                 <p className="font-bold">{n.titre}</p>
//                 <p>{n.message}</p>
//               </div>
//             ))}
//             {notifications.length === 0 && <p className="text-slate-400 text-sm">Aucune alerte à signaler.</p>}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );

//   // 2. LOTS VIEW
//   const LotsView = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-slate-800">Gestion des Lots</h2>
//         {currentUser.role !== 'EMPLOYE' && <Button icon={Plus} onClick={() => setModalOpen('NEW_LOT')}>Nouveau Lot</Button>}
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {lots.map(lot => (
//           <Card key={lot.id} className="relative group hover:shadow-md transition-shadow">
//             <div className={`h-2 w-full ${lot.statut === 'VENDU' ? 'bg-slate-400' : lot.statut === 'DEMARRAGE' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-slate-800">{lot.code}</h3>
//                   <p className="text-slate-500 text-sm">{lot.batiment_nom}</p>
//                 </div>
//                 <Badge variant={lot.statut === 'VENDU' ? 'neutral' : 'success'}>{lot.statut}</Badge>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="bg-slate-50 p-2 rounded">
//                   <p className="text-xs text-slate-500">Effectif</p>
//                   <p className="font-bold text-slate-800">{lot.quantite_actuelle} <span className="text-xs font-normal">/ {lot.quantite_initiale}</span></p>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded">
//                   <p className="text-xs text-slate-500">Mortalité</p>
//                   <p className="font-bold text-rose-600">{((1 - lot.quantite_actuelle/lot.quantite_initiale)*100).toFixed(1)}%</p>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Button className="flex-1 text-xs" variant="secondary" onClick={() => { setFormSuivi({...formSuivi, lot_id: String(lot.id)}); setModalOpen('NEW_SUIVI'); }}>Suivi</Button>
//                 {lot.statut !== 'VENDU' && currentUser.role !== 'EMPLOYE' && (
//                   <Button className="flex-1 text-xs" variant="primary" onClick={() => { setFormVente({...formVente, lot_id: String(lot.id)}); setModalOpen('NEW_VENTE'); }}>Vendre</Button>
//                 )}
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );

//   // 3. SUIVI VIEW
//   const SuiviView = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-slate-800">Journal de Suivi</h2>
//         <Button icon={Plus} onClick={() => setModalOpen('NEW_SUIVI')}>Saisie Journalière</Button>
//       </div>
//       <Card>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="bg-slate-50 text-slate-600 uppercase">
//               <tr>
//                 <th className="px-6 py-3">Date</th>
//                 <th className="px-6 py-3">Lot</th>
//                 <th className="px-6 py-3">Mortalité</th>
//                 <th className="px-6 py-3">Aliment (kg)</th>
//                 <th className="px-6 py-3">Type Aliment</th>
//                 <th className="px-6 py-3">Observateur</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {suivis.length === 0 ? (
//                 <tr><td colSpan={6} className="text-center py-8 text-slate-400">Aucun suivi enregistré.</td></tr>
//               ) : (
//                 suivis.map(s => (
//                   <tr key={s.id} className="hover:bg-slate-50">
//                     <td className="px-6 py-4">{s.date}</td>
//                     <td className="px-6 py-4 font-medium text-blue-600">{s.lot_code}</td>
//                     <td className="px-6 py-4 text-rose-600 font-bold">-{s.mortalite}</td>
//                     <td className="px-6 py-4">{s.aliment_distribue_kg} kg</td>
//                     <td className="px-6 py-4 text-slate-500">{s.aliment_nom}</td>
//                     <td className="px-6 py-4">{s.observateur}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );

//   // 4. BATIMENTS VIEW
//   const BatimentsView = () => (
//     <div className="space-y-6">
//        <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-slate-800">Infrastructures</h2>
//         <Button icon={Plus} onClick={() => setModalOpen('NEW_BATIMENT')}>Nouveau Bâtiment</Button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {batiments.map(bat => {
//           const occPercent = (bat.occupation_actuelle / bat.capacite_max) * 100;
//           return (
//             <Card key={bat.id} className="overflow-hidden">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="font-bold text-lg">{bat.nom}</h3>
//                   <Badge variant={bat.statut === 'ACTIF' ? 'success' : 'warning'}>{bat.statut}</Badge>
//                 </div>
//                 <div className="mb-2 flex justify-between text-sm text-slate-500">
//                   <span>Occupation</span>
//                   <span>{bat.occupation_actuelle} / {bat.capacite_max}</span>
//                 </div>
//                 <div className="w-full bg-slate-100 rounded-full h-3">
//                   <div 
//                     className={`h-3 rounded-full transition-all duration-500 ${occPercent > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} 
//                     style={{width: `${occPercent}%`}}
//                   />
//                 </div>
//               </div>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );

//   // 5. ALIMENTS VIEW
//   const AlimentsView = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-slate-800">Gestion des Stocks Aliment</h2>
//         <Button icon={Plus} onClick={() => setModalOpen('ADD_STOCK')}>Réapprovisionner</Button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {aliments.map(a => {
//           const isCritical = a.stock_actuel <= a.seuil_critique;
//           const isLow = a.stock_actuel <= a.seuil_alerte;
//           return (
//             <Card key={a.id} className={`border-l-4 ${isCritical ? 'border-l-rose-500' : isLow ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
//               <div className="p-6">
//                 <h3 className="font-bold text-lg mb-1">{a.nom}</h3>
//                 <p className="text-sm text-slate-500 mb-4">Seuil alerte: {a.seuil_alerte}kg</p>
//                 <div className="flex items-baseline gap-1">
//                   <span className={`text-4xl font-bold ${isCritical ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800'}`}>{a.stock_actuel}</span>
//                   <span className="text-slate-500">kg</span>
//                 </div>
//                 {isCritical && <div className="mt-4 text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded flex items-center gap-2"><AlertTriangle size={14}/> STOCK CRITIQUE</div>}
//               </div>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );

//   // 6. FINANCES VIEW
//   const FinancesView = () => (
//     <div className="space-y-6">
//        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card className="p-6 border-l-4 border-l-emerald-500">
//              <p className="text-slate-500 text-sm">Total Recettes</p>
//              <p className="text-2xl font-bold text-emerald-600">{formatMoney(totalRecettes)}</p>
//           </Card>
//           <Card className="p-6 border-l-4 border-l-rose-500">
//              <p className="text-slate-500 text-sm">Total Dépenses</p>
//              <p className="text-2xl font-bold text-rose-600">{formatMoney(totalDepenses)}</p>
//           </Card>
//           <Card className="p-6 border-l-4 border-l-blue-500">
//              <p className="text-slate-500 text-sm">Bilan Net</p>
//              <p className={`text-2xl font-bold ${solde >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>{formatMoney(solde)}</p>
//           </Card>
//        </div>

//        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//          <Card className="lg:col-span-2">
//             <div className="p-4 border-b border-slate-100"><h3 className="font-bold">Historique des Transactions</h3></div>
//             <div className="overflow-x-auto max-h-96">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-slate-50 text-slate-500 sticky top-0">
//                   <tr>
//                     <th className="px-4 py-3">Date</th>
//                     <th className="px-4 py-3">Description</th>
//                     <th className="px-4 py-3">Catégorie</th>
//                     <th className="px-4 py-3 text-right">Montant</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {transactions.map(t => (
//                     <tr key={t.id}>
//                       <td className="px-4 py-3">{t.date}</td>
//                       <td className="px-4 py-3">{t.description}</td>
//                       <td className="px-4 py-3"><Badge variant="neutral">{t.categorie}</Badge></td>
//                       <td className={`px-4 py-3 text-right font-bold ${t.type === 'RECETTE' ? 'text-emerald-600' : 'text-rose-600'}`}>
//                         {t.type === 'RECETTE' ? '+' : '-'} {formatMoney(t.montant)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//          </Card>
//          <Card className="p-4">
//            <h3 className="font-bold mb-4">Répartition Dépenses</h3>
//            <div className="h-64">
//              <ResponsiveContainer width="100%" height="100%">
//                <PieChart>
//                  <Pie data={transactions.filter(t => t.type === 'DEPENSE').map(t => ({ montant: t.montant, categorie: t.categorie }))} dataKey="montant" nameKey="categorie" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
//                    {/* Using static colors for demo */}
//                    {transactions.filter(t => t.type === 'DEPENSE').map((entry, index) => <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'][index % 4]} />)}
//                  </Pie>
//                  <Tooltip />
//                  <Legend />
//                </PieChart>
//              </ResponsiveContainer>
//            </div>
//          </Card>
//        </div>
//     </div>
//   );

//   // 7. ADMIN VIEW (Gestion des Utilisateurs - Lecture et Création)
//   const AdminView = () => {
//     // Seul l'Admin a accès
//     if (currentUser?.role !== 'ADMIN') {
//         return <div className="text-center p-12 text-rose-600 bg-rose-50 rounded-xl"><AlertCircle size={32} className="mx-auto mb-4"/> Accès refusé. Cette section est réservée aux administrateurs.</div>;
//     }

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-slate-800">Administration Utilisateurs</h2>
//           <Button icon={Plus} onClick={() => setModalOpen('NEW_USER')}>Nouvel Utilisateur</Button>
//         </div>
//         <Card>
//           <table className="w-full text-left text-sm">
//             <thead className="bg-slate-50 text-slate-500 uppercase">
//               <tr>
//                 <th className="px-6 py-4">Utilisateur</th>
//                 <th className="px-6 py-4">Email</th>
//                 <th className="px-6 py-4">Rôle</th>
//                 <th className="px-6 py-4 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {users.map(u => (
//                 <tr key={u.id}>
//                   <td className="px-6 py-4 font-bold">
//                     <div className="flex items-center gap-3">
//                        <div className={`w-8 h-8 rounded-full ${u.avatar_color} flex items-center justify-center text-white font-bold`}>{u.name.charAt(0)}</div>
//                        {u.name}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-slate-500">{u.email}</td>
//                   <td className="px-6 py-4"><Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'SECRETAIRE' ? 'info' : 'success'}>{u.role}</Badge></td>
//                   <td className="px-6 py-4 text-right">
//                     {u.id !== currentUser.id && ( // Empêche l'admin de se supprimer lui-même
//                        <Button variant="danger" className="p-2" icon={Trash2} onClick={() => setUsers(users.filter(x => x.id !== u.id))} />
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </Card>
//       </div>
//     );
//   };

//   // 8. VENTES VIEW
//   const VentesView = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-slate-800">Historique des Ventes</h2>
//         <Button icon={Plus} onClick={() => setModalOpen('NEW_VENTE')}>Nouvelle Vente</Button>
//       </div>
//       <Card>
//         <table className="w-full text-sm text-left">
//           <thead className="bg-slate-50 uppercase">
//             <tr>
//               <th className="px-6 py-3">Date</th>
//               <th className="px-6 py-3">Lot</th>
//               <th className="px-6 py-3">Quantité</th>
//               <th className="px-6 py-3">Prix Unit.</th>
//               <th className="px-6 py-3 text-right">Total</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {ventes.map(v => (
//               <tr key={v.id}>
//                 <td className="px-6 py-4">{v.date}</td>
//                 <td className="px-6 py-4 text-blue-600 font-medium">{v.lot_code}</td>
//                 <td className="px-6 py-4">{v.quantite}</td>
//                 <td className="px-6 py-4">{formatMoney(v.prix_unitaire)}</td>
//                 <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatMoney(v.montant_total)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Card>
//     </div>
//   );

//   // --- MODAL MANAGER ---
//   const renderModal = () => {
//     if (modalOpen === 'NONE') return null;

//     const ModalLayout = ({ title, children, onSubmit, submitLabel }: any) => (
//       <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
//         <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
//           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
//             <h3 className="font-bold text-lg text-slate-800">{title}</h3>
//             <button type="button" onClick={() => setModalOpen('NONE')} className="text-slate-400 hover:text-rose-500"><X size={20}/></button>
//           </div>
//           <div className="p-6 space-y-4">
//             {children}
//             <Button type="submit" className="w-full mt-4">{submitLabel}</Button>
//           </div>
//         </form>
//       </div>
//     );

//     if (modalOpen === 'NEW_LOT') return (
//       <ModalLayout title="Lancer un Nouveau Lot" onSubmit={handleCreateLot} submitLabel="Créer le lot">
//         <Select label="Bâtiment" options={batiments.filter(b => b.statut !== 'NETTOYAGE').map(b => ({ value: b.id, label: `${b.nom} (Cap: ${b.capacite_max - b.occupation_actuelle} restants)` }))} value={formLot.batiment_id} onChange={(e:any) => setFormLot({...formLot, batiment_id: e.target.value})} required />
//         <Input label="Quantité poussins" type="number" min="1" value={formLot.quantite} onChange={(e:any) => setFormLot({...formLot, quantite: e.target.value})} required />
//         <Input label="Investissement Total (Achat)" type="number" min="0" value={formLot.cout} onChange={(e:any) => setFormLot({...formLot, cout: e.target.value})} required />
//       </ModalLayout>
//     );

//     if (modalOpen === 'NEW_SUIVI') return (
//       <ModalLayout title="Saisie Journalière" onSubmit={handleSuiviSubmit} submitLabel="Enregistrer">
//         <Select label="Lot Concerné" options={lots.filter(l => l.statut !== 'VENDU').map(l => ({ value: l.id, label: `${l.code} (Effectif: ${l.quantite_actuelle})` }))} value={formSuivi.lot_id} onChange={(e:any) => setFormSuivi({...formSuivi, lot_id: e.target.value})} required />
//         <div className="grid grid-cols-2 gap-4">
//           <Input label="Mortalité (Nb)" type="number" min="0" value={formSuivi.mortalite} onChange={(e:any) => setFormSuivi({...formSuivi, mortalite: e.target.value})} />
//           <Input label="Aliment (kg)" type="number" min="0" value={formSuivi.quantite_alim} onChange={(e:any) => setFormSuivi({...formSuivi, quantite_alim: e.target.value})} />
//         </div>
//         <Select label="Type d'aliment" options={aliments.map(a => ({ value: a.id, label: `${a.nom} (Stock: ${a.stock_actuel}kg)` }))} value={formSuivi.aliment_id} onChange={(e:any) => setFormSuivi({...formSuivi, aliment_id: e.target.value})} />
//       </ModalLayout>
//     );

//     if (modalOpen === 'NEW_VENTE') return (
//       <ModalLayout title="Enregistrer une Vente" onSubmit={handleVenteSubmit} submitLabel="Valider la vente">
//         <Select label="Lot" options={lots.filter(l => l.statut !== 'VENDU').map(l => ({ value: l.id, label: `${l.code} (Dispo: ${l.quantite_actuelle})` }))} value={formVente.lot_id} onChange={(e:any) => setFormVente({...formVente, lot_id: e.target.value})} required />
//         <Input label="Quantité vendue" type="number" min="1" value={formVente.quantite} onChange={(e:any) => setFormVente({...formVente, quantite: e.target.value})} required />
//         <Input label="Prix Unitaire (FCFA)" type="number" min="1" value={formVente.prix} onChange={(e:any) => setFormVente({...formVente, prix: e.target.value})} required />
//         <div className="bg-slate-100 p-3 rounded text-right font-bold text-blue-600">Total: {formatMoney(Number(formVente.quantite) * Number(formVente.prix))}</div>
//       </ModalLayout>
//     );

//     if (modalOpen === 'ADD_STOCK') return (
//       <ModalLayout title="Achat d'Aliment" onSubmit={handleStockAdd} submitLabel="Confirmer Achat">
//         <Select label="Type Aliment" options={aliments.map(a => ({ value: a.id, label: a.nom }))} value={formStock.aliment_id} onChange={(e:any) => setFormStock({...formStock, aliment_id: e.target.value})} required />
//         <Input label="Quantité (kg)" type="number" min="1" value={formStock.quantite} onChange={(e:any) => setFormStock({...formStock, quantite: e.target.value})} required />
//         <Input label="Coût Total (FCFA)" type="number" min="0" value={formStock.cout} onChange={(e:any) => setFormStock({...formStock, cout: e.target.value})} required />
//       </ModalLayout>
//     );

//     if (modalOpen === 'NEW_USER') return (
//       <ModalLayout title="Créer Utilisateur" onSubmit={handleCreateUser} submitLabel="Créer">
//         {currentUser?.role === 'ADMIN' ? (
//           <>
//             <Input label="Nom complet" value={formUser.name} onChange={(e:any) => setFormUser({...formUser, name: e.target.value})} required />
//             <Input label="Email" type="email" value={formUser.email} onChange={(e:any) => setFormUser({...formUser, email: e.target.value})} required />
//             <Select label="Rôle" options={[{value:'ADMIN', label:'Admin'}, {value:'SECRETAIRE', label:'Secrétaire'}, {value:'EMPLOYE', label:'Employé'}]} value={formUser.role} onChange={(e:any) => setFormUser({...formUser, role: e.target.value})} required />
//           </>
//         ) : (
//           <p className="text-rose-500 font-medium">Vous n'avez pas la permission de créer de nouveaux utilisateurs.</p>
//         )}
//       </ModalLayout>
//     );

//      if (modalOpen === 'NEW_BATIMENT') return (
//       <ModalLayout title="Créer Bâtiment" onSubmit={handleCreateBatiment} submitLabel="Créer">
//         <Input label="Nom" value={formBatiment.nom} onChange={(e:any) => setFormBatiment({...formBatiment, nom: e.target.value})} required />
//         <Input label="Capacité Max" type="number" min="1" value={formBatiment.capacite} onChange={(e:any) => setFormBatiment({...formBatiment, capacite: e.target.value})} required />
//       </ModalLayout>
//     );
//   };

//   // --- MAIN LAYOUT RENDER ---
//   return (
//     <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
//       {renderModal()}
      
//       {/* SIDEBAR */}
//       <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
//         <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
//           <div className="bg-blue-600 p-1.5 rounded-lg"><Bird size={20} className="text-white" /></div>
//           <span className="font-bold text-xl text-white">Ferme<span className="text-blue-500">App</span></span>
//           <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400"><X size={20} /></button>
//         </div>
        
//         <nav className="p-4 space-y-1">
//           {MENU_ITEMS.filter(item => item.roles.includes(currentUser.role)).map(item => (
//             <button
//               key={item.id}
//               onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
//             >
//               <item.icon size={20} />
//               <span className="font-medium">{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
//           <div className="flex items-center gap-3 mb-4">
//             <div className={`w-10 h-10 rounded-full ${currentUser.avatar_color} flex items-center justify-center text-white font-bold`}>{currentUser.name.charAt(0)}</div>
//             <div className="overflow-hidden">
//               <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
//               <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
//             </div>
//           </div>
//           <button onClick={() => setCurrentUser(null)} className="w-full flex items-center justify-center gap-2 p-2 rounded border border-slate-700 hover:bg-slate-800 text-rose-400 text-sm transition-colors">
//             <LogOut size={16} /> Déconnexion
//           </button>
//         </div>
//       </aside>

//       {/* CONTENT AREA */}
//       <div className="flex-1 flex flex-col min-w-0">
//         <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-20">
//           <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600"><Menu size={24} /></button>
//           <div className="ml-auto flex items-center gap-4">
//             <div className="relative group">
//               <Bell size={20} className={`cursor-pointer transition-colors ${notifications.filter(n=>!n.lue).length > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
//               {notifications.filter(n=>!n.lue).length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">{notifications.filter(n=>!n.lue).length}</span>}
//               {/* Dropdown Notifs */}
//               <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-xl border border-slate-100 hidden group-hover:block p-2 z-50">
//                  <h4 className="font-bold text-xs uppercase text-slate-400 mb-2 px-2">Notifications</h4>
//                  {notifications.length === 0 ? <p className="text-sm p-2 text-slate-500">Rien à signaler</p> : 
//                    notifications.slice(0, 5).map(n => (
//                      <div key={n.id} className="p-2 hover:bg-slate-50 rounded border-b border-slate-50 last:border-0">
//                        <p className={`text-xs font-bold ${n.niveau === 'URGENT' ? 'text-rose-600' : 'text-amber-600'}`}>{n.titre}</p>
//                        <p className="text-xs text-slate-600">{n.message}</p>
//                      </div>
//                    ))
//                  }
//               </div>
//             </div>
//             <div className="h-6 w-px bg-slate-200" />
//             <div className="text-right hidden sm:block">
//               <p className="text-xs text-slate-400">Date du jour</p>
//               <p className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-auto p-4 lg:p-8 relative">
//            {activeTab === 'dashboard' && <DashboardView />}
//            {activeTab === 'batiments' && <BatimentsView />}
//            {activeTab === 'lots' && <LotsView />}
//            {activeTab === 'suivi' && <SuiviView />}
//            {activeTab === 'aliments' && <AlimentsView />}
//            {activeTab === 'ventes' && <VentesView />}
//            {activeTab === 'finances' && <FinancesView />}
//            {activeTab === 'admin' && <AdminView />}
//         </main>
//       </div>
//     </div>
//   );
// }
