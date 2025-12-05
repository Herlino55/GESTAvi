import { Shop } from "@/app/generated/prisma/client";

// UPDATE SHOP
export const UpdateShop = async (company: any, id: string, shopData: Shop) => {
  console.log("updating shop:", id);

  const options = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${company.accessToken}`,
      "Content-Type": "application/json",
      "X-Company": company.id,
    },
    body: JSON.stringify(shopData)
  };

  try {
    const res = await fetch(
      `https://api-staging.genuka.com/2023-11/admin/shops/${id}`,
      options
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Shop updated successfully:", data);
    return data;
  } catch (err) {
    console.error("Error updating shop:", err);
    throw err;
  }
};