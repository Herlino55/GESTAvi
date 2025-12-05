import { CreateShopInput } from "@/types/shop";


export const CreateShop = async (shopData: CreateShopInput,company: any) => {
  console.log("creating a shop for company:", company);

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${company.accessToken}`,
      "Content-Type": "application/json",
      "X-Company": company.id,
    },
    body: JSON.stringify(shopData)
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
    console.log("Shop created successfully:", data);
    return data;
  } catch (err) {
    console.error("Error creating shop:", err);
    throw err;
  }
};