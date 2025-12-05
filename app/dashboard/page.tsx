import { getProduct } from '@/dal/product/get-produt';
import { useAuthStore } from '@/stores';
import React, { useEffect } from 'react'

export default function page() {
 const { company } = useAuthStore();

  // Si company n'est pas encore chargé
  if (!company) {
    return <div>Loading...</div>;
  }

//   useEffect(() => {
//     getProduct(company);
//   }, [company]);

  return (
   <div className="min-h-screen w-full bg-gray-100 dark:bg-black py-16">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-10">
        
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          👋 Bonjour, {company.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          Voici les informations de votre boutique connectée à Genuka.
        </p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Company ID */}
          <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Company ID</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {company.id}
            </p>
          </div>

          {/* Phone */}
          <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {company.phone ?? "Non renseigné"}
            </p>
          </div>

          {/* Created At */}
          <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Créé le</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(company.createdAt).toLocaleDateString()}
            </p>
          </div>

        </div>


      </div>
    </div>
  );
}
