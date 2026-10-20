import type { 
  Deadline, 
  CreateDeadlineInput, 
  UpdateDeadlineInput, 
  Property, 
  Document, 
  Expense, 
  Event, 
  Contact, 
  Vehicle, 
  Workout, 
  DashboardStats, 
  Booking 
} from '../types';

// API Base URL - used for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Classe per gestire tutte le chiamate API
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    // In development, use relative URLs to leverage Vite's proxy
    this.baseUrl = baseUrl;
  }

  // Helper per gestire response
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as any;
  }

  // Helper per chiamate GET
  private async get<T>(endpoint: string): Promise<T> {
    const url = isDevelopment ? `/api${endpoint}` : `${this.baseUrl}/api${endpoint}`;
    console.log(`Making GET request to: ${url}`);
    const response = await fetch(url);
    return this.handleResponse<T>(response);
  }

  // Helper per chiamate POST
  private async post<T>(endpoint: string, data: any): Promise<T> {
    const url = isDevelopment ? `/api${endpoint}` : `${this.baseUrl}/api${endpoint}`;
    console.log(`Making POST request to: ${url}`, data);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  // Helper per chiamate PUT
  private async put<T>(endpoint: string, data: any): Promise<T> {
    const url = isDevelopment ? `/api${endpoint}` : `${this.baseUrl}/api${endpoint}`;
    console.log(`Making PUT request to: ${url}`, data);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  // Helper per chiamate DELETE
  private async delete<T>(endpoint: string): Promise<T> {
    const url = isDevelopment ? `/api${endpoint}` : `${this.baseUrl}/api${endpoint}`;
    console.log(`Making DELETE request to: ${url}`);
    const response = await fetch(url, {
      method: 'DELETE',
    });
    return this.handleResponse<T>(response);
  }

  // === DEADLINES API ===
  async getDeadlines(): Promise<Deadline[]> {
    return this.get<Deadline[]>('/deadlines');
  }

  async createDeadline(deadline: CreateDeadlineInput): Promise<Deadline> {
    return this.post<Deadline>('/deadlines', deadline);
  }

  async updateDeadline(id: string, deadline: UpdateDeadlineInput): Promise<Deadline> {
    return this.put<Deadline>(`/deadlines/${id}`, deadline);
  }

  async deleteDeadline(id: string): Promise<Deadline> {
    return this.delete<Deadline>(`/deadlines/${id}`);
  }

  // === PROPERTIES API ===
  async getProperties(): Promise<Property[]> {
    return this.get<Property[]>('/properties');
  }

  async createProperty(property: Property): Promise<Property> {
    return this.post<Property>('/properties', property);
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    return this.put<Property>(`/properties/${id}`, property);
  }

  async deleteProperty(id: string): Promise<Property> {
    return this.delete<Property>(`/properties/${id}`);
  }

  // === DOCUMENTS API ===
  async getDocuments(): Promise<Document[]> {
    return this.get<Document[]>('/documents');
  }

  async createDocument(document: Document): Promise<Document> {
    return this.post<Document>('/documents', document);
  }

  async updateDocument(id: string, document: Partial<Document>): Promise<Document> {
    return this.put<Document>(`/documents/${id}`, document);
  }

  async deleteDocument(id: string): Promise<Document> {
    return this.delete<Document>(`/documents/${id}`);
  }

  // === EXPENSES API ===
  async getExpenses(): Promise<Expense[]> {
    return this.get<Expense[]>('/expenses');
  }

  async createExpense(expense: Expense): Promise<Expense> {
    return this.post<Expense>('/expenses', expense);
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    return this.put<Expense>(`/expenses/${id}`, expense);
  }

  async deleteExpense(id: string): Promise<Expense> {
    return this.delete<Expense>(`/expenses/${id}`);
  }

  // === EVENTS API ===
  async getEvents(): Promise<Event[]> {
    return this.get<Event[]>('/events');
  }

  async createEvent(event: Event): Promise<Event> {
    return this.post<Event>('/events', event);
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    return this.put<Event>(`/events/${id}`, event);
  }

  async deleteEvent(id: string): Promise<Event> {
    return this.delete<Event>(`/events/${id}`);
  }

  // === CONTACTS API ===
  async getContacts(): Promise<Contact[]> {
    return this.get<Contact[]>('/contacts');
  }

  async createContact(contact: Contact): Promise<Contact> {
    return this.post<Contact>('/contacts', contact);
  }

  async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    return this.put<Contact>(`/contacts/${id}`, contact);
  }

  async deleteContact(id: string): Promise<Contact> {
    return this.delete<Contact>(`/contacts/${id}`);
  }

  // === VEHICLES API ===
  async getVehicles(): Promise<Vehicle[]> {
    return this.get<Vehicle[]>('/vehicles');
  }

  async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    return this.post<Vehicle>('/vehicles', vehicle);
  }

  // === WORKOUTS API ===
  async getWorkouts(): Promise<Workout[]> {
    return this.get<Workout[]>('/workouts');
  }

  async createWorkout(workout: Workout): Promise<Workout> {
    return this.post<Workout>('/workouts', workout);
  }

  async updateWorkout(id: string, workout: Partial<Workout>): Promise<Workout> {
    return this.put<Workout>(`/workouts/${id}`, workout);
  }

  async deleteWorkout(id: string): Promise<Workout> {
    return this.delete<Workout>(`/workouts/${id}`);
  }

  // === BOOKINGS API ===
  async getBookings(): Promise<Booking[]> {
    return this.get<Booking[]>('/bookings');
  }

  async createBooking(booking: Booking): Promise<Booking> {
    return this.post<Booking>('/bookings', booking);
  }

  async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
    return this.put<Booking>(`/bookings/${id}`, booking);
  }

  async deleteBooking(id: string): Promise<Booking> {
    return this.delete<Booking>(`/bookings/${id}`);
  }

  // === PROFILE API ===
  async getProfile(): Promise<any> {
    return this.get<any>('/profile');
  }

  async updateProfile(profile: any): Promise<any> {
    return this.put<any>('/profile', profile);
  }

  // === DASHBOARD API ===
  async getDashboardRecentActivity(): Promise<any[]> {
    return this.get<any[]>('/dashboard/recent-activity');
  }

  async getDashboardUpcomingEvents(): Promise<Event[]> {
    return this.get<Event[]>('/dashboard/upcoming-events');
  }

  async getDashboardOverdueDeadlines(): Promise<Deadline[]> {
    return this.get<Deadline[]>('/dashboard/overdue-deadlines');
  }

  async getDashboardMonthlyExpenses(): Promise<any[]> {
    return this.get<any[]>('/dashboard/monthly-expenses');
  }
}

// Istanza singleton del servizio API
const apiService = new ApiService();

export { apiService };
export default ApiService;
