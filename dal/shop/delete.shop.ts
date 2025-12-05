// DELETE SHOP
export const DeleteShop = async (company: any, id: string) => {
  console.log("deleting shop:", id);

  const options = {
    method: "DELETE",
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
    
    // DELETE peut retourner 204 No Content ou un objet JSON
    const data = res.status === 204 ? { success: true } : await res.json();
    console.log("Shop deleted successfully:", data);
    return data;
  } catch (err) {
    console.error("Error deleting shop:", err);
    throw err;
  }
};