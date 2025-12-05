"use client";

import { getProduct } from "@/dal/product/get-produt";
import { CreateShop } from "@/dal/shop/create.shop";
import { useAuthStore } from "@/stores";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Shop } from "../generated/prisma/client";
import { CreateShopInput } from "@/types/shop";

export default function Home() {
  const { company } = useAuthStore();
  console.log('company', company)
  const [product, setProduct] = useState<Object>('')
  const ShopFormat = {
    company_id: company?.id,
    name: "La boutique de test",
    description: "C'est la boutique de Douala",
    currency_code: "XAF",
    metadata: {
      genukaId: "id"
    }
  };
  const [shop, setShop] = useState<CreateShopInput>(ShopFormat as CreateShopInput)
  // Si company n'est pas encore chargé
  if (!company) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    try{
      const p = getProduct(company);
      setProduct(p);

      if (shop) {
        console.log('contenu de log: ', shop)
        const c = CreateShop(shop, company);
        console.log('response create shop: ',c)
      }
    }catch(error){
      console.log('error: ', error)
    }
  }, [company, shop]);

  console.log('product',product);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Welcome Herlin
          </h1>
        </div>
      </main>
    </div>
  );
}
