export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: "employee" | "manager" | "admin";
  permissions: string[];
  password: string;
  createdAt: Date;
  updatedAt: Date;
}