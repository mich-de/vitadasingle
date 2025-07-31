export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type BookingSource = 'airbnb' | 'booking' | 'vrbo' | 'direct' | 'other';

export interface Booking {
  id: string;
  userId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  status: BookingStatus;
  source?: BookingSource;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  propertyId: string;
  propertyName?: string;
  propertyType?: string;
  notes?: string;
}

export interface CreateBookingInput {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  pricePerNight: number;
  source?: BookingSource;
  specialRequests?: string;
  propertyId: string;
  notes?: string;
}

export interface UpdateBookingInput {
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  pricePerNight?: string;
  status?: BookingStatus;
  source?: BookingSource;
  specialRequests?: string;
  propertyId?: string;
  notes?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  source?: BookingSource;
  dateRange?: {
    start: string;
    end: string;
  };
  minAmount?: number;
  maxAmount?: number;
  guests?: number;
}

export interface BookingCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  booking: Booking;
}

export interface BookingRevenue {
  month: string;
  revenue: number;
  bookings: number;
}
