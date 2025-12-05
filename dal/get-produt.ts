export const getProduct = async (company: any) => {
  console.log("Getting product for company:", company);

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
      "https://api-staging.genuka.com/2023-11/admin/products/",
      options
    );
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};
