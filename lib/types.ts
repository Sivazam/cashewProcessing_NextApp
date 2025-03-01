// Firm interface
export interface Firm {
  id: string;
  name: string;
  location?: string;
  createdAt: string;
}

// Worker interface
export interface Worker {
  id: string;
  name: string;
  firmId: string;
  phone?: string;
  totalKgsProcessed: number;
  totalAmount: number;
  advanceAmount: number;
  payoutsMade?: number; // Payouts made to the worker (optional, default 0)
  createdAt: string;
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
  type: 'advance' | 'payout';
  createdAt: string;
}

// AppSettings interface
export interface AppSettings {
  pricePerKg: number;
  currency: string;
  theme: 'light' | 'dark';
}