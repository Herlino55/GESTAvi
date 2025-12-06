"use client";

import { getProduct } from "@/dal/product/get-produt";
import { useAuthStore } from "@/stores";
import Image from "next/image";
import { useEffect } from "react";
import LandingPage from "./landingPage/page";

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
   <div >
      <LandingPage />
    </div>
  );
}
