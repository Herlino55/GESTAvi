import { User } from "../types/user";

export const SEED_USERS: User[] = [
  { id: 1, name: "Patron Admin", email: "admin@ferme.com", role: 'ADMIN', avatar_color: "bg-purple-600" },
  { id: 2, name: "Sarah Secrétaire", email: "sarah@ferme.com", role: 'SECRETAIRE', avatar_color: "bg-blue-600" },
  { id: 3, name: "Paul Employé", email: "paul@ferme.com", role: 'EMPLOYE', avatar_color: "bg-emerald-600" },
];
