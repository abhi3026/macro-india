
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Formats a number as currency with the specified options
 */
export function formatCurrency(
  value: number, 
  currency: string = "INR", 
  locale: string = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a number as a percentage with the specified options
 */
export function formatPercent(
  value: number, 
  digits: number = 2, 
  locale: string = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100);
}

/**
 * Truncates a string to the specified length and adds an ellipsis
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Generates an array of dates between two dates
 */
export function generateDateArray(
  startDate: Date, 
  endDate: Date, 
  step: number = 1
): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + step);
  }
  
  return dates;
}

/**
 * Formats a date string to a localized format
 */
export function formatDate(
  dateString: string, 
  locale: string = "en-IN", 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, options);
}
