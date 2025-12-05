import { Company, Product } from "@/app/generated/prisma/client";


// Configuration de base pour les requêtes
const getRequestOptions = (company: Company, method: string, body?: any) => {
  const options: any = {
    method,
    headers: {
      Authorization: `Bearer ${company.accessToken}`,
      "Content-Type": "application/json",
      "X-Company": company.id,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

export const getProduct = async (company: any) => {
  console.log("Getting product for company:", company);

  const options = getRequestOptions(company, "GET")

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

export const getProductById = async (id: string, company: any) => {
  console.log("Getting product for company:", company);

  const options = getRequestOptions(company, "GET")

  try {
    const res = await fetch(
      `https://api-staging.genuka.com/2023-11/admin/products/${id}`,
      options
    );
   
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("product retrieved:", data);
    return data;
  } catch (err) {
    console.error(`Error fetching product ${id}:`, err);
    throw err;
  }
};

export const createProduct = async (productData: Partial<Product>, company: any) => {
  console.log("Getting product for company:", company);

  const options = getRequestOptions(company, "POST", productData)

  try {
    const res = await fetch(
      `https://api-staging.genuka.com/2023-11/admin/products/`,
      options
    );
   
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("product created successfully::", data);
    return data;
  } catch (err) {
    console.error(`Error creating product: `, err);
    throw err;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>, company: any) => {
  console.log("Getting product for company:", company);

  const options = getRequestOptions(company, "PUT", productData)

  try {
    const res = await fetch(
      `https://api-staging.genuka.com/2023-11/admin/products/${id}`,
      options
    );
   
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("product update successfully:", data);
    return data;
  } catch (err) {
    console.error(`Errorupdating product ${id}: `, err);
    throw err;
  }
};

export const deleteProduct = async (id: string, company: any) => {
  console.log("Getting product for company:", company);

  const options = getRequestOptions(company, "DELETE")

  try {
    const res = await fetch(
      `https://api-staging.genuka.com/2023-11/admin/products/${id}`,
      options
    );
   
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    if (res.status === 204) {
      console.log(`User ${id} deleted successfully`);
      return { success: true, message: `User ${id} deleted successfully` };
    }
    
    const data = await res.json();
    console.log("product delete successfully:", data);
    return data;
  } catch (err) {
    console.error(`Error deleting product ${id}: `, err);
    throw err;
  }
};


export const useApi = {
    getAll: getProduct,

    getById: getProductById,

    create: createProduct,

    update: updateProduct,
    
    delete: deleteProduct
};