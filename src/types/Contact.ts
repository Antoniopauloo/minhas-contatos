export type ContactStatus = 'pendente' | 'concluido';
export type ContactPriority = 'urgente' | 'importante' | 'normal';

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: ContactStatus;
  priority: ContactPriority;
  createdAt: Date;
}