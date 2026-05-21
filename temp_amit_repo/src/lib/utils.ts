import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function openExternalUrl(url: string, target: "_blank" | "_self" = "_blank") {
  if (!url) return;

  if (target === "_self") {
    window.location.assign(url);
    return;
  }

  // Attempt to open in new tab. Fallback to _self should NOT be done for cross-origin game links!
  window.open(url, "_blank", "noopener,noreferrer");
}
