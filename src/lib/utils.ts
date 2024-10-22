import { products } from "@wix/stores";
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

export function findVariant(
  product: products.Product,
  selectedOptions: Record<string, string>,
) {
  if (!product.manageVariants) return null;
  return (
    product.variants?.find((variant) => {
      return Object.entries(selectedOptions).every(
        ([key, value]) => variant.choices?.[key] === value,
      );
    }) || null
  );
}

export function checkInStock(
  product: products.Product,
  selectedOptions: Record<string, string>,
) {
  const variant = findVariant(product, selectedOptions);
  return variant
    ? variant.stock?.quantity !== 0 && variant.stock?.inStock
    : product.stock?.inventoryStatus ===
        products?.InventoryStatus.PARTIALLY_OUT_OF_STOCK;
}
