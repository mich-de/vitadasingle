// src/types/features/forms.ts

export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  fields: FormFieldSchema[];
  validation?: FormValidationSchema;
  layout?: FormLayout;
}

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: FormOption[];
  validation?: FieldValidation[];
  conditional?: ConditionalLogic;
  description?: string;
  helpText?: string;
}

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'date' 
  | 'time' 
  | 'datetime' 
  | 'select' 
  | 'multiselect' 
  | 'checkbox' 
  | 'radio' 
  | 'textarea' 
  | 'file' 
  | 'image' 
  | 'range' 
  | 'color' 
  | 'hidden';

export interface FormOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface FieldValidation {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
  trigger?: 'blur' | 'change' | 'submit';
}

export interface ConditionalLogic {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  action: 'show' | 'hide' | 'require' | 'optional';
}

export interface FormValidationSchema {
  [fieldName: string]: FieldValidation[];
}

export interface FormLayout {
  type: 'single_column' | 'two_column' | 'grid' | 'tabs' | 'steps';
  sections?: FormSection[];
  responsive?: boolean;
}

export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: string[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormData {
  [fieldName: string]: any;
}

export interface FormErrors {
  [fieldName: string]: string[];
}

export interface FormTouched {
  [fieldName: string]: boolean;
}

export interface FormState {
  data: FormData;
  errors: FormErrors;
  touched: FormTouched;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  submitCount: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: FormData;
  submittedAt: string;
  submittedBy?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  ipAddress?: string;
  userAgent?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  schema: FormSchema;
  preview?: string;
  tags?: string[];
  isPublic: boolean;
}

export interface FormBuilder {
  schema: FormSchema;
  activeField?: string;
  draggedField?: FormFieldSchema;
  undoStack: FormSchema[];
  redoStack: FormSchema[];
  isDirty: boolean;
  previewMode: boolean;
}

export interface FormAnalytics {
  formId: string;
  totalSubmissions: number;
  conversionRate: number;
  averageCompletionTime: number;
  abandonmentRate: number;
  fieldAnalytics: FieldAnalytics[];
  timeToComplete: number[];
}

export interface FieldAnalytics {
  fieldName: string;
  completionRate: number;
  averageTimeSpent: number;
  errorRate: number;
  mostCommonErrors: string[];
}
