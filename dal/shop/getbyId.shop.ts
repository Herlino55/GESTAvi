// GET SHOP BY ID
export const GetShopById = async (company: any, id: string) => {
  console.log("fetching shop by id:", id);

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
      `https://api-staging.genuka.com/2023-11/admin/shops/${id}`,
      options
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Shop fetched successfully:", data);
    return data;
  } catch (err) {
    console.error("Error fetching shop:", err);
    throw err;
  }
};