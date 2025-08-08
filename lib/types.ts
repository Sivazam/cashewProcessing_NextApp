// Firm interface
export interface Firm {
  id: string;
  name: string;
  location?: string;
  createdAt: string;
}

// // Worker interface
// export interface Worker {
//   id: string;
//   name: string;
//   firmId: string;
//   phone?: string;
//   totalKgsProcessed: number;
//   totalAmount: number;
//   advanceAmount: number;
//   payoutsMade?: number; // Payouts made to the worker (optional, default 0)
//   createdAt: string;
// }

// Worker interface with avatar
export interface Worker {
  id: string;
  name: string;
  firmId: string;
  phone?: string;
  totalKgsProcessed: number;
  totalAmount: number;
  advanceAmount: number;
  payoutsMade?: number; // Optional payouts made to the worker
  createdAt: string;
  avatar?: string; // Add avatar as an optional field
}


// WorkLog interface
export interface WorkLog {
  id: string;
  workerId: string;
  firmId: string;
  date: string;
  kgsProcessed: number;
  amountEarned: number;
  createdAt: string;
}

// Payment interface
export interface Payment {
  id: string;
  workerId: string;
  firmId: string;
  date: string;
  amount: number;
  type: 'advance' | 'payout' | 'clear_advance'; // Added 'clear_advance' to the type
  createdAt: string;
}

// AppSettings interface
export interface AppSettings {
  pricePerKg: number;
  currency: string;
  theme: 'light' | 'dark';
}