export type ContactType = 'medico' | 'avvocato' | 'commercialista' | 'assicurazione' | 'tecnico' | 'emergenza' | 'altro';

export interface Contact {
  id: string;
  name: string;
  type: ContactType;
  specialization?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  emergency: boolean;
}

export interface CreateContactInput {
  name: string;
  type: ContactType;
  specialization?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  emergency?: boolean;
}

export interface UpdateContactInput {
  name?: string;
  type?: ContactType;
  specialization?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  emergency?: boolean;
}

export interface ContactFilters {
  searchTerm?: string;
  type?: ContactType | 'all';
}

export interface ContactGroup {
  type: ContactType;
  contacts: Contact[];
}

export interface ContactStats {
  total: number;
  emergency: number;
  byType: Record<ContactType, number>;
}