// src/types/entities/document.ts

export interface Document {
  id: string;
  userId: string;
  name: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  category: DocumentCategory;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory = 
  | 'personal' 
  | 'financial' 
  | 'legal' 
  | 'medical' 
  | 'contracts' 
  | 'taxes' 
  | 'insurance' 
  | 'other';

export interface CreateDocumentInput {
  name: string;
  file: File;
  category: DocumentCategory;
  tags?: string[];
}

export interface UpdateDocumentInput {
  name?: string;
  category?: DocumentCategory;
  tags?: string[];
}

export interface DocumentFilters {
  category?: DocumentCategory;
  tags?: string[];
  fileType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  minSize?: number;
  maxSize?: number;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  notes?: string;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  shareToken: string;
  expiresAt?: string;
  permissions: 'view' | 'download';
  password?: string;
  accessCount: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: DocumentCategory;
  templateUrl: string;
  fields: DocumentField[];
}

export interface DocumentField {
  name: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone';
  required: boolean;
  placeholder?: string;
  validation?: string;
}

export interface DocumentMetadata {
  author?: string;
  title?: string;
  subject?: string;
  keywords?: string[];
  createdDate?: string;
  modifiedDate?: string;
  pageCount?: number;
}
