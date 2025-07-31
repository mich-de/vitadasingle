// Quick script to check type exports
import * as allTypes from './types';

console.log('=== TYPE EXPORT CHECK ===');
console.log('Total exports from types/index.ts:', Object.keys(allTypes).length);
console.log('Booking type exists:', 'Booking' in allTypes);
console.log('\nAll exported types:');
Object.keys(allTypes).sort().forEach(key => {
  console.log(`- ${key}`);
});

// Direct import test
import { Booking } from './types/entities/booking';
console.log('\n✅ Direct Booking import successful');

export {};
