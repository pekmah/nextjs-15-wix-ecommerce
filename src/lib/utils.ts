import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function formatCurrency(
  value: number | string,
  currency: string = "KES",
) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
  }).format(Number(value));
}
