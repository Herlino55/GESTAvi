export type Role = 'ADMIN' | 'SECRETAIRE' | 'EMPLOYE';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_color?: string;
}
