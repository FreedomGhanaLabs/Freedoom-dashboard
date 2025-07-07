// src/lib/stores/UserStore.ts
import { writable } from 'svelte/store';

export interface User {
  _id: string;
  id?: string; // Added for normalized id
  name?: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  address?: string;
  paymentMethod: string;
  createdAt: string; // Added missing timestamp
  updatedAt: string; // Added missing timestamp
  
  // Updated paymentDetails to match payload structure
  paymentDetails: {
    defaultCard: {
      id: string;
      last4: string;
      brand: string;
      expiryMonth: string;
      expiryYear: string;
      isDefault: boolean;
    } | null;
    savedCards: {
      id: string;
      last4: string;
      brand: string;
      expiryMonth: string;
      expiryYear: string;
      isDefault: boolean;
      mobileMoneyProvider?: string;
      mobileMoneyNumber?: string;
    }[];
    mobileMoneyProvider: string | null;
  };
  
  // Moved savedCards to be part of paymentDetails (but kept for backward compatibility)
  savedCards?: {
    id: string;
    last4: string;
    brand: string;
    expiryMonth: string;
    expiryYear: string;
    isDefault: boolean;
    mobileMoneyProvider?: string;
    mobileMoneyNumber?: string;
  }[];
  
  // Updated transactions structure
  transactions: {
    id?: string;
    _id?: string;
    amount: number;
    currency?: string;
    status: 'successful' | 'pending' | 'failed';
    paymentMethod?: string;
    timestamp?: string;
    createdAt?: string;
    date?: string;
    description?: string;
  }[];
  
  // Added missing transactionStats from payload
  transactionStats: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
  };
}


// // Sample data
// const sampleUsers: User[] = [
//   {
//     id: "USR001",
//     name: "John Doe",
//     firstName: '',
//     surname: '',
//     email: "john.doe@example.com",
//     phone: "+233 50 123 4567",
//     address: "123 Main St, Accra",
//     paymentMethod: "Card",
//     paymentDetails: {
//       last4: "4242",
//       brand: "Visa",
//       expiryMonth: "12",
//       expiryYear: "2025"
//     },
//     savedCards: [
//       {
//         id: "card_1",
//         last4: "4242",
//         brand: "Visa",
//         expiryMonth: "12",
//         expiryYear: "2025",
//         isDefault: true
//       },
//       {
//         id: "mm_1",
//         last4: "8901",
//         brand: "MTN Mobile Money",
//         expiryMonth: "",
//         expiryYear: "",
//         isDefault: false,
//         mobileMoneyProvider: "MTN",
//         mobileMoneyNumber: "024 123 4567"
//       }
//     ],
//     transactions: [
//       {
//         id: "TRX001",
//         amount: 150.00,
//         currency: "GHS",
//         status: "successful",
//         paymentMethod: "Card (*4242)",
//         timestamp: "2025-04-22T14:30:00Z"
//       },
//       {
//         id: "TRX002",
//         amount: 75.50,
//         currency: "GHS",
//         status: "pending",
//         paymentMethod: "MTN Mobile Money (*8901)",
//         timestamp: "2025-04-23T09:15:00Z"
//       }
//     ]
//   },
//   {
//     id: "USR002",
//     name: "Jane Smith",
//      firstName: '',
//     surname: '',
//     email: "jane.smith@example.com",
//     phone: "+233 55 987 6543",
//     address: "456 High Street, Kumasi",
//     paymentMethod: "Mobile Money",
//     paymentDetails: {
//       last4: "6789",
//       brand: "Vodafone Cash",
//       expiryMonth: "",
//       expiryYear: ""
//     },
//     savedCards: [
//       {
//         id: "mm_2",
//         last4: "6789",
//         brand: "Vodafone Cash",
//         expiryMonth: "",
//         expiryYear: "",
//         isDefault: true,
//         mobileMoneyProvider: "Vodafone",
//         mobileMoneyNumber: "020 987 6543"
//       }
//     ],
//     transactions: [
//       {
//         id: "TRX003",
//         amount: 200.00,
//         currency: "GHS",
//         status: "successful",
//         paymentMethod: "Vodafone Cash (*6789)",
//         timestamp: "2025-04-20T11:45:00Z"
//       },
//       {
//         id: "TRX004",
//         amount: 50.00,
//         currency: "GHS",
//         status: "failed",
//         paymentMethod: "Vodafone Cash (*6789)",
//         timestamp: "2025-04-21T16:20:00Z"
//       }
//     ]
//   },
//   {
//     id: "USR003",
//     name: "Kwame Mensah",
//      firstName: '',
//     surname: '',
//     email: "kwame.m@example.com",
//     phone: "+233 24 555 7890",
//     address: "78 Beach Road, Cape Coast",
//     paymentMethod: "Card",
//     paymentDetails: {
//       last4: "9876",
//       brand: "Mastercard",
//       expiryMonth: "09",
//       expiryYear: "2026"
//     },
//     savedCards: [
//       {
//         id: "card_2",
//         last4: "9876",
//         brand: "Mastercard",
//         expiryMonth: "09",
//         expiryYear: "2026",
//         isDefault: true
//       }
//     ],
//     transactions: [
//       {
//         id: "TRX005",
//         amount: 350.75,
//         currency: "GHS",
//         status: "successful",
//         paymentMethod: "Card (*9876)",
//         timestamp: "2025-04-18T13:10:00Z"
//       }
//     ]
//   }
// ];

// function createUserStore() {
//   const { subscribe, set, update } = writable<User[]>(sampleUsers);

//   return {
//     subscribe,
//     add: (user: User) => update(users => [...users, user]),
//     update: (id: string, userData: Partial<User>) => 
//       update(users => users.map(user => 
//         user.id === id ? { ...user, ...userData } : user
//       )),
//     remove: (id: string) => 
//       update(users => users.filter(user => user.id !== id)),
//     getById: (id: string) => {
//       let found: User | undefined;
//       subscribe(users => {
//         found = users.find(user => user.id === id);
//       })();
//       return found;
//     },
//     reset: () => set(sampleUsers)
//   };
// }

// export const userStore = createUserStore();