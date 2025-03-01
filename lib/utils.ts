import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function generateId(): string {
  return uuidv4();
}

export function calculatePendingAmount(totalAmount: number, advanceAmount: number): number {
  return totalAmount - advanceAmount;
}