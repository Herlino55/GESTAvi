/* eslint-disable @typescript-eslint/no-explicit-any */
import { Company, User } from "@/app/generated/prisma/client";

// Configuration de base pour les requêtes
const getRequestOptions = (company: any, method: string, body?: any) => {
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

// 1. GET - Récupérer tous les utilisateurs (votre fonction existante)
export const getUsers = async (company: Company) => {
  console.log("Getting users for company:", company.id);

  const options = getRequestOptions(company, "GET");

  try {
    const res = await fetch(
      "https://api-staging.genuka.com/2023-11/admin/users",
      options
    );
    const data = await res.json();
    console.log("Users retrieved:", data);
    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};

// 2. GET BY ID - Récupérer un utilisateur spécifique
export const getUserById = async (company: Company, id: string) => {
  console.log(`Getting user ${id} for company:`, company.id);

  const options = getRequestOptions(company, "GET");

  try {
    const res = await fetch(
      `https://api-staging.genuka.com/2023-11/admin/users/${id}`,
      options
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("User retrieved:", data);
    return data;
  } catch (err) {
    console.error(`Error fetching user ${id}:`, err);
    throw err;
  }
};

// 3. CREATE - Créer un nouvel utilisateur
export const createUser = async (company: Company, userData: Partial<User>) => {
  console.log("Creating new user for company:", company.id);
  console.log("User data:", userData);

  const options = getRequestOptions(company, "POST", userData);

  try {
    const res = await fetch(
      "https://api-staging.genuka.com/2023-11/admin/users",
      options
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("User created successfully:", data);
    return data;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

// 4. UPDATE - Mettre à jour un utilisateur existant
export const updateUser = async (
  company: Company, 
  id: string, 
  userData: Partial<User>
) => {
  console.log(`Updating user ${id} for company:`, company.id);
  console.log("Update data:", userData);

  const options = getRequestOptions(company, "PUT", userData);

  try {
    const res = await fetch(
      `https://api-staging.genuka.com/2023-11/admin/users/${id}`,
      options
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("User updated successfully:", data);
    return data;
  } catch (err) {
    console.error(`Error updating user ${id}:`, err);
    throw err;
  }
};

// 5. DELETE - Supprimer un utilisateur
export const deleteUser = async (company: Company, id: string) => {
  console.log(`Deleting user ${id} for company:`, company.id);

  const options = getRequestOptions(company, "DELETE");

  try {
    const res = await fetch(
      `https://api-staging.genuka.com/2023-11/admin/users/${id}`,
      options
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    // Si l'API ne retourne pas de contenu pour DELETE
    if (res.status === 204) {
      console.log(`User ${id} deleted successfully`);
      return { success: true, message: `User ${id} deleted successfully` };
    }
    
    const data = await res.json();
    console.log("User deleted successfully:", data);
    return data;
  } catch (err) {
    console.error(`Error deleting user ${id}:`, err);
    throw err;
  }
};

// Version avec gestion des erreurs améliorée
export const userApi = {
  // GET all users
  getAll: getUsers,
  
  // GET user by ID
  getById: getUserById,
  
  // CREATE user
  create: createUser,
  
  // UPDATE user
  update: updateUser,
  
  // DELETE user
  delete: deleteUser,
};

// Exemple d'utilisation
/*
const company = {
  id: "123",
  accessToken: "your-access-token-here"
};

// Récupérer tous les utilisateurs
const users = await userApi.getAll(company);

// Récupérer un utilisateur spécifique
const user = await userApi.getById(company, 1);

// Créer un nouvel utilisateur
const newUser = await userApi.create(company, {
  name: "John Doe",
  email: "john@example.com"
});

// Mettre à jour un utilisateur
const updatedUser = await userApi.update(company, 1, {
  name: "John Updated"
});

// Supprimer un utilisateur
const deletionResult = await userApi.delete(company, 1);
*/