// Diagnostic file to test type imports
console.log('=== TESTING TYPE IMPORTS ===');

// Test 1: Import from types index
try {
  import type { Booking } from './types';
  console.log('✅ Import from ./types works');
} catch (e) {
  console.error('❌ Import from ./types failed:', e);
}

// Test 2: Direct import from booking file
try {
  import type { Booking } from './types/entities/booking';
  console.log('✅ Direct import from booking.ts works');
} catch (e) {
  console.error('❌ Direct import from booking.ts failed:', e);
}

// Test 3: Check what's actually in the types index
import * as types from './types';
console.log('Available exports from types:', Object.keys(types));

export {};
