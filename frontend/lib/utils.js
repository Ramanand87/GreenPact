import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  // nkdnfkdf
  return twMerge(clsx(inputs));
}
