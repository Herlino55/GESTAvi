export interface Notification {
  id: number;
  niveau: 'INFO' | 'WARNING' | 'URGENT';
  titre: string;
  message: string;
  date: string;
  lue: boolean;
}