// GET ALL SHOPS
export const GetShops = async (company: any) => {
  console.log("fetching all shops for company:", company);

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



