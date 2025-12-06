// /* eslint-disable react/no-unescaped-entities */
// import React, { useEffect } from 'react';
// import { Plus } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { GetShops } from '@/dal/shop/get.shop';
// import { useAuthStore } from "@/stores";
// import { useUi } from '@/stores/ui';
// import { Shop } from '@/app/generated/prisma';
// import { get } from 'http';

// interface Batiment {
//   id: number;
//   nom: string;
//   statut: 'ACTIF' | 'INACTIF';
//   occupation_actuelle: number;
//   capacite_max: number;
// }

// interface BatimentsProps {
//   onOpenModal: (modalType: string) => void;
//   batiments: Batiment[];
// }

// export const Batiments: React.FC<BatimentsProps> = ({ onOpenModal, batiments = [] }) => {

//   const [batimentsList, setBatimentsList] = React.useState<Shop[]>([]);
  
//   const {showLoader, showToast, hideLoader } = useUi();
//   const { company } = useAuthStore();

//   const getAllBatiments = async () => {
//     try{
//         showLoader();
//         const batimentsList = await GetShops(company?.id);
//         setBatimentsList(batimentsList as unknown as Shop[]);
//           if (batimentsList.length > 0) {
//             showToast('Bâtiments chargés avec succès', 'success');
//           } else {
//             showToast('Erreur lors du chargement des bâtiments', 'error');
//           }
//     } catch(err) {
//       console.error("Erreur lors de la récupération des bâtiments :", err);
//       showToast('Erreur lors de la récupération des bâtiments.', 'error');
//     }finally{
//       hideLoader();
//     }
//   };

//   useEffect(() => {
//     getAllBatiments();
//   }, []);
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-slate-800">Infrastructures</h2>
//         <Button onClick={() => onOpenModal('NEW_BATIMENT')}>
//             <Plus className="w-4 h-4 mr-2" />
//             Nouveau Bâtiment
//         </Button>
//       </div>

//       {batiments.length === 0 ? (
//         <p className="text-slate-500 italic">Aucun bâtiment enregistré.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {batimentsList.map((bat) => {
//             // const occPercent = (bat.currencyCode / bat.capacite_max) * 100;

//             return (
//               <Card key={bat.id} className="overflow-hidden">
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-bold text-lg">{bat.name}</h3>
//                     {/* <Badge variant={bat.metadata.statut === 'ACTIF' ? 'secondary' : 'destructive'}>
//                       {/* {bat.statut} || "ACTIF" *
//                     </Badge/}> */}
//                   </div>

//                   <div className="mb-2 flex justify-between text-sm text-slate-500">
//                     <span>Occupation</span>
//                     {/* <span>{bat.occupation_actuelle} / {bat.capacite_max}</span> */}
//                   </div>

//                   <div className="w-full bg-slate-100 rounded-full h-3">
//                     <div
//                       // className={`h-3 rounded-full transition-all duration-500 ${
//                       //   occPercent > 90 ? 'bg-rose-500' : 'bg-blue-500'
//                       // }`}
//                       // style={{ width: `${occPercent}%` }}
//                     />
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };
