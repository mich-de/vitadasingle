// Test file to verify Booking import works correctly
import type { Booking, BookingStatus, CreateBookingInput } from './types';

// Test that types are accessible
const testBooking: Booking = {
  id: '1',
  userId: 'user1',
  guestName: 'Test Guest',
  checkIn: '2024-01-01',
  checkOut: '2024-01-03',
  guests: 2,
  nights: 2,
  pricePerNight: 100,
  totalAmount: 200,
  status: 'confirmed',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

console.log('✅ Booking type import successful!', testBooking);

export {};
