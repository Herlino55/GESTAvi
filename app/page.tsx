"use client";

import { getProduct } from "@/dal/get-produt";
import { useAuthStore } from "@/stores";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const { company } = useAuthStore();

  // Si company n'est pas encore chargé
  if (!company) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    getProduct(company);
  }, [company]);

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
            Welcome To {company.name}
          </h1>
        </div>
      </main>
    </div>
  );
}
