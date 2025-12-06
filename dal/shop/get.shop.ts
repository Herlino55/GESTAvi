/* eslint-disable @typescript-eslint/no-explicit-any */

import { Shop } from "@/app/generated/prisma";

// GET ALL SHOPS
export const GetShops = async (company: any): Promise<Shop[]> => {

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${company.accessToken}`,
      "Content-Type": "application/json",
      "X-Company": company.id,
    },
  };

  try {
    const res = await fetch(
      "https://api-staging.genuka.com/2023-11/admin/shops",
      options
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Shops fetched successfully:", data);
    return data;
  } catch (err) {
    console.error("Error fetching shops:", err);
    throw err;
  }
};



