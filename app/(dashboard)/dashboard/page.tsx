'use client';

// import { getProduct } from "@/dal/product/get-produt";
// import { useAuthStore } from "@/stores";
// import Image from "next/image";
// import { useEffect } from "react";

// export default function Home() {
//   const { company } = useAuthStore();

//   // Si company n'est pas encore chargé
//   if (!company) {
//     return <div>Loading...</div>;
//   }

//   useEffect(() => {
//     getProduct(company);
//   }, [company]);

//   return (
//    <div className="min-h-screen w-full bg-gray-100 dark:bg-black py-16">
//       <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-10">
        
//         {/* Header */}
//         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
//           👋 Bonjour, {company.name}
//         </h1>
//         <p className="text-gray-600 dark:text-gray-300 mb-10">
//           Voici les informations de votre boutique connectée à Genuka.
//         </p>

//         {/* Card Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

//           {/* Company ID */}
//           <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-sm">
//             <p className="text-sm text-gray-500 dark:text-gray-400">Company ID</p>
//             <p className="text-lg font-semibold text-gray-900 dark:text-white">
//               {company.id}
//             </p>
//           </div>

//           {/* Phone */}
//           <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-sm">
//             <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
//             <p className="text-lg font-semibold text-gray-900 dark:text-white">
//               {company.phone ?? "Non renseigné"}
//             </p>
//           </div>

//           {/* Created At */}
//           <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-sm">
//             <p className="text-sm text-gray-500 dark:text-gray-400">Créé le</p>
//             <p className="text-lg font-semibold text-gray-900 dark:text-white">
//               {new Date(company.createdAt).toLocaleDateString()}
//             </p>
//           </div>

//         </div>


//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateShop } from '@/dal/shop/create.shop';
import { GetShops } from '@/dal/shop/get.shop';
import { UpdateShop } from '@/dal/shop/update.shop';
import { DeleteShop } from '@/dal/shop/delete.shop';
import { Shop, User, UserShop } from '@/types/model';
import { Store, Users, Link2, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthStore } from '@/stores';
import { getUsers } from '@/dal/user';

export default function DashboardPage() {
  //
  const [stats, setStats] = useState({
    shops: 0,
    users: 0,
    assignments: 0,
  });
  const [recentShops, setRecentShops] = useState<Shop[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useAuthStore();

  useEffect(() => {
        const fetchData = async () => {
          try {
            //users, assignments
            const [shops, ] = await Promise.all([
              GetShops(company?.id || ''),
              // getUsers(company),
              // getUserShops(),
            ]);

            // setStats({
            //   shops: shops.length
            // });

            // setRecentShops(shops.slice(0, 5));
            // setRecentUsers(users.slice(0, 5));
          }catch (error) {
            console.error('Failed to fetch dashboard data:', error);
          } finally {
            setIsLoading(false);
          }
        };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Shops',
      value: stats.shops,
      icon: Store,
      description: 'Active retail locations',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
      href: '/shops',
    },
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      description: 'Registered employees',
      color: 'text-green-600 bg-green-50 dark:bg-green-950',
      href: '/users',
    },
    {
      title: 'Shop Assignments',
      value: stats.assignments || [],
      icon: Link2,
      description: 'User-shop connections',
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-950',
      href: '/assignments',
    },
  ];

  if (isLoading) {
    return (
      <div>
        <Header title="Dashboard" description="Overview of your business operations" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" description="Overview of your business operations" />

      <div className="p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Shops</CardTitle>
                  <CardDescription>Latest registered shops</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/shops">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentShops.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No shops yet</p>
              ) : (
                <div className="space-y-3">
                  {recentShops.map((shop) => (
                    <div
                      key={shop.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                        <Store className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{shop.name}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {shop.description || 'No description'}
                        </p>
                      </div>
                      <div className="text-xs text-slate-400">
                        {shop.currencyCode}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest registered employees</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/users">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No users yet</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">
                          {user.firstName?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="text-xs text-slate-400 capitalize">
                        {user.role}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
